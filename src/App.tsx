import { useEffect, useMemo, useState } from "react";
import ShieldMark from "./components/ShieldMark";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import AdminPage from "./pages/AdminPage";
import { contact, fallbackServices, fetchServices, type Service } from "./lib/api";

type Route =
  | { name: "home" }
  | { name: "service"; slug: string }
  | { name: "admin" };

function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "");

  const serviceMatch = path.match(/^\/services\/([a-z0-9-]+)$/);
  if (serviceMatch) {
    return { name: "service", slug: serviceMatch[1] };
  }

  if (path === "/admin") {
    return { name: "admin" };
  }

  return { name: "home" };
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute(window.location.hash));
      setMenuOpen(false);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      setServices(await fetchServices());
    } catch {
      // Backend not running — keep the fallback list so the site still works.
      setServices(fallbackServices);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, [route.name]);

  const activeService = useMemo(() => {
    if (route.name !== "service") return null;
    return services.find((service) => service.slug === route.slug) ?? null;
  }, [route, services]);

  const navLinks = [
    { href: "#services", label: "Insurance", homeOnly: true },
    { href: "#approach", label: "Approach", homeOnly: true },
    { href: "#contact", label: "Contact", homeOnly: true },
    { href: "#/admin", label: "Admin", homeOnly: false },
  ];

  const onDarkHero = route.name !== "admin";

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#0e2238] antialiased">
      {/* Fixed top navigation shared by all pages */}
      <nav className="nav-drop fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8 sm:py-5 lg:px-10">
          <div className="rounded-full bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-950/10 backdrop-blur sm:px-4 sm:py-3">
            <a href="#/" className="flex items-center gap-2.5 sm:gap-3" aria-label="Agaram Brokers home">
              <ShieldMark className="h-9 w-9 text-[#104a7e] sm:h-11 sm:w-11" />
              <span className="leading-none">
                <span className="block text-xs font-black tracking-[0.24em] text-[#104a7e] sm:text-sm">
                  AGARAM
                </span>
                <span className="block text-[10px] font-black tracking-[0.34em] text-[#104a7e] sm:text-xs">
                  BROKERS
                </span>
              </span>
            </a>
          </div>

          <div
            className={`hidden items-center gap-7 text-sm font-semibold md:flex ${
              onDarkHero ? "text-white/85" : "text-[#44556a]"
            }`}
          >
            {navLinks
              .filter((link) => !link.homeOnly || route.name === "home")
              .map((link) => (
                <a
                  key={link.href}
                  className={`transition ${onDarkHero ? "hover:text-white" : "hover:text-[#104a7e]"}`}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            <a
              href={contact.phoneHref}
              className="rounded-full bg-[#c29a37] px-5 py-3 text-sm font-black text-white transition hover:bg-[#d5aa42]"
            >
              Call now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/95 shadow-xl shadow-slate-950/10 md:hidden"
          >
            <span className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-[#104a7e] transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`block h-0.5 w-5 bg-[#104a7e] transition ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`block h-0.5 w-5 bg-[#104a7e] transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mx-4 rounded-3xl bg-white p-4 shadow-2xl shadow-slate-950/15 md:hidden">
            {navLinks
              .filter((link) => !link.homeOnly || route.name === "home")
              .map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 text-base font-black text-[#104a7e] transition hover:bg-[#f7f0df]"
                >
                  {link.label}
                </a>
              ))}
            <a
              href={contact.phoneHref}
              className="mt-2 block rounded-full bg-[#c29a37] px-4 py-3.5 text-center text-base font-black text-white"
            >
              Call now
            </a>
          </div>
        )}
      </nav>

      {route.name === "home" && <HomePage services={services} />}
      {route.name === "service" && (
        <ServicePage
          service={activeService}
          loading={servicesLoading && !activeService}
          otherServices={services.filter((service) => service.slug !== (activeService?.slug ?? ""))}
        />
      )}
      {route.name === "admin" && <AdminPage />}

      <footer className="bg-[#071c31] px-4 py-10 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldMark className="h-12 w-12 text-white" />
            <div>
              <p className="text-lg font-black tracking-[0.18em]">AGARAM BROKERS</p>
              <p className="text-sm font-bold text-white/60">We do insurance for all</p>
            </div>
          </div>
          <div className="max-w-xl">
            <p className="text-sm leading-6 text-white/60">
              Insurance is subject to policy terms, conditions, exclusions, and insurer approval.
            </p>
            <a
              href="#/admin"
              className="mt-2 inline-block text-xs font-black text-white/40 underline underline-offset-4 transition hover:text-white/70"
            >
              Admin login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
