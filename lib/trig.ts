export const trigFunctions = [
 {id:'sin',name:'الجيب',formula:String.raw`\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}}`,explain:'في المثلث القائم: اقسم الضلع المقابل للزاوية على الوتر. على دائرة الوحدة، الجيب هو الإحداثي الرأسي.',domain:'كل الزوايا؛ الناتج بين −1 و1.'},
 {id:'cos',name:'جيب التمام',formula:String.raw`\cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}}`,explain:'في المثلث القائم: اقسم الضلع المجاور للزاوية على الوتر. على دائرة الوحدة، جيب التمام هو الإحداثي الأفقي.',domain:'كل الزوايا؛ الناتج بين −1 و1.'},
 {id:'tan',name:'الظل',formula:String.raw`\tan\theta=\frac{\sin\theta}{\cos\theta}`,explain:'اقسم الجيب على جيب التمام؛ في المثلث القائم هو المقابل مقسومًا على المجاور.',domain:'غير معرّف عند 90° + k × 180°، حيث k عدد صحيح.'},
 {id:'cot',name:'ظل التمام',formula:String.raw`\cot\theta=\frac{\cos\theta}{\sin\theta}`,explain:'اقسم جيب التمام على الجيب؛ هو المجاور مقسومًا على المقابل.',domain:'غير معرّف عند k × 180°، حيث k عدد صحيح.'},
 {id:'sec',name:'القاطع',formula:String.raw`\sec\theta=\frac{1}{\cos\theta}`,explain:'القاطع مقلوب جيب التمام: اقسم 1 على cos الزاوية.',domain:'غير معرّف عند 90° + k × 180°؛ مقدار الناتج لا يقل عن 1.'},
 {id:'csc',name:'قاطع التمام',formula:String.raw`\csc\theta=\frac{1}{\sin\theta}`,explain:'قاطع التمام مقلوب الجيب: اقسم 1 على sin الزاوية.',domain:'غير معرّف عند k × 180°؛ مقدار الناتج لا يقل عن 1.'},
 {id:'asin',name:'الجيب العكسي',formula:String.raw`\theta=\arcsin x`,explain:'نعرف قيمة الجيب ونبحث عن الزاوية الأساسية التي تعطيها. الدالة العكسية ليست مقلوب الجيب.',domain:'المدخل بين −1 و1؛ الزاوية الأساسية بين −90° و90°.'},
 {id:'acos',name:'جيب التمام العكسي',formula:String.raw`\theta=\arccos x`,explain:'نعرف قيمة جيب التمام ونستخرج الزاوية الأساسية التي تعطيها.',domain:'المدخل بين −1 و1؛ الزاوية الأساسية بين 0° و180°.'},
 {id:'atan',name:'الظل العكسي',formula:String.raw`\theta=\arctan x`,explain:'نعرف قيمة الظل ونستخرج الزاوية الأساسية؛ يفيد ذلك في حساب زاوية ميل منحدر.',domain:'أي عدد حقيقي؛ الزاوية الأساسية أكبر من −90° وأصغر من 90°.'},
] as const;
export type TrigId=typeof trigFunctions[number]['id'];
export const fmt=(n:number)=>Math.abs(n)<1e-10?'0':String(Number(n.toFixed(5)));
export function trigValue(id:TrigId,x:number):number|null {if(!Number.isFinite(x))return null;const s=Math.sin(x),c=Math.cos(x);switch(id){case 'sin':return s;case 'cos':return c;case 'tan':return Math.abs(c)<1e-12?null:s/c;case 'cot':return Math.abs(s)<1e-12?null:c/s;case 'sec':return Math.abs(c)<1e-12?null:1/c;case 'csc':return Math.abs(s)<1e-12?null:1/s;case 'asin':return Math.abs(x)>1?null:Math.asin(x);case 'acos':return Math.abs(x)>1?null:Math.acos(x);case 'atan':return Math.atan(x);}}
