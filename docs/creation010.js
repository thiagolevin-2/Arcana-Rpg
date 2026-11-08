import {ABILITIES,POINT_COST} from './data.js';

export function attributeSetup(c){
 const values=ABILITIES.map(([key])=>Number(c.base?.[key])||0),filled=values.filter(v=>Number.isInteger(v)&&v>=3&&v<=18).length;
 const method=['points','standard','rolled'].includes(c.method)?c.method:'manual';
 const validPoints=values.every(v=>Object.hasOwn(POINT_COST,v));
 const cost=method==='points'&&validPoints?values.reduce((n,v)=>n+POINT_COST[v],0):null;
 return {method,filled,cost,remaining:cost===null?null:27-cost,overBudget:cost!==null&&cost>27,
  label:method==='points'?'Compra de pontos':method==='standard'?'Conjunto padrão':method==='rolled'?'Rolagem 4d6':'Escolha um método ou distribua os atributos'};
}

export function displayedAbility(c,key){
 const base=Number(c.base?.[key]);
 if(!Number.isInteger(base)||base<3||base>18)return {total:null,modifier:null};
 const total=base+(Number(c.origin?.[key])||0)+(Number(c.advances?.[key])||0);
 return {total,modifier:Math.floor((total-10)/2)};
}
