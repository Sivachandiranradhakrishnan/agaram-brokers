import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const databaseDir = resolve(rootDir, "database");
const enquiriesFile = resolve(databaseDir, "enquiries.json");
const servicesFile = resolve(databaseDir, "services.json");
const publicDir = resolve(rootDir, "dist");

const port = Number(process.env.PORT ?? 4000);
const allowedOrigin = process.env.CORS_ORIGIN ?? "*";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

async function ensureDatabase() {
  await mkdir(databaseDir, { recursive: true });

  if (!existsSync(enquiriesFile)) {
    await writeJson(enquiriesFile, []);
  }

  if (!existsSync(servicesFile)) {
    await writeJson(servicesFile, []);
  }
}

async function readJson(filePath, fallback) {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
}

function sendJson(response, statusCode, payload) {
  setCors(response);
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        request.destroy();
        rejectBody(new Error("Request body is too large"));
      }
    });

    request.on("end", () => resolveBody(body));
    request.on("error", rejectBody);
  });
}

async function parseJsonBody(request, response) {
  try {
    const raw = await readRequestBody(request);
    return raw ? JSON.parse(raw) : {};
  } catch {
    sendJson(response, 400, { error: "Invalid JSON request." });
    return null;
  }
}

function cleanText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHighlights(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanText(item)).filter(Boolean).slice(0, 10);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => cleanText(item))
      .filter(Boolean)
      .slice(0, 10);
  }

  return [];
}

function validateService(payload, existing = null) {
  const title = cleanText(payload.title ?? existing?.title);
  const description = typeof payload.description === "string"
    ? payload.description.trim()
    : existing?.description ?? "";
  const image = typeof payload.image === "string" ? payload.image.trim() : existing?.image ?? "";
  const highlights = payload.highlights !== undefined
    ? normalizeHighlights(payload.highlights)
    : existing?.highlights ?? [];
  const active = payload.active !== undefined ? Boolean(payload.active) : existing?.active ?? true;

  if (title.length < 3) {
    return { error: "Title must be at least 3 characters." };
  }

  if (description.length < 10) {
    return { error: "Description must be at least 10 characters." };
  }

  return {
    service: {
      slug: existing?.slug ?? slugify(payload.slug || title),
      title,
      description,
      image,
      highlights,
      active,
    },
  };
}

function validateEnquiry(payload) {
  const enquiry = {
    name: cleanText(payload.name),
    phone: cleanText(payload.phone),
    service: cleanText(payload.service),
    message: typeof payload.message === "string" ? payload.message.trim() : "",
  };

  if (enquiry.name.length < 2) {
    return { error: "Please enter a valid name." };
  }

  if (!/^[+\d][\d\s()+-]{6,19}$/.test(enquiry.phone)) {
    return { error: "Please enter a valid phone number." };
  }

  if (!enquiry.service) {
    return { error: "Please select an insurance type." };
  }

  return { enquiry };
}

function isAuthorized(request) {
  const adminToken = process.env.ADMIN_TOKEN;
  return !adminToken || request.headers["x-admin-token"] === adminToken;
}

async function handleApi(request, response, url) {
  if (request.method === "OPTIONS") {
    setCors(response);
    response.writeHead(204);
    response.end();
    return true;
  }

  if (url.pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, service: "Agaram Brokers API" });
    return true;
  }

  // ---------- Services collection ----------
  if (url.pathname === "/api/services" && request.method === "GET") {
    const services = await readJson(servicesFile, []);
    const includeInactive = url.searchParams.get("all") === "1";
    sendJson(response, 200, {
      services: includeInactive ? services : services.filter((service) => service.active !== false),
    });
    return true;
  }

  if (url.pathname === "/api/services" && request.method === "POST") {
    if (!isAuthorized(request)) {
      sendJson(response, 401, { error: "Invalid admin token." });
      return true;
    }

    const payload = await parseJsonBody(request, response);
    if (!payload) return true;

    const result = validateService(payload);

    if (result.error) {
      sendJson(response, 422, { error: result.error });
      return true;
    }

    const services = await readJson(servicesFile, []);

    if (!result.service.slug) {
      sendJson(response, 422, { error: "Could not create a slug from the title." });
      return true;
    }

    if (services.some((service) => service.slug === result.service.slug)) {
      sendJson(response, 409, { error: "A service with this slug already exists." });
      return true;
    }

    services.push(result.service);
    await writeJson(servicesFile, services);
    sendJson(response, 201, { service: result.service });
    return true;
  }

  // ---------- Single service ----------
  const serviceMatch = url.pathname.match(/^\/api\/services\/([a-z0-9-]+)$/);

  if (serviceMatch) {
    const slug = serviceMatch[1];
    const services = await readJson(servicesFile, []);
    const index = services.findIndex((service) => service.slug === slug);

    if (request.method === "GET") {
      if (index === -1) {
        sendJson(response, 404, { error: "Service not found." });
      } else {
        sendJson(response, 200, { service: services[index] });
      }
      return true;
    }

    if (request.method === "PUT") {
      if (!isAuthorized(request)) {
        sendJson(response, 401, { error: "Invalid admin token." });
        return true;
      }

      if (index === -1) {
        sendJson(response, 404, { error: "Service not found." });
        return true;
      }

      const payload = await parseJsonBody(request, response);
      if (!payload) return true;

      const result = validateService(payload, services[index]);

      if (result.error) {
        sendJson(response, 422, { error: result.error });
        return true;
      }

      services[index] = result.service;
      await writeJson(servicesFile, services);
      sendJson(response, 200, { service: result.service });
      return true;
    }

    if (request.method === "DELETE") {
      if (!isAuthorized(request)) {
        sendJson(response, 401, { error: "Invalid admin token." });
        return true;
      }

      if (index === -1) {
        sendJson(response, 404, { error: "Service not found." });
        return true;
      }

      const [removed] = services.splice(index, 1);
      await writeJson(servicesFile, services);
      sendJson(response, 200, { removed });
      return true;
    }
  }

  // ---------- Enquiries ----------
  if (url.pathname === "/api/enquiries" && request.method === "GET") {
    if (!isAuthorized(request)) {
      sendJson(response, 401, { error: "Invalid admin token." });
      return true;
    }

    const enquiries = await readJson(enquiriesFile, []);
    sendJson(response, 200, { enquiries });
    return true;
  }

  if (url.pathname === "/api/enquiries" && request.method === "POST") {
    const payload = await parseJsonBody(request, response);
    if (!payload) return true;

    const result = validateEnquiry(payload);

    if (result.error) {
      sendJson(response, 422, { error: result.error });
      return true;
    }

    const enquiries = await readJson(enquiriesFile, []);
    const enquiry = {
      id: randomUUID(),
      ...result.enquiry,
      status: "new",
      source: "website",
      createdAt: new Date().toISOString(),
    };

    enquiries.unshift(enquiry);
    await writeJson(enquiriesFile, enquiries);
    sendJson(response, 201, { enquiry });
    return true;
  }

  if (url.pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "API route not found." });
    return true;
  }

  return false;
}

async function serveStatic(response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  let filePath = resolve(publicDir, `.${requestedPath}`);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = resolve(filePath, "index.html");
    }
  } catch {
    filePath = resolve(publicDir, "index.html");
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Build the frontend first with npm run build.");
  }
}

await ensureDatabase();

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const handledByApi = await handleApi(request, response, url);

    if (!handledByApi) {
      await serveStatic(response, url);
    }
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Server error." });
  }
}).listen(port, () => {
console.log(`Agaram Brokers backend running on http://localhost:${port}`);