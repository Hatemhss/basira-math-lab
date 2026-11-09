# Arabic / English content

Arabic source remains in `components/` and `lib/`. English modules under their
`english/` subdirectories and the eight `/en` routes are generated from the same
UI and calculation source by `node scripts/generate-english.mjs`.

`source.json` records Arabic-bearing AST strings per file in source order;
`en.json` contains reviewed English counterparts. Update both when changing
source copy, then rerun the generator. It rejects mismatched source strings or
counts to prevent silent translation drift. Keep numeric normalization strings
unchanged. Do not edit generated modules directly.

The shared header switches to the corresponding route. Middleware sets a
request-only locale header so server-rendered HTML has the correct lang/dir.
No external translation service or user text transmission is used.
