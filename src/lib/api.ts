export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
  active: boolean;
};

export const contact = {
  phone: "+91 99944 55599",
  phoneHref: "tel:+919994455599",
  whatsapp: "https://wa.me/919994455599",
  email: "operations@agarambrokers.com",
  addressLine1: "No.35/2 First Floor, 100 Ft. Road, (Opp. EPF Office)",
  addressLine2: "O.K. Palayam, Mudaliarpet, Puducherry - 605004",
  location: "Puducherry - 605004",
  timing: "Monday to Saturday — 10am to 6pm",
};

const rawBase = import.meta.env.VITE_API_URL ?? "";
export const apiBaseUrl =
  rawBase ||
  (typeof window !== "undefined" && window.location.port === "4000"
    ? ""
    : "https://agaram-brokers.onrender.com";);

/** Fallback data used when the backend is not running (e.g. static preview). */
export const fallbackServices: Service[] = [
  {
    slug: "motor-insurance",
    title: "Motor insurance",
    description:
      "Renewals, new vehicle cover, third-party policies, and claim guidance for two-wheelers, cars, and commercial vehicles.",
    image:
      "https://images.pexels.com/photos/10341357/pexels-photo-10341357.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    highlights: [
      "Comprehensive and third-party policies",
      "Two-wheeler, car, and commercial vehicle cover",
      "Quick renewal with no-claim bonus transfer",
      "Cashless garage network guidance",
      "Accident and own-damage claim support",
    ],
    active: true,
  },
  {
    slug: "health-insurance",
    title: "Health insurance",
    description:
      "Personal, family floater, senior citizen, and top-up plans explained in simple language before you buy.",
    image:
      "https://images.pexels.com/photos/4309557/pexels-photo-4309557.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    highlights: [
      "Individual and family floater plans",
      "Senior citizen and parents cover",
      "Top-up plans for bigger protection",
      "Cashless hospital network help",
      "Claim paperwork done with you",
    ],
    active: true,
  },
  {
    slug: "life-insurance",
    title: "Life insurance",
    description:
      "Term protection, savings-linked plans, and future-ready coverage for family security and long-term goals.",
    image:
      "https://images.pexels.com/photos/14769676/pexels-photo-14769676.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    highlights: [
      "Pure term protection plans",
      "Savings and money-back options",
      "Child education and retirement goals",
      "Premium comparison across insurers",
      "Nominee and claim assistance",
    ],
    active: true,
  },
  {
    slug: "business-insurance",
    title: "Business insurance",
    description:
      "Coverage for shops, offices, small businesses, stock, liability, transit, and fire-related risks.",
    image:
      "https://images.pexels.com/photos/4473093/pexels-photo-4473093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    highlights: [
      "Shop and office package policies",
      "Stock, fire, and burglary cover",
      "Goods-in-transit protection",
      "Liability and employee cover",
      "Custom plans for small businesses",
    ],
    active: true,
  },
  {
    slug: "travel-insurance",
    title: "Travel insurance",
    description:
      "Domestic and international travel protection for medical needs, baggage delays, and trip interruptions.",
    image:
      "https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    highlights: [
      "Domestic and international plans",
      "Medical emergencies while travelling",
      "Baggage loss and delay cover",
      "Trip cancellation protection",
      "Student and family travel options",
    ],
    active: true,
  },
];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const data = (await response.json().catch(() => null)) as (T & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed (${response.status})`);
  }

  return data as T;
}

export async function fetchServices(includeInactive = false): Promise<Service[]> {
  const query = includeInactive ? "?all=1" : "";
  const data = await request<{ services: Service[] }>(`/api/services${query}`);
  return data.services;
}

export async function fetchService(slug: string): Promise<Service> {
  const data = await request<{ service: Service }>(`/api/services/${slug}`);
  return data.service;
}

export type ServicePayload = Partial<Omit<Service, "highlights">> & {
  /** The backend accepts highlights as an array or newline-separated text. */
  highlights?: string[] | string;
};

export async function createService(payload: ServicePayload): Promise<Service> {
  const data = await request<{ service: Service }>("/api/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.service;
}

export async function updateService(slug: string, payload: ServicePayload): Promise<Service> {
  const data = await request<{ service: Service }>(`/api/services/${slug}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.service;
}

export async function deleteService(slug: string): Promise<void> {
  await request<{ removed: Service }>(`/api/services/${slug}`, { method: "DELETE" });
}
