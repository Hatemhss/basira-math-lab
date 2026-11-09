import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url));
const repo=process.env.PAGES_REPO || 'basira-math-lab';
if(!/^[a-zA-Z0-9._-]+$/.test(repo))throw Error('Invalid repository name');
const base=repo.endsWith('.github.io')?'/':`/${repo}/`,out=path.join(root,'docs');
// Apply the repository prefix to local links only, including computed language switches.
const links={name:'github-pages-links',enforce:'pre',transform(source,id){if(!id.endsWith('.tsx')||id.includes('node_modules'))return;const sf=ts.createSourceFile(id,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];function visit(n){if(ts.isJsxAttribute(n)&&n.name.getText(sf)==='href'&&n.initializer){const v=n.initializer;const expr=ts.isStringLiteral(v)?JSON.stringify(v.text):ts.isJsxExpression(v)&&v.expression?v.expression.getText(sf):null;if(expr)edits.push([v.getStart(sf),v.end,`{__basiraPagesLink(${expr})}`]);}ts.forEachChild(n,visit)}visit(sf);if(!edits.length)return;for(const [a,b,s]of edits.reverse())source=source.slice(0,a)+s+source.slice(b);return{code:source+`\nfunction __basiraPagesLink(url:string){return typeof url==='string'&&/^\\/(?!\\/)/.test(url)?${JSON.stringify(base)}+url.slice(1):url}\n`,map:null}}};
await build({configFile:false,root,base,plugins:[links,react()],resolve:{alias:{'next/navigation':path.join(root,'pages/navigation.ts'),'@':root}},css:{postcss:{plugins:[tailwind()]}},build:{outDir:out,emptyOutDir:true,manifest:true,rollupOptions:{input:path.join(root,'pages/main.tsx')}}});
const manifest=JSON.parse(fs.readFileSync(path.join(out,'.vite/manifest.json'))),entry=manifest['pages/main.tsx'];
const sections=[['','التفاضل والتكامل','Calculus'],['learn','مسار الرياضيات','Mathematics path'],['ai','رياضيات الذكاء الاصطناعي','AI mathematics'],['trig','الدوال المثلثية','Trigonometry'],['nlp','معالجة اللغة','Natural language processing'],['symbols','الرموز والمعادلات','Symbols and equations'],['advanced-ai','الخوارزميات المتقدمة','Advanced algorithms'],['build-llm','بناء نماذج اللغة','Build an LLM']];
for(const en of [false,true])for(const [slug,ar,title]of sections){const route='/'+[en?'en':'',slug].filter(Boolean).join('/');const dir=path.join(out,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}" data-route="${route}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${en?title+' | Basira':ar+' | بصيرة'}</title><link rel="icon" href="${base}favicon.svg">${entry.css.map(c=>`<link rel="stylesheet" href="${base}${c}">`).join('')}</head><body><div id="root" aria-busy="false">${en?'Loading…':'جارٍ التحميل…'}</div><script type="module" src="${base}${entry.file}"></script></body></html>`)}
fs.rmSync(path.join(out,'.vite'),{recursive:true});fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('Built 16 GitHub Pages routes at '+base);
