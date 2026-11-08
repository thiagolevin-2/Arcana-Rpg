import {featScore012,featMasteries012,hasFeat012} from './feat-rules012.js';
// Ficha Arcana 0.9.2 — efeitos determinísticos de equipamentos e infusões.
// Não interpreta automaticamente descrições livres de suplementos.
import {classLevel} from './progression.js';
import {SUPPLEMENT_OPTIONS} from './compatibility.js';

const number=(v,min=0,max=10)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):0));
export const ITEM_BONUS_KEYS=Object.freeze(['ac','initiative','saves','speed','spellAttack','spellDC']);
export const INFUSIONS=Object.freeze(SUPPLEMENT_OPTIONS.filter(o=>o.subtype==='infusion'&&o.classId==='artifice'&&o.selectable!==false));
export const infusionById=id=>INFUSIONS.find(x=>x.id===id);
export function infusionLimits(c){const n=classLevel(c,'artifice');return {known:n>=18?12:n>=14?10:n>=10?8:n>=6?6:n>=2?4:0,active:n>=18?6:n>=14?5:n>=10?4:n>=6?3:n>=2?2:0};}
export function infusionEligible(c,id){const opt=infusionById(id);return !!(opt&&classLevel(c,'artifice')>=Math.max(2,Number(opt.minimumArtificerLevel)||2));}
export function ensureEquipmentIds(c){for(const set of [c.weapons,c.items])for(const obj of Array.isArray(set)?set:[])if(obj&&!obj.id)obj.id=crypto.randomUUID();return c;}
const AMMUNITION_WEAPON_KEYS=new Set(['besta','arco','funda','arcolongo','bestapesada','bestamao','zarabatana','pistola','mosquete']);
export function infusionTargets(c){ensureEquipmentIds(c);const list=[];
 for(const w of c.weapons||[])list.push({id:'weapon:'+w.id,name:w.custom?.name||w.key||'Arma',kind:'weapon',magic:!!Number(w.magic),ammunition:w.custom?!!w.custom.ammunition||AMMUNITION_WEAPON_KEYS.has(w.custom.baseKey):AMMUNITION_WEAPON_KEYS.has(w.key)});
 if(c.armor&&c.armor!=='none')list.push({id:'armor',name:'Armadura equipada',kind:'armor',magic:!!(c.customArmors||[]).find(a=>c.armor==='custom:'+a.id)?.bonus});
 if(c.shield)list.push({id:'shield',name:'Escudo equipado',kind:'shield',magic:!!(c.customShields||[]).find(a=>a.id===c.shieldId)?.bonus});
 for(const item of c.items||[])if(item.qty>0)list.push({id:'item:'+item.id,name:item.name,kind:'item',equipped:!!item.equipped,magic:item.rarity&&item.rarity!=='Comum'});
 return list;
}
function allowedTarget(opt,target){if(!target||target.magic)return false;const name=opt.name.toLowerCase();if(name==='disparo recorrente')return target.kind==='weapon'&&!!target.ammunition;if(name.includes('arma')||name.includes('bumerangue'))return target.kind==='weapon';if(name.includes('armadura')||name.includes('defesa aprimorada'))return target.kind==='armor'||target.kind==='shield';if(name.includes('escudo'))return target.kind==='shield';if(name.includes('foco arcano'))return target.kind==='item';return true;}
export function learnInfusion(c,id){if(!infusionEligible(c,id))throw Error('Infusão indisponível para este nível de Artífice.');const known=[...new Set(c.knownInfusions||[])];if(known.includes(id)){c.knownInfusions=known.filter(x=>x!==id);c.activeInfusions=(c.activeInfusions||[]).filter(x=>x.optionId!==id);return false;}if(known.length>=infusionLimits(c).known)throw Error('Limite de infusões conhecidas atingido.');c.knownInfusions=[...known,id];return true;}
export function bindInfusion(c,id,targetId){if(!(c.knownInfusions||[]).includes(id)||!infusionEligible(c,id))throw Error('Aprenda primeiro a infusão.');const opt=infusionById(id),target=infusionTargets(c).find(x=>x.id===targetId);if(!allowedTarget(opt,target))throw Error('Esta infusão requer um alvo compatível, não mágico.');const current=(c.activeInfusions||[]).filter(x=>x.optionId!==id&&x.targetId!==targetId);
 if(current.length>=infusionLimits(c).active)throw Error('Limite de itens infundidos atingido.');c.activeInfusions=[...current,{optionId:id,targetId}];return true;}
export function unbindInfusion(c,id){c.activeInfusions=(c.activeInfusions||[]).filter(x=>x.optionId!==id);}
export function normalizeInfusions(c){ensureEquipmentIds(c);const lim=infusionLimits(c);c.knownInfusions=[...new Set(Array.isArray(c.knownInfusions)?c.knownInfusions.filter(x=>typeof x==='string'&&infusionEligible(c,x)):[])].slice(0,lim.known);const targets=infusionTargets(c);const active=[];
 for(const record of Array.isArray(c.activeInfusions)?c.activeInfusions:[]){if(!record||!c.knownInfusions.includes(record.optionId)||active.some(x=>x.optionId===record.optionId||x.targetId===record.targetId))continue;const target=targets.find(x=>x.id===record.targetId),opt=infusionById(record.optionId);if(allowedTarget(opt,target)&&active.length<lim.active)active.push({optionId:record.optionId,targetId:record.targetId});}
 c.activeInfusions=active;return c;}
