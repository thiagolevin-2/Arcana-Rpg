import {subclassPassives013} from './subclass-rules013.js';
import {ABILITIES,CLASSES,FULL_SLOTS} from './data.js';
import {CLASS_SPELL_PROGRESSION} from './class-progression-data.js';
import {hasFeat012,featSaves012,featScore012} from './feat-rules012.js';

const bounded=(n,min,max)=>Math.max(min,Math.min(max,Math.floor(Number(n)||0)));
export const XP_THRESHOLDS=Object.freeze([0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000]);
export const xpForLevel=level=>XP_THRESHOLDS[Math.max(1,Math.min(20,Math.floor(Number(level)||1)))-1];
export function xpProgress(xp,level){const current=Math.max(1,Math.min(20,Math.floor(Number(level)||1))),base=xpForLevel(current),next=current>=20?null:xpForLevel(current+1),value=Math.max(0,Math.floor(Number(xp)||0));return {current,base,next,xp:value,remaining:next===null?0:Math.max(0,next-value),percent:next===null?100:Math.max(0,Math.min(100,(value-base)/(next-base)*100)),ready:next!==null&&value>=next};}
export const MULTICLASS_REQUIREMENTS={barbaro:[['str']],bardo:[['cha']],bruxo:[['cha']],clerigo:[['wis']],druida:[['wis']],feiticeiro:[['cha']],guardiao:[['dex'],['wis']],guerreiro:[['str','dex']],ladino:[['dex']],mago:[['int']],monge:[['dex'],['wis']],paladino:[['str'],['cha']],artifice:[['int']]};
export const MULTICLASS_TRAINING={
 barbaro:{armor:0,shield:true,martial:true,text:'Armas marciais e escudos. Não concede novos treinamentos de armadura.'},
 bardo:{armor:1,skill:1,text:'Armaduras leves, uma perícia à escolha e um instrumento musical à escolha.'},
 bruxo:{armor:1,text:'Armaduras leves.'},clerigo:{armor:2,shield:true,text:'Armaduras leves e médias e escudos. A Ordem Divina pode conceder outros treinamentos.'},
 druida:{armor:1,shield:true,text:'Armaduras leves e escudos. A Ordem Primal pode conceder outros treinamentos.'},
 feiticeiro:{armor:0,text:'Dado de vida e características da classe; sem novas proficiências iniciais.'},
 guardiao:{armor:2,shield:true,martial:true,skill:1,text:'Armas marciais, armaduras leves e médias, escudos e uma perícia da lista de Guardião.'},
 guerreiro:{armor:2,shield:true,martial:true,text:'Armas marciais, armaduras leves e médias e escudos. Armaduras pesadas não são concedidas pela multiclasse.'},
 ladino:{armor:1,skill:1,skillOptions:['Acrobacia','Atletismo','Enganação','Furtividade','Intimidação','Intuição','Investigação','Percepção','Persuasão','Prestidigitação'],text:'Armaduras leves, uma perícia da lista de Ladino e ferramentas de ladrão.'},
 mago:{armor:0,text:'Dado de vida e características da classe; sem novas proficiências iniciais.'},
 monge:{armor:0,text:'Dado de vida e características da classe; sem novas proficiências iniciais.'},
 paladino:{armor:2,shield:true,martial:true,text:'Armas marciais, armaduras leves e médias e escudos. Armaduras pesadas não são concedidas pela multiclasse.'},
 artifice:{armor:2,shield:true,text:'Adaptação do Artífice de Tasha: armaduras leves e médias, escudos, ferramentas de ladrão e de inventor. Pré-requisito: Inteligência 13.'}
};
export function canonicalSubclassName(id,name){return id==='guerreiro'&&name==='Mestre de Batalha'?'Mestre da Batalha':name||'';}
export const classEntries=c=>Array.isArray(c.classes)&&c.classes.length?c.classes.map(e=>({...e,level:bounded(e.level,1,20),subclass:canonicalSubclassName(e.classId,e.subclass)})):[{classId:c.classId,level:bounded(c.level,1,20),subclass:canonicalSubclassName(c.classId,c.subclass),order:c.order||''}];
export const totalLevel=c=>classEntries(c).reduce((n,e)=>n+e.level,0);
export const classLevel=(c,id)=>classEntries(c).find(e=>e.classId===id)?.level||0;
export const hasClass=(c,id,min=1)=>classLevel(c,id)>=min;
export const subclassFor=(c,id)=>classEntries(c).find(e=>e.classId===id)?.subclass||'';
export const orderFor=(c,id)=>classEntries(c).find(e=>e.classId===id)?.order||(c.classId===id?c.order||'':'');
export const classSummary=c=>classEntries(c).map(e=>CLASSES[e.classId].name+' '+e.level).join(' / ');
export function syncClassState(c){if(c.classes?.length){c.classId=c.classes[0].classId;c.level=totalLevel(c);c.subclass=c.classes[0].subclass||'';c.order=c.classes[0].order||'';}return c;}
export function validateClassPlan(c,entries,{checkRequirements=true}={}){
 if(!Array.isArray(entries)||!entries.length||entries.length>13)throw Error('Escolha de uma a treze classes.');
 if(new Set(entries.map(e=>e.classId)).size!==entries.length)throw Error('Cada classe deve aparecer uma única vez.');
 if(entries.some(e=>!Object.hasOwn(CLASSES,e.classId)||!Number.isInteger(Number(e.level))||Number(e.level)<1||Number(e.level)>20))throw Error('Classe ou nível inválido.');
 if(entries.reduce((n,e)=>n+Number(e.level),0)>20)throw Error('O nível total máximo é 20.');
 if(entries[0].classId!==c.classId)throw Error('A classe inicial deve permanecer a primeira: ela define PV iniciais e proficiências.');
 if(checkRequirements&&entries.length>1){const result=multiclassEligibility(c,entries.map(e=>e.classId));if(!result.valid)throw Error(result.errors.join(' '));}
 return entries.map(e=>({classId:e.classId,level:Number(e.level),subclass:Number(e.level)>=3&&CLASSES[e.classId].subclasses.includes(canonicalSubclassName(e.classId,e.subclass))?canonicalSubclassName(e.classId,e.subclass):'',order:['Protetor','Taumaturgo','Guardião','Mago'].includes(e.order)?e.order:''}));
}
export function multiclassEligibility(c,target){
 const ids=Array.isArray(target)?target:[...new Set([...classEntries(c).map(e=>e.classId),target])];
 const sc=Object.fromEntries(ABILITIES.map(([k])=>[k,featScore012(c,k)]));
 const errors=[];
 for(const id of ids){if(!Object.hasOwn(CLASSES,id)){errors.push('Classe inválida.');continue;}for(const group of MULTICLASS_REQUIREMENTS[id]||[])if(!group.some(k=>sc[k]>=13))errors.push(CLASSES[id].name+' exige '+group.map(k=>ABILITIES.find(a=>a[0]===k)[2]).join(' ou ')+' 13.');}
 return {valid:errors.length===0,errors};
}
export function castingSources(c){return classEntries(c).flatMap(e=>{
 const cl=CLASSES[e.classId],third=(e.classId==='guerreiro'&&e.subclass==='Cavaleiro Místico'||e.classId==='ladino'&&e.subclass==='Trapaceiro Arcano')&&e.level>=3;
 if(!cl.casting&&!third)return [];
 const caster=third?'third':cl.caster,ability=third?'int':cl.casting,effective=caster==='full'?e.level:caster==='half'?Math.ceil(e.level/2):caster==='third'?Math.ceil(e.level/3):0;
 const maxSpellLevel=caster==='pact'?Math.min(5,Math.ceil(e.level/2)):(FULL_SLOTS[effective]||[]).length;
 return [{...e,ability,caster,maxSpellLevel,listName:third?'Mago':cl.name,name:cl.name}];
 });}
