import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Commission per converted referral (sign-up), in US cents. Placeholder rule until the owner confirms.
const COMMISSION_CENTS = 500;
const MIN_PAYOUT_CENTS = 500;

const codeSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9]{6,16}$/);

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function isAffiliate(db: Awaited<ReturnType<typeof admin>>, userId: string) {
  const { data } = await db.from("profiles").select("is_affiliate").eq("id", userId).maybeSingle();
  return !!data?.is_affiliate;
}

/** Public: record a unique click for a referral code. */
export const trackAffiliateClick = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ code: codeSchema, visitor: z.string().min(8).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: link } = await db.from("affiliate_links").select("code").eq("code", data.code).maybeSingle();
    if (!link) return { ok: false };
    await db.from("affiliate_clicks").upsert({ code: data.code, visitor_id: data.visitor }, { onConflict: "code,visitor_id", ignoreDuplicates: true });
    return { ok: true };
  });

/** Signed-in: attribute the current (new) user to the referral code once. */
export const claimReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ code: codeSchema }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: link } = await db.from("affiliate_links").select("user_id").eq("code", data.code).maybeSingle();
    if (!link || link.user_id === context.userId) return { ok: false };
    const { data: u } = await db.auth.admin.getUserById(context.userId);
    const created = u.user?.created_at ? new Date(u.user.created_at).getTime() : 0;
    if (Date.now() - created > 7 * 24 * 3600 * 1000) return { ok: false }; // only fresh accounts
    await db.from("affiliate_commissions").upsert(
      { affiliate_user_id: link.user_id, referred_user_id: context.userId, amount_cents: COMMISSION_CENTS },
      { onConflict: "referred_user_id", ignoreDuplicates: true },
    );
    return { ok: true };
  });

export type AffiliateStats = {
  code: string;
  clicks: number;
  conversions: number;
  pendingCents: number;
  requestedCents: number;
  paidCents: number;
  minPayoutCents: number;
  payouts: { id: string; amount_cents: number; status: string; method: string; created_at: string }[];
};

export const getAffiliateStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AffiliateStats | null> => {
    const db = await admin();
    if (!(await isAffiliate(db, context.userId))) return null;
    let { data: link } = await db.from("affiliate_links").select("code").eq("user_id", context.userId).maybeSingle();
    if (!link) {
      for (let i = 0; i < 5 && !link; i++) {
        const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
        const { data: ins } = await db.from("affiliate_links").insert({ user_id: context.userId, code }).select("code").maybeSingle();
        link = ins;
      }
      if (!link) throw new Error("Could not create link");
    }
    const [{ count: clicks }, { data: comms }, { data: payouts }] = await Promise.all([
      db.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("code", link.code),
      db.from("affiliate_commissions").select("amount_cents,status").eq("affiliate_user_id", context.userId),
      db.from("affiliate_payouts").select("id,amount_cents,status,method,created_at").eq("affiliate_user_id", context.userId).order("created_at", { ascending: false }).limit(20),
    ]);
    const sum = (s: string) => (comms ?? []).filter((c) => c.status === s).reduce((a, c) => a + c.amount_cents, 0);
    return {
      code: link.code,
      clicks: clicks ?? 0,
      conversions: comms?.length ?? 0,
      pendingCents: sum("pending"),
      requestedCents: sum("requested"),
      paidCents: sum("paid"),
      minPayoutCents: MIN_PAYOUT_CENTS,
      payouts: payouts ?? [],
    };
  });

export const requestPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ method: z.string().trim().min(2).max(40), details: z.string().trim().min(3).max(300) }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean; reason?: string }> => {
    const db = await admin();
    if (!(await isAffiliate(db, context.userId))) return { ok: false, reason: "forbidden" };
    const { data: pending } = await db.from("affiliate_commissions").select("id,amount_cents").eq("affiliate_user_id", context.userId).eq("status", "pending");
    const total = (pending ?? []).reduce((a, c) => a + c.amount_cents, 0);
    if (total < MIN_PAYOUT_CENTS) return { ok: false, reason: "min" };
    const { data: payout, error } = await db.from("affiliate_payouts")
      .insert({ affiliate_user_id: context.userId, amount_cents: total, method: data.method, details: data.details })
      .select("id").single();
    if (error || !payout) return { ok: false, reason: "error" };
    await db.from("affiliate_commissions").update({ status: "requested", payout_id: payout.id })
      .in("id", (pending ?? []).map((c) => c.id)).eq("status", "pending");
    return { ok: true };
  });
