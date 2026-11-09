import type {Metadata} from 'next';
import SymbolEditor from '@/components/symbol-editor';
export const metadata:Metadata={title:'بصيرة | محرر الرموز والمعادلات',description:'محرر LaTeX مع معاينة رياضية للكسور والجذور والتكامل والمصفوفات والمجموعات ورموز الذكاء الاصطناعي.'};
export default function SymbolsPage(){return <SymbolEditor/>}
