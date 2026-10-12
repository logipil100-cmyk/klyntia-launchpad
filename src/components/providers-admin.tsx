import { useEffect, useState } from "react";
import { PoweredByStrip } from "@/components/powered-by";
import {
  DEFAULT_PROVIDERS, STATUS_LABEL, isValidUrl, loadDraft, loadPublished, publish, publicProviders, saveDraft,
  type IntegrationStatus, type Provider,
} from "@/lib/providers";

const input = "w-full rounded-[10px] px-3 py-2 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
const EVIDENCE_REQUIRED: IntegrationStatus[] = ["connected", "disconnected", "requires_configuration", "error"];

export function ProvidersAdmin() {
  const [list, setList] = useState<Provider[]>([]);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { setList(loadDraft()); }, []);

  const sorted = [...list].sort((a, b) => a.order - b.order);
  function update(next: Provider[]) { setList(next); saveDraft(next); setNotice("Draft saved in this browser."); }
  function patch(id: string, ch: Partial<Provider>) { update(list.map((x) => (x.id === id ? { ...x, ...ch } : x))); }
  function move(id: string, dir: -1 | 1) {
    const i = sorted.findIndex((x) => x.id === id); const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const a = sorted[i]!, b = sorted[j]!;
    update(list.map((x) => (x.id === a.id ? { ...x, order: b.order } : x.id === b.id ? { ...x, order: a.order } : x)));
  }
  function addNew() {
    setEditing({ id: `custom-${Date.now()}`, name: "", description: "", website: "https://", category: "", logoUrl: "", visible: false, integration: "not_verified", evidence: "", order: Math.max(0, ...list.map((x) => x.order)) + 1, verifiedAt: null });
  }
  function saveEdit(p: Provider) {
    update(list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [...list, p]);
    setEditing(null);
  }
  const published = loadPublished();
  const pubCount = publicProviders(list).length;

  return (
    <div className="space-y-5 text-[13px]">
      <div role="note" className="rounded-[10px] p-3 bg-secondary text-[12px]">
        <strong>Demonstration storage:</strong> there is no database table for providers yet, so changes are stored only in this browser. They are not saved permanently and other visitors will not see them.
        Public visibility is separate from integration status — showing a provider never connects or disconnects anything. A provider appears publicly only when it is visible <em>and</em> marked Connected with recorded evidence.
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={addNew} className="btn-ink text-[12px]">Add provider</button>
        <button onClick={() => { publish(list); setNotice(`Published to this browser's footer (${pubCount} shown).`); }} className="btn-ember text-[12px]">Publish preview to footer</button>
        <button onClick={() => { if (confirm("Reset all providers to defaults?")) update(DEFAULT_PROVIDERS); }} className="btn-line text-[12px]">Reset to defaults</button>
        {notice && <span className="text-sage text-[12px]" role="status">{notice}</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="text-left text-sage text-[11px] font-mono">
            <tr><th className="py-2">Order</th><th>Provider</th><th>Category</th><th>Website</th><th>Public</th><th>Integration</th><th>Last verified</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((x, i) => (
              <tr key={x.id} className="align-top">
                <td className="py-3">
                  <div className="flex gap-1">
                    <button aria-label={`Move ${x.name} up`} disabled={i === 0} onClick={() => move(x.id, -1)} className="btn-line px-2 text-[11px] disabled:opacity-40">↑</button>
                    <button aria-label={`Move ${x.name} down`} disabled={i === sorted.length - 1} onClick={() => move(x.id, 1)} className="btn-line px-2 text-[11px] disabled:opacity-40">↓</button>
                  </div>
                </td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    {x.logoUrl ? <img src={x.logoUrl} alt="" width={20} height={20} className="rounded-sm" /> : <span className="w-5 h-5 rounded-sm bg-secondary inline-block" />}
                    <div><p className="font-semibold">{x.name}</p><p className="text-sage text-[12px]">{x.description}</p></div>
                  </div>
                </td>
                <td className="py-3">{x.category}</td>
                <td className="py-3">{isValidUrl(x.website) ? <a href={x.website} target="_blank" rel="noopener noreferrer" className="underline">Open</a> : <span className="text-sage">—</span>}</td>
                <td className="py-3">
                  <label className="flex items-center gap-1"><input type="checkbox" checked={x.visible} onChange={(e) => patch(x.id, { visible: e.target.checked })} /> {x.visible ? "Shown" : "Hidden"}</label>
                </td>
                <td className="py-3"><span className="font-mono text-[12px]">{STATUS_LABEL[x.integration]}</span></td>
                <td className="py-3 text-sage text-[12px]">{x.verifiedAt ? new Date(x.verifiedAt).toLocaleDateString("en-US") : "—"}</td>
                <td className="py-3">
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setEditing(x)} className="btn-line text-[11px]">Edit</button>
                    <button onClick={() => patch(x.id, { integration: "pending_verification" })} className="btn-line text-[11px]">Mark pending</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-line rounded-[14px] p-4">
          <p className="eyebrow mb-3">Footer preview (draft)</p>
          <PoweredByStrip providers={list} />
        </div>
        <div className="card-line rounded-[14px] p-4">
          <p className="eyebrow mb-3">Currently published (this browser)</p>
          <PoweredByStrip providers={published} />
        </div>
      </div>

      {editing && <EditDialog provider={editing} onCancel={() => setEditing(null)} onSave={saveEdit} />}
    </div>
  );
}

function EditDialog({ provider, onCancel, onSave }: { provider: Provider; onCancel: () => void; onSave: (p: Provider) => void }) {
  const [p, setP] = useState(provider);
  const [err, setErr] = useState("");
  const set = (ch: Partial<Provider>) => setP({ ...p, ...ch });

  function submit() {
    if (!p.name.trim()) return setErr("Name is required.");
    if (p.website && p.website !== "https://" && !isValidUrl(p.website)) return setErr("Website must be a valid URL.");
    if (p.logoUrl && !isValidUrl(p.logoUrl)) return setErr("Logo must be a valid URL.");
    if (EVIDENCE_REQUIRED.includes(p.integration) && !p.evidence.trim()) return setErr("Record the technical evidence for this status.");
    const statusChanged = p.integration !== provider.integration || p.evidence !== provider.evidence;
    onSave({ ...p, name: p.name.trim(), verifiedAt: statusChanged && EVIDENCE_REQUIRED.includes(p.integration) ? new Date().toISOString() : p.verifiedAt });
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="prov-edit-title" className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
      <div className="bg-paper rounded-[14px] p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">
        <h2 id="prov-edit-title" className="font-display font-bold text-xl">{provider.name ? `Edit ${provider.name}` : "Add provider"}</h2>
        <label className="block text-[12px] text-sage">Name<input className={`${input} mt-1`} value={p.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} /></label>
        <label className="block text-[12px] text-sage">Short description<input className={`${input} mt-1`} value={p.description} onChange={(e) => set({ description: e.target.value })} maxLength={140} /></label>
        <label className="block text-[12px] text-sage">Official website<input className={`${input} mt-1`} value={p.website} onChange={(e) => set({ website: e.target.value })} /></label>
        <label className="block text-[12px] text-sage">Logo URL<input className={`${input} mt-1`} value={p.logoUrl} onChange={(e) => set({ logoUrl: e.target.value })} /></label>
        <label className="block text-[12px] text-sage">Purpose / category<input className={`${input} mt-1`} value={p.category} onChange={(e) => set({ category: e.target.value })} maxLength={60} /></label>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={p.visible} onChange={(e) => set({ visible: e.target.checked })} /> Show on public website</label>
        <label className="block text-[12px] text-sage">Technical integration status
          <select className={`${input} mt-1`} value={p.integration} onChange={(e) => set({ integration: e.target.value as IntegrationStatus })}>
            {Object.entries(STATUS_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="block text-[12px] text-sage">Technical evidence (required for Connected, Disconnected, Requires configuration, Error)
          <textarea className={`${input} mt-1`} rows={3} value={p.evidence} onChange={(e) => set({ evidence: e.target.value })} maxLength={500} placeholder="e.g. chat responses served by Gemini, checked on production" />
        </label>
        <p className="text-[11px] text-sage">This status is recorded manually. The app does not test provider connections automatically.</p>
        {err && <p className="text-[12px] text-destructive" role="alert">{err}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-line text-[12px]">Cancel</button>
          <button onClick={submit} className="btn-ember text-[12px]">Save draft</button>
        </div>
      </div>
    </div>
  );
}
