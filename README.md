# بصيرة | Basira

مختبر تفاعلي للرياضيات والذكاء الاصطناعي بالعربية والإنجليزية.

[العربية](https://hatemhss.github.io/basira-math-lab/) · [English](https://hatemhss.github.io/basira-math-lab/en/)

## Build and publish

With Node.js 22.13+ and pnpm installed, run `pnpm install --frozen-lockfile`, then `pnpm run build:pages`. Use `pnpm run preview` to test the result locally.

GitHub Pages serves the committed `docs/` directory from the `main` branch. Rebuild and commit that directory when changing lessons or components. Set the `PAGES_REPO` environment variable to the new repository name when deploying a fork.