export function slotPools(c){
 const sources=castingSources(c),regular=sources.filter(e=>e.caster!=='pact'),warlock=sources.find(e=>e.caster==='pact');
 const effective=regular.reduce((sum,e)=>sum+(e.caster==='full'?e.level:e.caster==='half'?Math.ceil(e.level/2):regular.length>1?Math.floor(e.level/3):Math.ceil(e.level/3)),0);
 return {standard:{pact:false,level:0,effectiveLevel:effective,counts:FULL_SLOTS[effective]||[]},pact:{pact:true,level:warlock?Math.min(5,Math.ceil(warlock.level/2)):0,counts:warlock?[warlock.level<2?1:warlock.level<11?2:warlock.level<17?3:4]:[]}};
}
export function activeCastingSource(c){const sources=castingSources(c);return sources.find(e=>e.classId===c.castingClassId)||sources[0]||null;}
export function preparationClassIds(c,spell){
 const sources=castingSources(c),eligible=sources.filter(s=>spell.level<=s.maxSpellLevel),saved=c.spellClasses?.[spell.id];
 if(Array.isArray(saved))return saved.filter(id=>eligible.some(s=>s.classId===id));
 if(!c.prepared?.includes(spell.id))return [];
 const source=eligible.find(s=>spell.classes.includes(s.listName))||eligible.find(s=>s.classId===activeCastingSource(c)?.classId);
 return source?[source.classId]:[];
}
export function preparedLimitFor(c,id){const source=castingSources(c).find(e=>e.classId===id);if(!source)return 0;const n=source.level;
 if(id==='artifice')return Math.max(1,Math.floor((featScore012(c,'int')-10)/2)+Math.floor(n/2));
 const key=source.caster==='third'?(id==='guerreiro'?'cavaleiro_mistico':'trapaceiro_arcano'):id;const table=CLASS_SPELL_PROGRESSION[key];return table?.prepared?.[n-1]||0;
}
export function hitDicePools(c){const totals={};for(const e of classEntries(c)){const sides=CLASSES[e.classId].hd;totals[sides]=(totals[sides]||0)+e.level;}
 const used={...(c.usedHDByDie||{})};if(!c.usedHDByDie){let remaining=bounded(c.usedHD,0,totalLevel(c));for(const [sides,max] of Object.entries(totals)){used[sides]=Math.min(max,remaining);remaining-=used[sides];}}
 return Object.entries(totals).map(([sides,max])=>({sides:Number(sides),max,used:bounded(used[sides],0,max),remaining:max-bounded(used[sides],0,max)})).sort((a,b)=>b.sides-a.sides);
}
export function hitPointBase(c,constitutionModifier){let hp=0;for(const [i,e]of classEntries(c).entries())for(let level=1;level<=e.level;level++){
 const hd=CLASSES[e.classId].hd,initial=i===0&&level===1,record=(c.hpRolls||[]).find(r=>r.classId===e.classId&&r.level===level),value=initial?hd:record?bounded(record.roll,1,hd):hd/2+1;hp+=Math.max(1,value+constitutionModifier);
 }return hp;}
