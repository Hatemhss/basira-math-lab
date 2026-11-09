import {renderMath} from '@/lib/math-format';
export default function MathDisplay({text,latex=false,className=''}:{text:string;latex?:boolean;className?:string}){
 const render=(line:string,key:number)=>{const r=renderMath(line,latex);return r.error?<span key={key} className="math-fallback"><span>{line}</span><small dir="rtl">{r.error}</small></span>:<span key={key} dangerouslySetInnerHTML={{__html:r.html}}/>};
 return <div className={`math-typeset ${className}`} dir="ltr">{(latex?[text]:text.split('\n')).map((line,i)=>!latex&&/[\p{Script=Arabic}]/u.test(line)?<div className="math-mixed" key={i}>{line.split(/([\p{Script=Arabic}][\p{Script=Arabic}\s]*)/u).map((part,j)=>/[\p{Script=Arabic}]/u.test(part)?<span className="math-arabic" dir="rtl" key={j}>{part}</span>:part.trim()?render(part,j):null)}</div>:<div key={i}>{render(line,i)}</div>)}</div>
}
