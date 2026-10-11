import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/lib/i18n";
import { sendDemoMessage, DEMO_MAX_USER_TURNS } from "@/lib/chat.functions";

type Turn = { role: "user" | "assistant"; content: string };

export const OPEN_CHAT_EVENT = "klyntia:open-chat";
export const openDemoChat = () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT));

export function ChatWidget() {
  const { t, lang } = useT();
  const send = useServerFn(sendDemoMessage);
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<"limit" | "error" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, pending]);

  const userTurns = turns.filter((m) => m.role === "user").length;
  const reachedLimit = userTurns >= DEMO_MAX_USER_TURNS;

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const content = input.trim().slice(0, 600);
    if (!content || pending || reachedLimit) return;
    const next: Turn[] = [...turns, { role: "user", content }];
    setTurns(next);
    setInput("");
    setPending(true);
    setNotice(null);
    try {
      const res = await send({ data: { lang, messages: next } });
      if (res.ok) setTurns([...next, { role: "assistant", content: res.text }]);
      else setNotice(res.code);
    } catch {
      setNotice("error");
    } finally {
      setPending(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      e.preventDefault();
      void submit();
    }
  };

  const showLimit = reachedLimit || notice === "limit";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          role="dialog"
          aria-label={t.chat.title}
          className="w-[calc(100vw-2rem)] max-w-sm h-[min(32rem,calc(100dvh-6rem))] flex flex-col bg-paper text-ink rounded-2xl shadow-[0_0_0_1px_var(--border),0_24px_60px_-20px_var(--ink)] overflow-hidden"
        >
          <header className="flex items-center justify-between px-4 py-3 bg-ink text-paper">
            <div className="flex items-center gap-2">
              <span className="size-7 bg-ember rounded-lg grid place-items-center font-bold text-[12px]" aria-hidden="true">K</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">{t.chat.title}</p>
                <p className="text-[10px] font-mono text-paper/70 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
                  {t.chat.status}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.chat.close} className="size-8 grid place-items-center rounded-full hover:bg-paper/10 text-lg leading-none">
              {"×"}
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 text-[13px]" aria-live="polite">
            <p className="bg-muted rounded-lg rounded-tl-sm px-3 py-2 max-w-[85%]">{t.chat.hello}</p>
            {turns.map((m, i) => (
              <p
                key={i}
                className={`rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap ${m.role === "user" ? "bg-ink text-paper rounded-tr-sm ml-auto w-fit" : "bg-muted rounded-tl-sm"}`}
              >
                {m.content}
              </p>
            ))}
            {pending && (
              <p className="bg-muted rounded-lg rounded-tl-sm px-3 py-2 w-fit flex items-center gap-1" aria-label="...">
                <span className="klyntia-blink text-ember">{"▍"}</span>
              </p>
            )}
            {notice === "error" && <p className="text-[12px] text-destructive">{t.chat.error}</p>}
            {showLimit && (
              <div className="card-line p-3 text-[12px] space-y-2">
                <p>{t.chat.limit}</p>
                <Link to="/auth" search={{ mode: "up" }} className="btn-ember block text-[12px] py-2">{t.hero.cta}</Link>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="border-t p-3 flex items-end gap-2">
            <label htmlFor="klyntia-chat-input" className="sr-only">{t.chat.placeholder}</label>
            <textarea
              id="klyntia-chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={600}
              disabled={showLimit}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={t.chat.placeholder}
              className="flex-1 resize-none rounded-lg bg-paper px-3 py-2 text-[13px] shadow-[0_0_0_1px_var(--input)] focus:outline-none focus:shadow-[0_0_0_2px_var(--ember)] disabled:opacity-50"
            />
            <button type="submit" disabled={pending || !input.trim() || showLimit} className="btn-ember py-2 px-3 text-[12px] disabled:opacity-50 disabled:pointer-events-none">
              {t.chat.send}
            </button>
          </form>
          <p className="text-[10px] font-mono text-sage text-center pb-2">{t.chat.disclaimer}</p>
        </section>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.chat.close : t.chat.open}
        aria-expanded={open}
        className="size-14 rounded-full bg-ember text-paper grid place-items-center shadow-[0_12px_30px_-10px_var(--ember)] transition-transform hover:-translate-y-0.5"
      >
        {open ? (
          <span className="text-2xl leading-none" aria-hidden="true">{"×"}</span>
        ) : (
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
