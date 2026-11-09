import type {Metadata} from 'next';
import AILab from '@/components/ai-lab';
export const metadata:Metadata={title:'بصيرة | رياضيات الذكاء الاصطناعي',description:'تعلّم الانحدار الخطي والانحدار المتدرج وSigmoid والانتشار العكسي وSoftmax بتجارب تفاعلية وخطوات حساب واضحة.'};
export default function AIPage(){return <AILab/>}