export function infusionEffects(c){const effects={ac:0,spellAttack:0,weapons:{},notes:[]},level=classLevel(c,'artifice');const targets=infusionTargets(c);
 for(const binding of c.activeInfusions||[]){if(!c.knownInfusions?.includes(binding.optionId)||!infusionEligible(c,binding.optionId))continue;const option=infusionById(binding.optionId),target=targets.find(x=>x.id===binding.targetId);if(!allowedTarget(option,target))continue;const name=option.name.toLowerCase();
  if(name==='arma aprimorada'||name==='arma radiante'||name==='arma retornante'||name==='arma bumerangue'||name==='disparo recorrente')effects.weapons[binding.targetId.slice(7)]=name==='arma aprimorada'&&level>=10?2:1;
  else if(name==='defesa aprimorada')effects.ac+=level>=10?2:1;
  else if(name==='escudo de repulsão')effects.ac+=1;
  else if(name==='foco arcano aprimorado'&&target.equipped)effects.spellAttack+=level>=10?2:1;
  else effects.notes.push(option.name+' — efeito situacional; confira o texto.');
 }
 return effects;
}
export function itemEffects(c){const total=Object.fromEntries(ITEM_BONUS_KEYS.map(k=>[k,0]));const active=[];
 for(const item of c.items||[]){if(!item.equipped||Number(item.qty)<1||item.attunement&&!item.attuned)continue;active.push(item.name);for(const key of ITEM_BONUS_KEYS)total[key]+=number(item.bonuses?.[key],-10,10);}
 return {...total,active};}
export function normalizeEquipmentBonuses(raw){const value=raw&&typeof raw==='object'?raw:{};return Object.fromEntries(ITEM_BONUS_KEYS.map(k=>[k,number(value[k],-10,10)]));}
export function spellGrantInfo(raw){const source=String(raw?.source||'').slice(0,100).trim(),ability=['int','wis','cha','con'].includes(raw?.ability)?raw.ability:'int';const mode=['slot','free','atwill'].includes(raw?.mode)?raw.mode:'slot';return {source,ability,mode,group:String(raw?.group||'').slice(0,90),automatic:!!raw?.automatic,uses:mode==='free'?Math.max(1,Math.min(20,Math.floor(Number(raw?.uses)||1))):0,used:mode==='free'?Math.max(0,Math.min(20,Math.floor(Number(raw?.used)||0))):0,recovery:raw?.recovery==='short'?'short':'long',spellLevel:Number.isInteger(Number(raw?.spellLevel))?Math.max(0,Math.min(9,Number(raw.spellLevel))):null};}
export function grantCanCast(grant){const g=spellGrantInfo(grant);return !!g.source&&(g.mode!=='free'||g.used<g.uses);}
export function expendGrant(grant){const g=spellGrantInfo(grant);if(!grantCanCast(g))throw Error('Concessão sem usos disponíveis.');if(g.mode==='free')g.used++;return g;}
export function restoreGrants(c,long=false){for(const [id,g] of Object.entries(c.spellAccess||{})){if(!g||!['free','atwill','slot'].includes(g.mode))continue;if(long||g.recovery==='short')c.spellAccess[id]={...g,used:0};}return c;}

// Maestria com armas: controla quais propriedades o personagem conhece.
// A execução de efeitos em alvos depende de uma mesa/turno, por isso não altera automaticamente ataques.
import {WEAPONS,SPECIES} from './data.js';
import {motmSpellPlan} from './species-motm022.js';
import {training} from './progression.js';
export function masteryLimit(c){const fighter=classLevel(c,'guerreiro'),barbarian=classLevel(c,'barbaro'),other=['paladino','guardiao','ladino'].filter(k=>classLevel(c,k)>=1).length;
 const f=fighter>=16?6:fighter>=10?5:fighter>=4?4:fighter>=1?3:0;
 const b=barbarian>=10?4:barbarian>=4?3:barbarian>=1?2:0;
 return Math.min(20,f+b+other*2);
}
export function masteryEligible(c,key){const w=WEAPONS[key],t=training(c);return masteryLimit(c)>0&&!!w?.mastery&&!!(w.simple||t.martial||classLevel(c,'ladino')>0&&(w.finesse||w.light));}
export function toggleMastery(c,key){if(!masteryEligible(c,key))throw Error('Maestria de arma sem treinamento ou não disponível.');const chosen=[...new Set(c.masteries||[])];if(chosen.includes(key)){c.masteries=chosen.filter(x=>x!==key);return false;}if(chosen.length>=masteryLimit(c))throw Error('Limite de maestrias conhecidas atingido.');c.masteries=[...chosen,key];return true;}
export function normalizeMasteries(c){c.masteries=[...new Set(Array.isArray(c.masteries)?c.masteries.filter(id=>typeof id==='string'&&masteryEligible(c,id)):[])].slice(0,masteryLimit(c));return c;}

