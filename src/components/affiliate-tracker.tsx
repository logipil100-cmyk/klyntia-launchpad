import { useEffect } from "react";
import { trackAffiliateClick, claimReferral } from "@/lib/affiliate.functions";
import { supabase } from "@/integrations/supabase/client";

const REF_KEY = "klyntia-ref";
const VISITOR_KEY = "klyntia-visitor";
const WINDOW_MS = 30 * 24 * 3600 * 1000;

/** Captures ?ref=CODE, counts a unique click, and attributes the next sign-in once. */
export function AffiliateTracker() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref")?.toLowerCase();
    if (ref && /^[a-z0-9]{6,16}$/.test(ref)) {
      let visitor = localStorage.getItem(VISITOR_KEY);
      if (!visitor) { visitor = crypto.randomUUID(); localStorage.setItem(VISITOR_KEY, visitor); }
      localStorage.setItem(REF_KEY, JSON.stringify({ code: ref, at: Date.now() }));
      trackAffiliateClick({ data: { code: ref, visitor } }).catch(() => {});
    }
    const tryClaim = async () => {
      const raw = localStorage.getItem(REF_KEY);
      if (!raw) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const { code, at } = JSON.parse(raw) as { code: string; at: number };
        localStorage.removeItem(REF_KEY);
        if (Date.now() - at < WINDOW_MS) await claimReferral({ data: { code } });
      } catch { localStorage.removeItem(REF_KEY); }
    };
    tryClaim();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN") tryClaim(); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return null;
}
