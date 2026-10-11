<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Auth: Lovable Cloud email/password + Google (via lovable broker); session read with useSessionUser hook; sign-in page at /auth. Why: single auth flow for the platform.
- Brand-specific components and animations use the current brand prefix; browser preference keys migrate legacy values on read. Why: keep naming consistent without disrupting existing sessions or language preferences.
