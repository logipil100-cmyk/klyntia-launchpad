# Limpeza da marca antiga + ajuste dos modelos da IA

## 1. Limpeza definitiva de "klyntia"
- Animação do cursor a piscar: `klyntia-blink` passa a `gnistrabot-blink` (estilos, chat, gerador de textos, caixa de demonstração).
- Evento de abrir o chat e id do campo do chat: `klyntia:*` passa a `gnistrabot:*`.
- Chaves guardadas no navegador (idioma, aviso de cookies, código de afiliado, visitante, marca de afiliado): passam a `gnistrabot-*`, lendo primeiro o valor antigo e migrando-o, para que ninguém perca o idioma escolhido, o aviso já aceite ou a referência de afiliado.
- No fim, procurar de novo "klyntia" no código: só devem restar as leituras de migração.

## 2. Mapeamento dos modelos da IA
- Um único sítio decide o modelo: com chave própria da Google usa `gemini-2.0-flash`; sem ela, usa o gateway com `google/gemini-2.5-flash` (o nome que o gateway aceita).
- Chat e gerador de textos deixam de passar nomes de modelo próprios e usam esse mapeamento.
- Mensagens de erro claras quando nenhuma chave está configurada.
- Testar o chat e o gerador aqui no preview e confirmar resposta em português.

## Detalhes técnicos
- `src/lib/ai-model.server.ts`: constantes `GOOGLE_DIRECT_MODEL` e `GATEWAY_MODEL`; `getGeminiModel()` sem parâmetro de modelo.
- Ficheiros: styles.css, chat-widget.tsx, promo-generator.tsx, site.tsx, i18n.tsx, cookie-banner.tsx, affiliate-tracker.tsx, affiliates.tsx, auth.tsx, dashboard.tsx, chat.server.ts, promo.server.ts.
- Para chegar à Vercel, as alterações terão de ser enviadas para o GitHub.
