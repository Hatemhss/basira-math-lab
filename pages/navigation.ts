// GitHub Pages serves a real HTML document for each route.
export function usePathname(){return document.documentElement.dataset.route || '/'}
