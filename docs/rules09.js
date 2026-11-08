import {ward013,alterWard013} from './subclass-rules013.js';
import {conditionsFor,breakConcentration} from './rules093.js';
// Regras compartilhadas de combate. Sem acesso à interface, para testes determinísticos.
export const DISABLING_CONDITIONS = ['Incapacitado','Inconsciente','Paralisado','Atordoado','Petrificado'];
export const cannotAct = c => c.lifeState === 'morto' || conditionsFor(c).some(x=>DISABLING_CONDITIONS.includes(x));
export const rageAvailable = c => !!c.raging && !cannotAct(c) && c.armor !== 'placas' && c.armor !== 'talas' && c.armor !== 'cota' && c.armor !== 'armadura pesada';
export function syncEffects(c, armorCategory='') {
 if(cannotAct(c) || armorCategory === 'Pesada') c.raging=false;
 if(cannotAct(c))breakConcentration(c);
 return c;
}
export function receiveDamage(c, amount, maxHp, {critical=false}={}){
 let damage=Math.max(0,Math.floor(Number(amount)||0));let wardAbsorbed=0;
 if(c.lifeState==='morto'||damage===0)return {damage:0,absorbed:0,remaining:0,instantDeath:false};
 const protection=ward013(c);if(protection?.created&&protection.hp>0){const w=alterWard013(c,{damage});wardAbsorbed=w.absorbed;damage=w.overflow;if(damage===0)return {damage:0,absorbed:0,wardAbsorbed,remaining:0,instantDeath:false};}
 const priorHp=c.hp,absorbed=Math.min(c.tempHp||0,damage),remaining=damage-absorbed;
 c.tempHp=(c.tempHp||0)-absorbed;
 if(priorHp===0){
  if(c.lifeState==='estavel')c.lifeState='morrendo';
  c.death.fail=Math.min(3,(c.death.fail||0)+(critical?2:1));
  if(c.death.fail===3)c.lifeState='morto';
 }else{
  c.hp=Math.max(0,priorHp-remaining);
  if(c.hp===0 && priorHp>0){c.lifeState='morrendo';c.death={success:0,fail:0};}
 }
 const instantDeath=priorHp>0 && remaining-priorHp>=maxHp;
 if(instantDeath)c.lifeState='morto';
 if(c.hp===0){c.conditions=[...new Set([...(c.conditions||[]),'Inconsciente'])];breakConcentration(c);c.raging=false;}
 return {damage,absorbed,wardAbsorbed,remaining,instantDeath};
}
export function receiveHealing(c,amount,maxHp){
 if(c.lifeState==='morto')return 0;
 const before=c.hp;c.hp=Math.max(0,Math.min(maxHp,c.hp+Math.max(0,Math.floor(Number(amount)||0))));
 if(c.hp>0){c.lifeState='consciente';c.death={success:0,fail:0};c.conditions=(c.conditions||[]).filter(x=>x!=='Inconsciente');}
 return c.hp-before;
}
export function resolveDeathSave(c,natural,total){
 if(c.hp!==0||c.lifeState==='morto'||c.lifeState==='estavel')return c.lifeState;
 if(natural===20){c.hp=1;c.death={success:0,fail:0};c.lifeState='consciente';c.conditions=(c.conditions||[]).filter(x=>x!=='Inconsciente');}
 else if(natural===1)c.death.fail=Math.min(3,c.death.fail+2);
 else if(total>=10)c.death.success=Math.min(3,c.death.success+1);
 else c.death.fail=Math.min(3,c.death.fail+1);
 if(c.death.fail>=3)c.lifeState='morto';
 else if(c.death.success>=3)c.lifeState='estavel';
 else if(c.hp===0)c.lifeState='morrendo';
 return c.lifeState;
}
