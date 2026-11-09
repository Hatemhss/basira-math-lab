import type {Metadata} from 'next';
import MathPath from '@/components/math-path';
export const metadata:Metadata={title:'بصيرة | الرياضيات من المبتدئ إلى المتقدم',description:'مسار عربي تفاعلي في الحساب والجبر والهندسة والإحصاء والاحتمالات والمصفوفات والمعادلات التفاضلية، مع أمثلة محلولة وتمارين.'};
export default function LearnPage(){return <MathPath/>}
