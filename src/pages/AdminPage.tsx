import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  createService,
  deleteService,
  fetchServices,
  updateService,
  type Service,
} from "../lib/api";

type FormState = {
  title: string;
  description: string;
  image: string;
  highlights: string;
  active: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  image: "",
  highlights: "",
  active: true,
};

function toForm(service: Service): FormState {
  return {
    title: service.title,
    description: service.description,
    image: service.image,
    highlights: service.highlights.join("\n"),
    active: service.active,
  };
}

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setServices(await fetchServices(true));
      setBackendDown(false);
    } catch {
      setBackendDown(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "active" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
    };

  const startEdit = (service: Service) => {
    setEditingSlug(service.slug);
    setForm(toForm(service));
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      highlights: form.highlights,
      active: form.active,
    };

    try {
      if (editingSlug) {
        await updateService(editingSlug, payload);
        setNotice({ kind: "ok", text: `Updated "${form.title}".` });
      } else {
        await createService(payload);
        setNotice({ kind: "ok", text: `Created "${form.title}".` });
      }
      setEditingSlug(null);
      setForm(emptyForm);
      await load();
    } catch (error) {
      setNotice({
        kind: "err",
        text: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (service: Service) => {
    if (!window.confirm(`Delete "${service.title}"? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    setNotice(null);

    try {
      await deleteService(service.slug);
      setNotice({ kind: "ok", text: `Deleted "${service.title}".` });
      if (editingSlug === service.slug) {
        cancelEdit();
      }
      await load();
    } catch (error) {
      setNotice({
        kind: "err",
        text: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (service: Service) => {
    setBusy(true);
    try {
      await updateService(service.slug, { active: !service.active });
      await load();
    } catch (error) {
      setNotice({
        kind: "err",
        text: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-2xl border border-[#d7c9ad] bg-[#fbf8f2] px-4 py-3 text-[#0e2238] outline-none transition focus:border-[#c29a37]";

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c29a37] sm:text-sm">
            Admin panel
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0e2238] sm:text-5xl">
            Manage insurance.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#44556a] sm:text-base">
            Add, edit, hide, or delete the insurance shown on the website. Changes are saved to the
            database instantly.
          </p>
        </div>
        <a href="#/" className="text-sm font-black text-[#104a7e] underline underline-offset-4">
          ← Back to website
        </a>
      </div>

      {backendDown && (
        <div className="mt-8 rounded-3xl bg-red-50 p-6 text-sm font-bold text-red-700">
          The backend is not reachable. Start it with{" "}
          <code className="rounded bg-red-100 px-2 py-0.5">node backend/server.mjs</code> and open
          this page through{" "}
          <code className="rounded bg-red-100 px-2 py-0.5">http://localhost:4000</code>.
        </div>
      )}

      {notice && (
        <div
          role="status"
          className={`mt-8 rounded-3xl p-5 text-sm font-bold ${
            notice.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* Create / edit form */}
        <form
          onSubmit={submit}
          className="h-fit rounded-3xl bg-white p-6 shadow-xl shadow-[#92783a]/10 sm:p-8"
        >
          <h2 className="text-xl font-black text-[#0e2238] sm:text-2xl">
            {editingSlug ? "Edit insurance" : "Add a new insurance"}
          </h2>

          <label className="mt-6 block">
            <span className="text-sm font-black text-[#104a7e]">Title</span>
            <input
              required
              value={form.title}
              onChange={update("title")}
              className={inputClass}
              placeholder="e.g. Fire insurance"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-black text-[#104a7e]">Short description</span>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={update("description")}
              className={`${inputClass} resize-none`}
              placeholder="One or two lines shown on the card."
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-black text-[#104a7e]">Image URL</span>
            <input
              value={form.image}
              onChange={update("image")}
              className={inputClass}
              placeholder="https://…"
            />
          </label>

          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-4 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}

          <label className="mt-5 block">
            <span className="text-sm font-black text-[#104a7e]">
              Highlights (one per line)
            </span>
            <textarea
              rows={5}
              value={form.highlights}
              onChange={update("highlights")}
              className={`${inputClass} resize-none`}
              placeholder={"Cashless claims\nQuick renewals\n…"}
            />
          </label>

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={update("active")}
              className="h-5 w-5 accent-[#104a7e]"
            />
            <span className="text-sm font-black text-[#104a7e]">Visible on website</span>
          </label>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={busy || backendDown}
              className="flex-1 rounded-full bg-[#104a7e] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#0c3861] disabled:opacity-50"
            >
              {busy ? "Saving…" : editingSlug ? "Save changes" : "Add insurance"}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-[#d7c9ad] px-6 py-3.5 text-sm font-black text-[#104a7e] transition hover:bg-[#f7f0df]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing insurance */}
        <div>
          <h2 className="text-xl font-black text-[#0e2238] sm:text-2xl">
            Existing insurance {loading ? "" : `(${services.length})`}
          </h2>

          {loading ? (
            <p className="mt-6 text-sm font-bold text-[#44556a]">Loading…</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {services.map((service) => (
                <li
                  key={service.slug}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-lg shadow-[#92783a]/10 sm:flex-row sm:items-center sm:p-5"
                >
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-24 w-full rounded-2xl object-cover sm:h-20 sm:w-32"
                    />
                  ) : (
                    <div className="grid h-24 w-full place-items-center rounded-2xl bg-[#eee5d5] text-2xl font-black text-[#c29a37] sm:h-20 sm:w-32">
                      {service.title[0]}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-[#104a7e] sm:text-lg">
                        {service.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                          service.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {service.active ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[#44556a]">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                    <button
                      onClick={() => startEdit(service)}
                      disabled={busy}
                      className="rounded-full bg-[#104a7e] px-4 py-2 text-xs font-black text-white transition hover:bg-[#0c3861] disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void toggleActive(service)}
                      disabled={busy}
                      className="rounded-full border border-[#d7c9ad] px-4 py-2 text-xs font-black text-[#104a7e] transition hover:bg-[#f7f0df] disabled:opacity-50"
                    >
                      {service.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => void remove(service)}
                      disabled={busy}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}

              {services.length === 0 && !backendDown && (
                <li className="rounded-3xl bg-white p-6 text-sm font-bold text-[#44556a]">
                  No insurance yet. Add your first one using the form.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
