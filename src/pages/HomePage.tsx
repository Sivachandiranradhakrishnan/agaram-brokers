import ShieldMark from "../components/ShieldMark";
import { contact, type Service } from "../lib/api";

const heroImage =
  "https://images.pexels.com/photos/8441820/pexels-photo-8441820.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";

const steps = [
  "Understand your need and budget",
  "Compare suitable policy options",
  "Support renewals, endorsements, and claims",
];

const assurances = [
  "Plain-language policy explanation",
  "Quick renewal reminders",
  "Claim document support",
  "Multiple insurer options",
];

export default function HomePage({ services }: { services: Service[] }) {
  return (
    <>
      <header className="relative min-h-[92svh] overflow-hidden bg-[#08233d] text-white">
        <img
          src={heroImage}
          alt="Insurance advisor explaining policy documents to a family"
          className="hero-photo absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,39,0.95)_0%,rgba(5,31,55,0.78)_42%,rgba(5,31,55,0.25)_100%)]" />

        <section className="relative z-10 mx-auto flex min-h-[calc(92svh-90px)] w-full max-w-7xl items-center px-4 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-10">
          <div className="hero-copy max-w-4xl">
            <ShieldMark className="brand-float mb-6 h-16 w-16 text-white sm:h-24 sm:w-24" />
            <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white xs:text-5xl sm:text-7xl lg:text-8xl">
              Agaram Brokers
            </h1>
            <p className="mt-4 inline-block bg-[#c29a37] px-3 py-2 text-base font-black tracking-wide text-white sm:mt-5 sm:px-4 sm:text-2xl">
              We do insurance for all
            </p>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-snug text-white/90 sm:text-2xl lg:text-3xl">
              Clear advice, faster renewals, and claim support for families, vehicles, travel, and
              growing businesses.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#104a7e] transition hover:-translate-y-0.5 hover:bg-[#f7f0df] sm:px-7 sm:py-4 sm:text-base"
              >
                Explore our insurance
              </a>
              <a
                href={contact.whatsapp}
                className="inline-flex items-center justify-center rounded-full border border-white/45 px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10 sm:px-7 sm:py-4 sm:text-base"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </header>

      <main>
        {/* Choice of insurance — image cards linking to detail pages */}
        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c29a37] sm:text-sm">
              Choice of insurance
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#0e2238] sm:text-5xl">
              Pick an insurance to see what it protects.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#44556a] sm:text-lg sm:leading-8">
              Tap any card to open its full page with coverage details, benefits, and how to reach
              us about it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {services.map((service, index) => (
              <a
                key={service.slug}
                href={`#/services/${service.slug}`}
                className="service-card group relative overflow-hidden rounded-3xl bg-[#0c2f52] shadow-lg shadow-[#0c2f52]/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#0c2f52]/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#104a7e]">
                      <span className="text-5xl font-black text-white/25">{service.title[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,35,61,0)_35%,rgba(8,35,61,0.9)_100%)]" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#104a7e]">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <h3 className="text-lg font-black tracking-[-0.02em] text-white sm:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/65">
                      {service.description}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c29a37] text-lg font-black text-white transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="approach" className="bg-[#0c2f52] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d8b458] sm:text-sm">
                How we help
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                Insurance support from first quote to final claim.
              </h2>
            </div>

            <div className="mt-10 grid gap-8 sm:mt-16 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="process-step border-t border-white/25 pt-6 sm:pt-7">
                  <span className="text-xs font-black text-[#d8b458] sm:text-sm">
                    STEP 0{index + 1}
                  </span>
                  <p className="mt-3 text-xl font-bold leading-tight sm:mt-4 sm:text-2xl">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c29a37] sm:text-sm">
                Why Agaram
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#0e2238] sm:text-5xl">
                The right policy should feel understandable, not stressful.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#44556a] sm:mt-6 sm:text-lg sm:leading-8">
                From health cover for parents to commercial vehicle renewals, the focus is simple:
                explain the options, finish the paperwork, and stay reachable when help is needed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {assurances.map((item) => (
                <div
                  key={item}
                  className="assurance-line flex items-center gap-4 border-b border-[#d7c9ad] pb-4"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c29a37]" />
                  <span className="text-base font-bold text-[#104a7e] sm:text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact — details only, no enquiry form */}
        <section id="contact" className="bg-[#eee5d5] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c29a37] sm:text-sm">
                Contact
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#0e2238] sm:text-5xl">
                Talk to us directly.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#44556a] sm:text-lg sm:leading-8">
                Call, WhatsApp, or email — whichever is easiest for you.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6">
              <a
                href={contact.phoneHref}
                className="contact-tile rounded-3xl bg-white p-6 shadow-lg shadow-[#92783a]/10 transition hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c29a37]">Phone</p>
                <p className="mt-3 break-words text-lg font-black text-[#104a7e] sm:text-xl">
                  {contact.phone}
                </p>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="contact-tile rounded-3xl bg-white p-6 shadow-lg shadow-[#92783a]/10 transition hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c29a37]">Email</p>
                <p className="mt-3 break-words text-lg font-black text-[#104a7e] sm:text-xl">
                  {contact.email}
                </p>
              </a>
              <div className="contact-tile rounded-3xl bg-white p-6 shadow-lg shadow-[#92783a]/10 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c29a37]">
                  Office address
                </p>
                <p className="mt-3 text-base font-black leading-relaxed text-[#104a7e] sm:text-lg">
                  {contact.addressLine1}
                  <br />
                  {contact.addressLine2}
                </p>
              </div>
              <div className="contact-tile rounded-3xl bg-white p-6 shadow-lg shadow-[#92783a]/10 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c29a37]">
                  Office timing
                </p>
                <p className="mt-3 text-base font-black leading-relaxed text-[#104a7e] sm:text-lg">
                  {contact.timing}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
