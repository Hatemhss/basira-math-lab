import type {Metadata} from 'next';
import NLPLab from '@/components/nlp-lab';
export const metadata:Metadata={title:'بصيرة | معادلات معالجة اللغة الطبيعية',description:'رفيق دراسة عربي مستقل لموضوعات تخصص NLP من DeepLearning.AI: التصنيف ونايف بايز والمتجهات وViterbi وCBOW وLSTM وGRU والانتباه وBLEU.'};
export default function NLPPage(){return <NLPLab/>}
