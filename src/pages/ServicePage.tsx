import { contact, type Service } from "../lib/api";

type Props = {
  service: Service | null;
  loading: boolean;
  otherServices: Service[];
};

export default function ServicePage({ service, loading, otherServices }: Props) {
  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60svh] max-w-7xl items-center justify-center px-4">
        <p className="text-lg font-bold text-[#44556a]">Loading insurance details…</p>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="mx-auto flex min-h-[60svh] max-w-7xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-black text-[#0e2238] sm:text-4xl">Insurance not found</h1>
        <p className="max-w-md text-base text-[#44556a]">
          This insurance page may have been removed or renamed from the admin panel.
        </p>
        <a
          href="#/"
          className="rounded-full bg-[#104a7e] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#0c3861]"
        >
          Back to home
        </a>
      </main>
    );
  }

  return (
    <>
      <header className="relative overflow-hidden bg-[#08233d] text-white">
        {service.image && (
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,39,0.95)_0%,rgba(5,31,55,0.8)_50%,rgba(5,31,55,0.4)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10">
          <a
            href="#/"
            className="detail-rise inline-flex items-center gap-2 text-sm font-black text-white/70 transition hover:text-white"
          >
            ← All insurance
          </a>
          <h1 className="detail-rise mt-5 max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {service.title}
          </h1>
          <p className="detail-rise mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white/90 sm:text-xl">
            {service.description}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c29a37] sm:text-sm">
              What this insurance includes
            </p>
            <div className="mt-6 divide-y divide-[#d7c9ad] border-y border-[#d7c9ad]">
              {(service.highlights.length > 0
                ? service.highlights
                : ["Details coming soon — contact us for a personalised explanation."]
              ).map((item, index) => (
                <div key={item} className="detail-row flex items-start gap-4 py-5 sm:gap-6 sm:py-6">
                  <span className="mt-0.5 text-sm font-black text-[#c29a37]">0{index + 1}</span>
                  <p className="text-base font-bold text-[#104a7e] sm:text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-[#0c2f52] p-6 text-white sm:p-8">
              <h2 className="text-xl font-black sm:text-2xl">Want this insurance?</h2>
              <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
                Call or message us and we will compare the best {service.title.toLowerCase()} plans
                for your budget.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#c29a37] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#d5aa42]"
                >
                  Call {contact.phone}
                </a>
                <a
                  href={contact.whatsapp}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-sm font-black text-white transition hover:border-white hover:bg-white/10"
                >
                  WhatsApp us
                </a>
              </div>
            </div>

            {otherServices.length > 0 && (
              <div className="rounded-3xl bg-[#eee5d5] p-6 sm:p-8">
                <h2 className="text-lg font-black text-[#0e2238] sm:text-xl">Other insurance</h2>
                <ul className="mt-4 space-y-1">
                  {otherServices.map((other) => (
                    <li key={other.slug}>
                      <a
                        href={`#/services/${other.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition hover:bg-white"
                      >
                        <span className="text-sm font-bold text-[#104a7e] sm:text-base">
                          {other.title}
                        </span>
                        <span className="font-black text-[#c29a37] transition group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
