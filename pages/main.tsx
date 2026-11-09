/// <reference types="vite/client" />
import React from 'react';
import {createRoot} from 'react-dom/client';
import 'katex/dist/katex.min.css';
import '../app/globals.css';
const pages = import.meta.glob<{default: React.ComponentType}>('../app/**/page.tsx');
const route = document.documentElement.dataset.route || '/';
const load = pages[`../app${route === '/' ? '' : route}/page.tsx`];
const host = document.getElementById('root')!;
if (load) load().then(({default: Page}) => createRoot(host).render(<Page/>)).catch(() => {
  host.textContent = document.documentElement.lang === 'en' ? 'Could not load the page. Please refresh.' : 'تعذّر تحميل الصفحة. يرجى تحديثها.';
});