// Concessões fixas de magias de ancestralidade de 2024. As escolhas variáveis continuam manuais.
const ANCESTRAL_SPELLS={
 'elfo|Drow':[[1,'Luzes Dançantes'],[3,'Fogo das Fadas'],[5,'Escuridão']],
 'elfo|Alto Elfo':[[1,'Prestidigitação Arcana'],[3,'Detectar Magia'],[5,'Passo Nebuloso']],
 'elfo|Elfo Silvestre':[[1,'Arte Druídica'],[3,'Passos Largos'],[5,'Passo Sem Rastro']],
 'tiferino|Abissal':[[1,'Rajada de Veneno'],[3,'Raio Nauseante'],[5,'Paralisar Pessoa']],
 'tiferino|Ctônico':[[1,'Toque Necrótico'],[3,'Vitalidade Vazia'],[5,'Raio do Enfraquecimento']],
 'tiferino|Infernal':[[1,'Raio de Fogo'],[3,'Repreensão Diabólica'],[5,'Escuridão']]
};
export function ancestrySpellPlan(c,catalog){const key=String(c.speciesId||'')+'|'+String(c.variant||''),ability=['int','wis','cha'].includes(c.speciesCastingAbility)?c.speciesCastingAbility:'int';const preset=(ANCESTRAL_SPELLS[key]||[]).map(([lvl,name])=>[lvl,name]);
 if(key==='elfo|Alto Elfo'&&c.speciesChoices?.highElfCantrip){const selected=catalog.find(x=>x.id===c.speciesChoices.highElfCantrip&&x.level===0&&x.classes?.includes('Mago'));if(selected)preset[0]=[1,selected.name];}
 if(key==='gnomo|Gnomo das Rochas')preset.push([1,'Reparar'],[1,'Prestidigitação Arcana']);
 if(key==='gnomo|Gnomo do Bosque')preset.push([1,'Ilusão Menor'],[1,'Falar com Animais']);
 if(c.speciesId==='aasimar')preset.push([1,'Luz']);
 if(c.speciesId==='tiferino')preset.push([1,'Taumaturgia']);
 // Magias dos suplementos: preservam as condições de acesso dos traços publicados.
 const legacy=String(c.speciesId||'');
 // Mordenkainen 2022: magias raciais com atributo à escolha (Int/Sab/Car), uma vez por descanso longo cada.
 const motm=motmSpellPlan(c);const motmAtwill=new Set(motm.filter(x=>x[2]?.atwill).map(x=>x[1]));for(const [lvl,name] of motm)preset.push([lvl,name]);
 return preset.filter(([lvl])=>Number(c.level)>=lvl).flatMap(([lvl,name])=>{const sp=catalog.find(x=>x.name===name);if(!sp)return [];const forest=c.speciesId==='gnomo'&&c.variant==='Gnomo do Bosque'&&name==='Falar com Animais';
 const isMotmSpecies=motm.length>0;const atwill=sp.level===0||motmAtwill.has(name);
 return [{spellId:sp.id,source:'Espécie: '+(isMotmSpecies?(SPECIES[c.speciesId]?.name||'Mordenkainen'):key),ability:c.speciesId==='aasimar'?'cha':ability,group:'',mode:atwill?'atwill':'free',uses:atwill?0:forest?2+Math.floor((Number(c.level)-1)/4):1,recovery:'long',minimumLevel:lvl}];});}

export function syncAncestrySpellAccess(c,catalog){c.spellAccess??={};const plan=ancestrySpellPlan(c,catalog),desired=new Set(plan.map(x=>x.spellId));for(const [id,g] of Object.entries(c.spellAccess))if(g?.automatic&&!desired.has(id))delete c.spellAccess[id];
 for(const grant of plan){const current=c.spellAccess[grant.spellId];if(current&&!current.automatic)continue;c.spellAccess[grant.spellId]={...spellGrantInfo({...grant,used:current?.automatic?current.used:0}),automatic:true};}
 return plan;}

export function dragonBreathInfo(c){if(c.speciesId!=='draconato')return null;const types={Azul:'Elétrico',Branco:'Gélido',Bronze:'Elétrico',Cobre:'Ácido',Latão:'Ígneo',Negro:'Ácido',Ouro:'Ígneo',Prata:'Gélido',Verde:'Venenoso',Vermelho:'Ígneo'};const type=types[c.variant]||null;
 const level=Math.max(1,Math.min(20,Number(c.level)||1));const pb=2+Math.floor((level-1)/4);const constitution=featScore012(c,'con');
 return {type,formula:(level>=17?4:level>=11?3:level>=5?2:1)+'d10',dc:8+pb+Math.floor((constitution-10)/2),uses:pb,shapeOptions:['Cone de 4,5 m','Linha de 9 m por 1,5 m']};}