export function savingThrows(c){const prof=new Set(CLASSES[c.classId].saves);if(hasClass(c,'monge',14))for(const [k]of ABILITIES)prof.add(k);for(const k of [...(c.extraSaves||[]),...featSaves012(c),...subclassPassives013(c).saves])if(ABILITIES.some(a=>a[0]===k))prof.add(k);return [...prof];}
export function training(c){
 const initial=CLASSES[c.classId],armorRank=['Nenhuma','Leve','Média','Pesada'].indexOf(initial.armor);let armor=Math.max(0,armorRank),shield=['barbaro','clerigo','druida','guerreiro','paladino','guardiao','artifice'].includes(c.classId),martial=initial.weapons==='Marciais';
 for(const e of classEntries(c).slice(1)){const t=MULTICLASS_TRAINING[e.classId]||{};armor=Math.max(armor,t.armor||0);shield||=!!t.shield;martial||=!!t.martial;}
 if(hasClass(c,'clerigo')&&orderFor(c,'clerigo')==='Protetor'){armor=3;martial=true;}
 if(hasClass(c,'druida')&&orderFor(c,'druida')==='Guardião'){armor=Math.max(armor,2);martial=true;}
 if(hasClass(c,'bardo',3)&&subclassFor(c,'bardo')==='Colégio da Bravura'){armor=Math.max(armor,2);shield=true;martial=true;}
 if(hasClass(c,'artifice',3)&&subclassFor(c,'artifice')==='Armeiro')armor=3;
 if(hasClass(c,'artifice',3)&&subclassFor(c,'artifice')==='Ferreiro de Batalha')martial=true;
 // Talentos concedem treinamento; não são pré-requisitos do próprio talento.
 const feats=new Set(c.feats||[]);
 if(feats.has('Especialista em Armaduras Leves')){armor=Math.max(armor,1);shield=true;}
 if(feats.has('Especialista em Armaduras Médias'))armor=Math.max(armor,2);
 if(feats.has('Especialista em Armaduras Pesadas'))armor=Math.max(armor,3);
 if(hasFeat012(c,'Treinamento com Armas Marciais'))martial=true;
 const sub=subclassPassives013(c);armor=Math.max(armor,sub.armor);shield||=sub.shield;martial||=sub.martial;return {armor,shield,martial};
}
export function attackCount(c){const fighter=classLevel(c,'guerreiro');let count=fighter>=20?4:fighter>=11?3:fighter>=5?2:1;
 if(['barbaro','monge','paladino','guardiao'].some(id=>hasClass(c,id,5)))count=Math.max(count,2);
 if(hasClass(c,'bardo',6)&&subclassFor(c,'bardo')==='Colégio da Bravura')count=Math.max(count,2);
 if(hasClass(c,'mago',6)&&subclassFor(c,'mago')==='Lâmina Cantante')count=Math.max(count,2);
 if(hasClass(c,'artifice',5)&&['Armeiro','Ferreiro de Batalha'].includes(subclassFor(c,'artifice')))count=Math.max(count,2);
 return count;
}
export const abilityImprovementAt=(id,n)=>[4,8,12,16,19,...(id==='guerreiro'?[6,14]:id==='ladino'?[10]:[])].includes(n);

export function cantripLimitFor(c,id){const source=castingSources(c).find(e=>e.classId===id);if(!source)return 0;if(id==='paladino'&&source.level>=2&&c.fightingStyleAlternative==='Guerreiro Abençoado')return 2;if(id==='guardiao'&&source.level>=2&&c.fightingStyleAlternative==='Guerreiro Druídico')return 2;const key=source.caster==='third'?(id==='guerreiro'?'cavaleiro_mistico':'trapaceiro_arcano'):id;return CLASS_SPELL_PROGRESSION[key]?.cantrips?.[source.level-1]||0;}
