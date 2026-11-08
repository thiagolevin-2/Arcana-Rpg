import {featSpellSources012,featRecords012,featState012,spendFeatSpell012,recordSlot012} from './feat-rules012.js';
// Ficha Arcana 0.9.4 — calcula macros sempre a partir da ficha atual.
// Não autoriza economia de ações, gastos ou efeitos condicionais implicitamente.
import {attackStats,derive,resources,weaponDefinition} from './core.js';
import {classLevel,hasClass,subclassFor} from './progression.js';
import {conditionsFor,activeSubclassFeatures} from './rules093.js';
import {normalizeCombatMacros,validMacroFormula} from './macros094-data.js';
const d20SpellAttack=(d,sp,owner)=>{
 const source=d.castingSources.find(x=>x.classId===owner)||d.castingSources[0];
 const ability=source?.ability||d.cast||'int';
 return {ability,bonus:source?.spellAttack??(d.pb+d.m[ability]),dc:source?.spellDC??(8+d.pb+d.m[ability]),owner:source?.classId||''};
};
const used=(c,k)=>Number(c.resourceUsed?.[k]||0);
const availability=(c,sp,d,book,allocation)=>{
 if(sp.level===0)return null;
 const special=c.spellAccess?.[sp.id];const featPlans=featSpellSources012(c,sp,book);for(const p of featPlans){const id=p.grantId+':'+p.key;if(p.free&&1-p.used>(allocation['feat:'+id]||0)){allocation['feat:'+id]=(allocation['feat:'+id]||0)+1;return {kind:'featSpell',id,grantId:p.grantId,featGrantId:p.grantId,key:p.key,spellId:sp.id,choiceStamp:JSON.stringify(featRecords012(c).find(g=>g.id===p.grantId)?.choices),name:'Uso gratuito: '+p.feat+' · '+sp.name};}}
 // A magia deve fazer parte da ficha; o callback fornece o teste de preparo completo.
 const freeKey=sp.name==='Destruição Divina'?'smite':sp.name==='Marca do Predador'?'favored':'';
 const limited=freeKey&&resources(c).find(r=>r.id===freeKey);
 if(limited && used(c,freeKey)+(allocation['res:'+freeKey]||0)<limited.max){allocation['res:'+freeKey]=(allocation['res:'+freeKey]||0)+1;return {kind:'resource',id:freeKey,name:limited.name};}
 if(special?.mode==='atwill')return {kind:'atwill',id:sp.id,name:'À vontade: '+sp.name};
 if(special?.mode==='free'&&Number(special.uses||0)-Number(special.used||0)>(allocation['grant:'+sp.id]||0)){
  allocation['grant:'+sp.id]=(allocation['grant:'+sp.id]||0)+1;return {kind:'grant',id:sp.id,name:'Uso gratuito: '+sp.name};
 }
 for(let i=sp.level-1;i<d.standardSlots.counts.length;i++){
  if(d.standardSlots.counts[i]-Number(c.slotsUsed?.[i]||0)>(allocation['slot:'+i]||0)){
   allocation['slot:'+i]=(allocation['slot:'+i]||0)+1;return {kind:'slot',featGrantId:featPlans[0]?.grantId,index:i,level:i+1,name:'Espaço '+(i+1)+'º círculo'};
  }
 }
 if(d.pactSlots.level>=sp.level&&Number(d.pactSlots.counts?.[0]||0)-Number(c.pactUsed||0)>(allocation.pact||0)){
  allocation.pact=(allocation.pact||0)+1;return {kind:'pact',featGrantId:featPlans[0]?.grantId,level:d.pactSlots.level,name:'Espaço de Pacto '+d.pactSlots.level+'º círculo'};
 }
 return false;
};
const safeSpell=(book,id)=>book.find(s=>s.id===id);
export function evaluateMacro(c,macro,{book=[],spellMechanic,spellReady,unarmedFormula}={}){
 normalizeCombatMacros(c);const d=derive(c),warnings=[],parts=[],costs=[],allocation={};
 if(typeof spellMechanic!=='function')throw Error('Calculadora de magias indisponível.');
 const ready=sp=>typeof spellReady==='function'?spellReady(c,sp):!!(c.prepared||[]).includes(sp.id);
 let base={kind:'weapon',label:'',bonus:0,key:'str',type:'Contundente',criticalThreshold:20,styleGreatWeapon:false,attack:true,save:'',dc:null};
 let primarySpell=null,weapon=null;
 const add=(name,formula,type,extra={})=>{if(!validMacroFormula(formula)){warnings.push(name+': fórmula inválida; efeito ignorado.');return false;}parts.push({label:name,formula,type,mainWeapon:!!extra.mainWeapon,critical:extra.critical!==false,spellDamage:!!extra.spellDamage});return true;};
 const useSpell=(sp,label,{extra=false,allowIndependent=false}={})=>{
  if(!sp||!ready(sp)){warnings.push(label+': magia não conhecida/preparada; ignorada.');return false;}
  if(c.raging){warnings.push(label+': impossível conjurar durante a Fúria; ignorada.');return false;}
  if(extra&&sp.name==='Destruição Divina'&&(base.kind==='spell'||base.ranged)){warnings.push(label+': exige acerto corpo a corpo ou ataque desarmado; ignorada.');return false;}
  const separate=extra&&sp.name!=='Destruição Divina';
  if(separate&&!allowIndependent){warnings.push(label+': magia independente; marque autorização manual para somá-la.');return false;}
  const payment=availability(c,sp,d,book,allocation);
  if(payment===false){warnings.push(label+': sem espaço ou uso disponível; ignorada.');return false;}
  const mechanic=spellMechanic(sp,payment?.level||sp.level,c);
  if(!mechanic||mechanic.healing||!validMacroFormula(mechanic.formula)){
   warnings.push(label+': não possui fórmula única de dano reconhecida; ignorada.');return false;
  }
  // Magias com múltiplos raios/mísseis não são somadas implicitamente num ataque único.
  if(separate)warnings.push(label+': soma manual. Confirme se o mesmo alvo recebe este dano e se a economia de ações permite.');
  if(mechanic.per)warnings.push(label+': '+mechanic.per);
  if(mechanic.save&&extra)warnings.push(label+': exige salvaguarda separada ('+mechanic.save+').');
  if(!add(label,mechanic.formula,mechanic.type,{spellDamage:true}))return false;
  if(payment)costs.push({...payment,spellId:sp.id,spellName:sp.name});
  return {mechanic,payment};
 };
 if(macro.baseType==='weapon'){
  weapon=c.weapons.find(x=>x.id===macro.baseId);
  if(!weapon)return {ready:false,reason:'A arma principal não está mais na ficha.',parts:[],warnings,costs:[]};
  const a=attackStats(c,weapon);if(c.shield&&(a.twoHanded||weapon.two))return {ready:false,reason:'Guarde o escudo para empunhar esta arma com as duas mãos.',parts:[],warnings,costs:[]};
  base={...base,kind:'weapon',label:a.name,bonus:a.attack,key:a.stat,type:a.type,criticalThreshold:a.criticalThreshold,styleGreatWeapon:a.styleGreatWeapon,weapon:a,finesse:a.finesse,ranged:a.ranged};
  add(a.name,a.formula,a.type,{mainWeapon:true});
 }else if(macro.baseType==='unarmed'){
  if(typeof unarmedFormula!=='function')return {ready:false,reason:'Ataque desarmado indisponível.',parts:[],warnings,costs:[]};
  const monk=hasClass(c,'monge')&&c.armor==='none'&&!c.shield,stat=monk&&d.m.dex>d.m.str?'dex':'str';
  const fighter=classLevel(c,'guerreiro'),criticalThreshold=fighter>=3&&subclassFor(c,'guerreiro')==='Campeão'?(fighter>=15?18:19):20;
  base={...base,kind:'unarmed',label:'Ataque desarmado',key:stat,bonus:d.m[stat]+d.pb,criticalThreshold,type:'Contundente',finesse:false,ranged:false};
  add('Ataque desarmado',unarmedFormula(c,d),'Contundente',{mainWeapon:true});
 }else if(macro.baseType==='spell'){
  const sp=safeSpell(book,macro.baseId);if(sp?.name==='Destruição Divina')return {ready:false,reason:'Destruição Divina exige um acerto corpo a corpo; adicione-a como dano extra a uma arma ou ataque desarmado.',parts:[],warnings,costs:[]};if(!sp||!ready(sp))return {ready:false,reason:'A magia principal não está conhecida e preparada.',parts:[],warnings,costs:[]};
  const payment=availability(c,sp,d,book,allocation);
  if(payment===false)return {ready:false,reason:'Sem espaço ou uso de magia disponível.',parts:[],warnings,costs:[]};
  const spec=spellMechanic(sp,payment?.level||sp.level,c);
  if(!spec||spec.healing||!validMacroFormula(spec.formula))return {ready:false,reason:'A magia não possui dano único reconhecido pelo motor; use outro ataque ou dano personalizado.',parts:[],warnings,costs:[]};
  const owner=d.castingSources.find(x=>Array.isArray(c.knownSpellsByClass?.[x.classId])&&c.knownSpellsByClass[x.classId].includes(sp.id))?.classId;
  const attack=d20SpellAttack(d,sp,owner);const featPlan=featSpellSources012(c,sp,book).find(p=>p.grantId===payment?.featGrantId);if(featPlan){attack.ability=featPlan.ability;attack.bonus=d.pb+d.m[featPlan.ability]+(Number(c.adjust?.spellAttack)||0);attack.dc=8+d.pb+d.m[featPlan.ability]+(Number(c.adjust?.spellDC)||0);}if(!featPlan&&!owner&&c.spellAccess?.[sp.id]?.ability){const ability=c.spellAccess[sp.id].ability;attack.ability=ability;attack.bonus=d.pb+(d.m[ability]||0)+(Number(c.adjust?.spellAttack)||0);attack.dc=8+d.pb+(d.m[ability]||0)+(Number(c.adjust?.spellDC)||0);}
  base={...base,kind:'spell',label:sp.name,attack:!!spec.attack,save:spec.save||'',dc:attack.dc,key:attack.ability,bonus:attack.bonus,type:spec.type,spell:sp,sourceClassId:attack.owner};
  primarySpell=sp;add(sp.name,spec.formula,spec.type,{spellDamage:true});
  if(spec.per)warnings.push(sp.name+': '+spec.per);
  if(payment)costs.push({...payment,spellId:sp.id,spellName:sp.name});
 }else return {ready:false,reason:'Tipo de ataque não reconhecido.',parts:[],warnings,costs:[]};
 const keys=new Set();
 for(const x of macro.parts||[]){
  if(['sneak','mark','radiant','aasimar'].includes(x.kind)&&keys.has(x.kind)){warnings.push('Bônus repetido: '+x.kind+' ignorado.');continue;}keys.add(x.kind);
  if(x.kind==='sneak'){
   const level=classLevel(c,'ladino');if(!level||base.kind!=='weapon'||! (base.finesse||base.ranged)){warnings.push('Ataque Furtivo: requer arma elegível e níveis de Ladino.');continue;}
   if(!c.sneak){warnings.push('Ataque Furtivo: marque que os requisitos situacionais estão atendidos.');continue;}
   add('Ataque Furtivo',Math.ceil(level/2)+'d6',base.type);warnings.push('Ataque Furtivo: confirme vantagem/aliado e limite de uma vez por turno.');
  }else if(x.kind==='mark'){
   if(!c.mark){warnings.push('Marca do Predador: marque que a marca está ativa no alvo.');continue;}
   add('Marca do Predador',classLevel(c,'guardiao')>=20?'1d10':'1d6','Energético');
  }else if(x.kind==='radiant'){
   if(classLevel(c,'paladino')<11||base.kind==='spell'||base.ranged){warnings.push('Golpes Radiantes: nível 11 de Paladino e ataque corpo a corpo exigidos.');continue;}
   add('Golpes Radiantes','1d8','Radiante');
  }else if(x.kind==='aasimar'){
   if(c.speciesId!=='aasimar'||!c.aasimarRevelationActive){warnings.push('Revelação Celestial não está ativa; dano extra não somado.');continue;}
   if(!c.aasimarBonusThisAttack){warnings.push('Revelação Celestial: autorize o dano extra para este ataque na aba Habilidades.');continue;}
   add('Revelação Celestial',String(d.pb),c.speciesChoices?.aasimarForm==='Mortalha Necrótica'?'Necrótico':'Radiante');warnings.push('Uma vez por turno: desative a opção após usar; o site não controla a passagem dos turnos.');
  }else if(x.kind==='spell'){
   const sp=safeSpell(book,x.spellId);useSpell(sp,sp?.name||'Magia adicional',{extra:true,allowIndependent:x.allowIndependent});
  }else if(x.kind==='item'){
   const item=c.items?.find(it=>it.id===x.itemId),p=item?.power;const already=allocation['item:'+x.itemId]||0;const needed=Number(p?.chargeCost)||0;
   if(!item||!p?.damageFormula||item.qty<1||!item.equipped||item.attunement&&!item.attuned||needed&&Number(item.charges||0)<already+needed){warnings.push('Poder de item: item não equipado/sintonizado, sem dano configurado ou sem cargas.');continue;}
   if(add(p.name||item.name,p.damageFormula,p.damageType||'Energético')){if(needed){allocation['item:'+item.id]=already+needed;costs.push({kind:'charges',id:item.id,amount:needed,name:'Cargas de '+item.name});}if(p.ac||p.speed||p.condition)warnings.push(p.name+': bônus ou condições do poder devem ser aplicados pela mesa ou usando o item normalmente.');}
  }else if(x.kind==='feature'){
   const r=resources(c).find(r=>r.id===x.resourceId),f=activeSubclassFeatures(c).some(f=>f.id===x.resourceId)?c.featureSettings?.[x.resourceId]:null;const max=r?.max??f?.max,already=r?used(c,r.id):Number(f?.used||0),taken=allocation['res:'+x.resourceId]||0;
   if(!max||already+taken>=max){warnings.push((x.name||'Habilidade')+': recurso indisponível; ignorado.');continue;}
   if(add(x.name||r?.name||'Habilidade',x.formula,x.type)){
    allocation['res:'+x.resourceId]=taken+1;costs.push({kind:r?'resource':'feature',id:x.resourceId,name:r?.name||x.name||'Recurso'});
   }
  }else if(x.kind==='custom'){
   if(add(x.name||'Dano adicional',x.formula,x.type))warnings.push((x.name||'Dano personalizado')+': confirme o gatilho e o número de usos manualmente.');
  }
 }
 const unable=['Incapacitado','Inconsciente','Paralisado','Atordoado','Petrificado'];if(conditionsFor(c).some(x=>unable.includes(x))||c.raging&&base.kind==='spell')return {ready:false,reason:'As condições atuais impedem esta ação.',parts:[],warnings,costs:[]};
 return {ready:true,base,parts,costs,warnings,primarySpell,summary:parts.map(p=>p.formula+' '+p.type).join(' + ')};
}
export function spendMacroCosts(c,costs,spendGrant){
 // Confirmação explícita APÓS a rolagem; transação sem gastos parciais.
 const d=derive(c),alloc={};for(const cost of costs){const key=cost.kind+':'+(cost.kind==='slot'?cost.index:cost.id||'pact');alloc[key]=(alloc[key]||0)+1;
  if(cost.kind==='slot'&&d.standardSlots.counts[cost.index]-Number(c.slotsUsed?.[cost.index]||0)<alloc[key])throw Error('Espaço de magia não está disponível.');
  if(cost.kind==='pact'&&Number(d.pactSlots.counts[0]||0)-Number(c.pactUsed||0)<alloc[key])throw Error('Espaço de Pacto não está disponível.');
  if(cost.kind==='resource'){const r=resources(c).find(r=>r.id===cost.id);if(!r||r.max-used(c,cost.id)<alloc[key])throw Error('Recurso já esgotado: '+cost.name);}
  if(cost.kind==='feature'){const f=activeSubclassFeatures(c).some(x=>x.id===cost.id)?c.featureSettings?.[cost.id]:null;if(!f||f.max-f.used<alloc[key])throw Error('Recurso de subclasse já esgotado.');}
  if(cost.kind==='charges'){const it=c.items?.find(x=>x.id===cost.id);const spent=costs.filter(x=>x.kind==='charges'&&x.id===cost.id).reduce((n,x)=>n+Number(x.amount||0),0);if(!it||!it.equipped||it.attunement&&!it.attuned||Number(it.charges||0)<spent)throw Error('Cargas indisponíveis: '+cost.name);}
  if(cost.kind==='featSpell'){const g=featRecords012(c).find(g=>g.id===cost.grantId);if(!g||JSON.stringify(g.choices)!==cost.choiceStamp||1-(c.featState012?.['spell:'+cost.grantId+':'+cost.key]?.used||0)<alloc[key])throw Error('Uso gratuito do talento não está mais disponível.');}
  if(cost.kind==='grant'){const g=c.spellAccess?.[cost.id];if(!g||g.mode!=='free'||g.uses-g.used<alloc[key])throw Error('Uso especial já esgotado.');}
 }
 for(const cost of costs){if(cost.kind==='slot'){recordSlot012(c,{kind:'standard',index:cost.index,spellName:cost.spellName||cost.name,before:c.slotsUsed[cost.index]||0});c.slotsUsed[cost.index]=(c.slotsUsed[cost.index]||0)+1;}if(cost.kind==='featSpell')spendFeatSpell012(c,{grantId:cost.grantId,key:cost.key,free:true});
  if(cost.kind==='pact'){recordSlot012(c,{kind:'pact',index:d.pactSlots.level-1,spellName:cost.spellName||cost.name,before:c.pactUsed||0});c.pactUsed=(c.pactUsed||0)+1;}
  if(cost.kind==='resource')c.resourceUsed[cost.id]=(c.resourceUsed[cost.id]||0)+1;
  if(cost.kind==='feature')c.featureSettings[cost.id].used++;
  if(cost.kind==='charges'){const it=c.items.find(x=>x.id===cost.id);it.charges-=Number(cost.amount||0);}
  if(cost.kind==='grant')c.spellAccess[cost.id]=spendGrant(c.spellAccess[cost.id]);
 }
 return costs.length;
}
