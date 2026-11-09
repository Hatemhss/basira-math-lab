import {headers} from 'next/headers';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
export const metadata: Metadata = { title: 'بصيرة | مختبر التفاضل والتكامل', description: 'افهم التفاضل والتكامل خطوة بخطوة، واستكشف المعادلات في فضاء ثلاثي الأبعاد.' };
export default async function RootLayout({ children }: { children: React.ReactNode }) { const en=(await headers()).get('x-basira-locale')==='en'; return <html lang={en?'en':'ar'} dir={en?'ltr':'rtl'}><body>{children}</body></html>; }
