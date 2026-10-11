import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: { rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => PromiseLike<{ data: boolean | null }> }; userId: string };

async function requireAdmin(context: Ctx) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return !!data;
  });

export type AdminOverview = {
  mrrCents: number;
  activeSubs: number;
  plans: { id: string; name: string; price_monthly_cents: number; active: boolean; subscribers: number }[];
  affiliates: { user_id: string; name: string; code: string | null; clicks: number; conversions: number; pendingCents: number; paidCents: number }[];
  payouts: { id: string; affiliate: string; amount_cents: number; method: string; details: string; status: string; created_at: string }[];
  audit: { id: string; action: string; target: string | null; created_at: string }[];
};

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const db = await requireAdmin(context as unknown as Ctx);
    const [plans, subs, profs, links, clicks, comms, payouts, audit] = await Promise.all([
      db.from("plans").select("*").order("sort"),
      db.from("subscriptions").select("plan_id,status"),
      db.from("profiles").select("id,display_name,is_affiliate"),
      db.from("affiliate_links").select("user_id,code"),
      db.from("affiliate_clicks").select("code"),
      db.from("affiliate_commissions").select("affiliate_user_id,amount_cents,status"),
      db.from("affiliate_payouts").select("*").order("created_at", { ascending: false }).limit(100),
      db.from("audit_log").select("id,action,target,created_at").order("created_at", { ascending: false }).limit(100),
    ]);
    const nameOf = new Map((profs.data ?? []).map((p) => [p.id, p.display_name ?? p.id.slice(0, 8)]));
    const active = (subs.data ?? []).filter((s) => s.status === "active");
    const priceOf = new Map((plans.data ?? []).map((p) => [p.id, p.price_monthly_cents]));
    const codeOf = new Map((links.data ?? []).map((l) => [l.user_id, l.code]));
    const clickCount = new Map<string, number>();
    for (const c of clicks.data ?? []) clickCount.set(c.code, (clickCount.get(c.code) ?? 0) + 1);
    return {
      mrrCents: active.reduce((a, s) => a + (priceOf.get(s.plan_id) ?? 0), 0),
      activeSubs: active.length,
      plans: (plans.data ?? []).map((p) => ({ id: p.id, name: p.name, price_monthly_cents: p.price_monthly_cents, active: p.active, subscribers: active.filter((s) => s.plan_id === p.id).length })),
      affiliates: (profs.data ?? []).filter((p) => p.is_affiliate).map((p) => {
        const mine = (comms.data ?? []).filter((c) => c.affiliate_user_id === p.id);
        const code = codeOf.get(p.id) ?? null;
        return {
          user_id: p.id, name: nameOf.get(p.id)!, code,
          clicks: code ? clickCount.get(code) ?? 0 : 0,
          conversions: mine.length,
          pendingCents: mine.filter((c) => c.status !== "paid").reduce((a, c) => a + c.amount_cents, 0),
          paidCents: mine.filter((c) => c.status === "paid").reduce((a, c) => a + c.amount_cents, 0),
        };
      }),
      payouts: (payouts.data ?? []).map((p) => ({ id: p.id, affiliate: nameOf.get(p.affiliate_user_id) ?? p.affiliate_user_id.slice(0, 8), amount_cents: p.amount_cents, method: p.method, details: p.details, status: p.status, created_at: p.created_at })),
      audit: audit.data ?? [],
    };
  });

export const updatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().min(2).max(30), name: z.string().trim().min(1).max(60), price_monthly_cents: z.number().int().min(0).max(10_000_000), active: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { error } = await db.from("plans").update({ name: data.name, price_monthly_cents: data.price_monthly_cents, active: data.active, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) return { ok: false };
    await db.from("audit_log").insert({ actor_id: context.userId, action: "plan.update", target: data.id, details: data });
    return { ok: true };
  });

export const decidePayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), decision: z.enum(["paid", "rejected"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { data: p } = await db.from("affiliate_payouts").update({ status: data.decision }).eq("id", data.id).eq("status", "requested").select("id,amount_cents").maybeSingle();
    if (!p) return { ok: false };
    if (data.decision === "paid") await db.from("affiliate_commissions").update({ status: "paid" }).eq("payout_id", data.id);
    else await db.from("affiliate_commissions").update({ status: "pending", payout_id: null }).eq("payout_id", data.id);
    await db.from("audit_log").insert({ actor_id: context.userId, action: `payout.${data.decision}`, target: data.id, details: { amount_cents: p.amount_cents } });
    return { ok: true };
  });
