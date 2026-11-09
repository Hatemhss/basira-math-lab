export type Datum = { x: number; y: number };
export const trainingData: Datum[] = [{x:-2,y:-2.8},{x:-1,y:-.9},{x:0,y:.8},{x:1,y:3.2},{x:2,y:4.7}];
export type Parameters = {w:number;b:number};
export function regression({w,b}:Parameters, data:Datum[]=trainingData) {
  let loss=0,dw=0,db=0;
  for(const {x,y} of data){const error=w*x+b-y;loss+=error**2;dw+=2*error*x;db+=2*error;}
  return {loss:loss/data.length,dw:dw/data.length,db:db/data.length};
}
export function trainStep(p:Parameters,rate:number){const g=regression(p);return {w:p.w-rate*g.dw,b:p.b-rate*g.db};}
export function sigmoid(z:number){return z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));}
export function neuron(x:number,w:number,b:number,y:number){const z=w*x+b,p=sigmoid(z);return {z,p,activationDerivative:p*(1-p),loss:Math.max(z,0)-z*y+Math.log1p(Math.exp(-Math.abs(z))),dz:p-y,dw:(p-y)*x,db:p-y};}
export function softmax(scores:number[],temperature=1){if(!Number.isFinite(temperature)||temperature<=0||!scores.length||scores.some(s=>!Number.isFinite(s)))throw Error('Invalid softmax inputs');const max=Math.max(...scores),exps=scores.map(s=>Math.exp((s-max)/temperature)),total=exps.reduce((a,b)=>a+b,0);return exps.map(e=>e/total);}
export const numberText=(n:number)=>Number.isFinite(n)?Number(n.toFixed(4)).toString():'غير معرّف';
