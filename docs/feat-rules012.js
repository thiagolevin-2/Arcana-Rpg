// Ficha Arcana 0.12 — escolhas explícitas, benefícios fixos e recursos dos talentos.
// A planilha revisada é a decisão de produto. Alvos, duração e limites por turno são manuais.
import {ABILITIES,SKILLS,BACKGROUNDS,CLASSES,WEAPONS} from './data.js';
import {SUPPLEMENT_OPTIONS} from './compatibility.js';
import {FIGHTING_STYLE_FEATS,featEligibility} from './feats.js';
const keys=ABILITIES.map(x=>x[0]);
const mental=['int','wis','cha'];
const integer=(x,min=0,max=999)=>Math.max(min,Math.min(max,Math.floor(Number(x)||0)));
const text=(x,n=300)=>String(x??'').trim().slice(0,n);
export const canonicalFeat012=name=>text(name,120).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s*\((clerigo|druida|mago)\)\s*$/,'').replace(/\s+/g,' ');
const same=(a,b)=>canonicalFeat012(a)===canonicalFeat012(b);
export const ELEMENTS012=['Ácido','Elétrico','Gélido','Ígneo','Trovejante'];
export const ENERGY_TYPES012=[...ELEMENTS012,'Necrótico','Psíquico','Radiante','Venenoso'];
export const ARTISAN_TOOLS012=['Suprimentos de Alquimista','Suprimentos de Calígrafo','Ferramentas de Carpinteiro','Ferramentas de Cartógrafo','Suprimentos de Cervejeiro','Ferramentas de Coureiro','Ferramentas de Entalhador','Ferramentas de Ferreiro','Ferramentas de Funileiro','Ferramentas de Joalheiro','Ferramentas de Oleiro','Ferramentas de Pedreiro','Suprimentos de Pintor','Ferramentas de Sapateiro','Ferramentas de Tecelão','Ferramentas de Vidreiro','Utensílios de Cozinheiro'];
export const INSTRUMENTS012=['Alaúde','Xilofone','Flauta','Flauta de Pã','Gaita de Foles','Lira','Oboé','Tambor','Trombeta','Violino'];
export const TOOLS012=[...ARTISAN_TOOLS012,'Ferramentas de Ladrão','Ferramentas de Navegador','Kit de Disfarce','Kit de Falsificação','Kit de Herbalismo','Kit de Veneno',...INSTRUMENTS012];
export const UNCHANGED_FEATS012=new Set(['Agressor','Atirador Arcano','Atleta','Ator','Chef','Combatente Montado','Curandeiro','Dádiva da Proeza em Combate',...FIGHTING_STYLE_FEATS.filter(n=>n!=='Protetivo')].map(canonicalFeat012));
const spec=(abilities,extra={})=>({abilities,points:1,cap:20,...extra});
export const FEAT_SPECS012={
 'Adepto Elemental':spec(mental,{choice:'element',repeatable:true}),
 'Adepto Metamágico':{choice:'metamagic'},'Adepto Místico':{choice:'invocation'},
 'Analítico':spec(['int','wis'],{choice:'adaptiveSkill',skills:['Intuição','Investigação','Percepção']}),
 'Artifista':{choice:'toolNotes'},'Aumento no Valor de Atributo':spec(keys,{points:2,repeatable:true}),
 'Conjurador Bélico':spec(mental),'Conjurador Ritualista':spec(mental,{choice:'rituals'}),
 'Dádiva da Fortitude':spec(keys,{cap:30}),'Dádiva da Proficiência em Perícia':spec(keys,{cap:30,choice:'epicSkill'}),
 'Dádiva da Recordação de Magia':spec(mental,{cap:30}),'Dádiva da Recuperação':spec(keys,{cap:30}),
 'Dádiva da Resistência à Energia':spec(keys,{cap:30,choice:'resistances'}),'Dádiva da Velocidade':spec(keys,{cap:30}),
 'Dádiva da Viagem Dimensional':spec(keys,{cap:30}),'Dádiva da Visão Verdadeira':spec(keys,{cap:30}),
 'Dádiva do Ataque Irresistível':spec(['str','dex'],{cap:30}),'Dádiva do Destino':spec(keys,{cap:30}),
 'Dádiva do Espírito da Noite':spec(keys,{cap:30}),'Duelista Defensivo':spec(['dex']),
 'Envenenador':spec(['dex','int']),'Esmagador':spec(['str','con']),'Especialista Ambidestro':spec(['str','dex']),
 'Especialista em Armaduras Leves':spec(['str','dex']),'Especialista em Armaduras Médias':spec(['str','dex']),
 'Especialista em Armaduras Pesadas':spec(['str','con']),'Especialista em Besta':spec(['dex']),
 'Especialista em Perícia':spec(keys,{choice:'skillExpert'}),'Exterminador de Conjuradores':spec(['str','dex']),
 'Habilidoso':{choice:'skilled',repeatable:true},'Imobilizador':spec(['str','dex']),
 'Iniciado Artífice':{choice:'artificerSpell'},'Iniciado em Combate':{choice:'style'},
 'Iniciado em Magia':{choice:'magicInitiate',repeatable:true},'Líder Inspirador':spec(['wis','cha']),
 'Mente Aguçada':spec(['int'],{choice:'adaptiveSkill',skills:['Arcanismo','História','Investigação','Natureza','Religião']}),
 'Mestre das Armas':spec(['str','dex'],{choice:'mastery'}),'Mestre em Armaduras Médias':spec(['str','dex']),
 'Mestre em Armaduras Pesadas':spec(['str','con']),'Mestre em Armas de Haste':spec(['str','dex']),
 'Mestre em Armas Grandes':spec(['str']),'Mestre em Escudos':spec(['str']),'Mestre-Atirador':spec(['dex']),
 'Músico':{choice:'instruments'},'Perfurador':spec(['str','dex']),'Pistoleiro':spec(['dex']),
 'Presente do Dragão Cromático':{choice:'chromatic'},'Presente do Dragão de Gemas':spec(mental),
 'Presente do Dragão Metálico':{choice:'metallicSpell'},'Protetivo':{},
 'Resiliente':spec(keys,{choice:'save'}),'Resistente':spec(['con']),'Sentinela':spec(['str','dex']),
 'Sorrateiro':spec(['dex']),'Talhador':spec(['str','dex']),'Telecinético':spec(mental,{choice:'telekinetic'}),
 'Telepático':spec(mental,{choice:'telepathic'}),'Tocado Pelas Sombras':spec(mental,{choice:'shadow'}),
 'Tocado Por Fadas':spec(mental,{choice:'fey'}),'Treinamento com Armas Marciais':spec(['str','dex']),
 'Valentão de Taverna':{},'Velocista':spec(['dex','con'])
};
export function featSpec012(name){return FEAT_SPECS012[Object.keys(FEAT_SPECS012).find(n=>same(n,name))]||{};}
export const featLevel012=c=>Array.isArray(c.classes)&&c.classes.length?c.classes.reduce((s,e)=>s+integer(e.level,1,20),0):integer(c.level,1,20);
export const featPB012=c=>2+Math.floor((featLevel012(c)-1)/4);
export function featNames012(c){return [...new Set([BACKGROUNDS[c.backgroundId]?.feat,...(Array.isArray(c.feats)?c.feats:[]),...(c.speciesId==='humano'?[c.speciesChoices?.humanFeat]:[])].filter(x=>typeof x==='string'&&x.trim()))];}
export const hasFeat012=(c,name)=>featNames012(c).some(n=>same(n,name));
export function featOriginIssues012(c){
 const bg=BACKGROUNDS[c.backgroundId]?.feat,human=c.speciesId==='humano'?c.speciesChoices?.humanFeat:'';
 if(!bg||!human||!same(bg,human))return [];
 if(same(bg,'Habilidoso'))return [];
 if(same(bg,'Iniciado em Magia')){const a=bg.match(/\(([^)]+)\)/)?.[1],b=human.match(/\(([^)]+)\)/)?.[1];if(a&&b&&a!==b)return [];}
 return ['O talento '+human+' já foi concedido pelo antecedente. Escolha outro talento de Origem.'];
}
export const featRecords012=(c,name)=>Array.isArray(c.featGrants012)?c.featGrants012.filter(g=>hasFeat012(c,g.name)&&(!name||same(g.name,name))):[];
export function normalizeFeats012(c){
 const raw=Array.isArray(c.featGrants012)?c.featGrants012:[],ids=new Set();
 c.featGrants012=raw.slice(0,100).filter(g=>g&&typeof g==='object'&&text(g.id,80)&&!ids.has(g.id)&&ids.add(g.id)&&featNames012(c).some(n=>same(n,g.name))).map(g=>{
  const rule=featSpec012(g.name),boosts={};let remaining=rule.points||0;
  for(const k of keys){const n=integer(g.boosts?.[k],0,Math.min(2,remaining));if(rule.abilities?.includes(k)&&n){boosts[k]=n;remaining-=n;}}
  const choices=g.choices&&typeof g.choices==='object'&&!Array.isArray(g.choices)?g.choices:{};
  const strings=['ability','skill','expertise','element','list','style','mastery','tool','note','spell','castAbility'];
  const clean=Object.fromEntries(strings.filter(k=>choices[k]!==undefined).map(k=>[k,text(choices[k],k==='note'?2000:160)]));
  for(const k of ['spells','cantrips','tools','resistances','metamagics','proficiencies'])clean[k]=Array.isArray(choices[k])?[...new Set(choices[k].filter(x=>typeof x==='string').map(x=>text(x,160)))].slice(0,20):[];
  clean.abilityAlreadyApplied=!!choices.abilityAlreadyApplied;
  return {id:text(g.id,80),name:text(g.name,120),source:text(g.source||'Adicional',160),level:integer(g.level,1,20),boosts,choices:clean,masteryRest:integer(g.masteryRest,0,99999)};
 });
 const rawState=c.featState012&&typeof c.featState012==='object'&&!Array.isArray(c.featState012)?c.featState012:{};
 c.featState012=Object.fromEntries(Object.entries(rawState).slice(0,400).filter(([k,v])=>k.length<=240&&v&&typeof v==='object'&&!Array.isArray(v)).map(([k,v])=>[k,{used:integer(v.used,0,999),stock:integer(v.stock,0,999),active:!!v.active,note:text(v.note,2000),element:ENERGY_TYPES012.includes(v.element)?v.element:'',weaponId:text(v.weaponId,80),names:text(v.names,1000)}]));
 c.featLongRest012=integer(c.featLongRest012,0,99999);
 c.featCombat012={gwm:!!c.featCombat012?.gwm,tavernReroll:c.featCombat012?.tavernReroll!==false,night:!!c.featCombat012?.night,blindsight:!!c.featCombat012?.blindsight};
 return c;
}
export function featBoosts012(c){const out=Object.fromEntries(keys.map(k=>[k,0]));for(const g of featRecords012(c))for(const k of keys)out[k]+=integer(g.boosts?.[k],0,2);return out;}
export function featStyles012(c){return featRecords012(c,'Iniciado em Combate').map(g=>g.choices.style).filter(n=>FIGHTING_STYLE_FEATS.includes(n));}
export function featSkills012(c,base){const out={...base};if(hasFeat012(c,'Dádiva da Proficiência em Perícia'))for(const [s]of SKILLS)out[s]=Math.max(1,out[s]||0);
 for(const g of featRecords012(c)){
  if(g.choices.skill&&SKILLS.some(([s])=>s===g.choices.skill))out[g.choices.skill]=Math.max(out[g.choices.skill]||0,g.choices.expertise===g.choices.skill?2:1);
  if(g.choices.expertise&&SKILLS.some(([s])=>s===g.choices.expertise))out[g.choices.expertise]=2;
  for(const n of g.choices.proficiencies||[])if(n.startsWith('skill:')&&SKILLS.some(([s])=>s===n.slice(6)))out[n.slice(6)]=Math.max(1,out[n.slice(6)]||0);
 }return out;
}
export function featTools012(c){const out=[];if(hasFeat012(c,'Envenenador'))out.push('Kit de Veneno');if(hasFeat012(c,'Valentão de Taverna'))out.push('Armas improvisadas');
 for(const g of featRecords012(c)){out.push(...(g.choices.tools||[]));if(g.choices.tool)out.push(g.choices.tool);for(const p of g.choices.proficiencies||[])if(p.startsWith('tool:'))out.push(p.slice(5));}
 return [...new Set(out)];
}
export const featSaves012=c=>featRecords012(c,'Resiliente').map(g=>g.choices.ability).filter(k=>keys.includes(k));
export const featMasteries012=c=>featRecords012(c,'Mestre das Armas').map(g=>g.choices.mastery).filter(k=>WEAPONS[k]);
export function featSenses012(c){return [...(hasFeat012(c,'Dádiva da Visão Verdadeira')?[{name:'Visão Verdadeira',range:18,text:'Você enxerga na escuridão comum e mágica, vê criaturas e objetos Invisíveis, percebe ilusões visuais, reconhece a forma original de criaturas transformadas e vê o Plano Etéreo dentro do alcance. Confira as exceções na descrição de Visão Verdadeira.'}]:[]),...(hasFeat012(c,'Sorrateiro')?[{name:'Visão às Cegas',range:3,text:'Confirme se o alvo está no alcance de 3 m. O jogador resolve o efeito nas condições.'}]:[])];}
export function featCatalog012(name){return SUPPLEMENT_OPTIONS.find(x=>x.kind==='feat'&&x.selectable!==false&&same(x.name,name)&&x.source==='phb2024')||SUPPLEMENT_OPTIONS.find(x=>x.kind==='feat'&&x.selectable!==false&&same(x.name,name));}
export function featContext012(c,context={}){return {...context,level:context.level||featLevel012(c),ownedFeats:featNames012(c)};}
export function featInvocationAllowed012(c,option,options=SUPPLEMENT_OPTIONS){
 if(!option||option.kind!=='invocation'||option.selectable===false)return {allowed:false,reason:'Invocação indisponível.'};
 const raw=String(option.summary||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const requirement=(raw.match(/Pre-requisitos?\s*:\s*([^\n.]+)/i)?.[1]||'').trim();
 const warlock=(c.classes?.find(e=>e.classId==='bruxo')?.level)||(c.classId==='bruxo'?c.level:0);
 const level=Number(raw.match(/Bruxo Nivel\s+(\d+)/i)?.[1]||requirement.match(/Nivel\s+(\d+)/i)?.[1]||0);
 if((requirement||level)&&!warlock)return {allowed:false,reason:'A invocação tem pré-requisito: exige ser Bruxo e cumpri-lo.'};
 if(level&&warlock<level)return {allowed:false,reason:'Exige Bruxo de nível '+level+'.'};
 const chosen=[...(c.advancedChoices?.invocation||[]),...featRecords012(c,'Adepto Místico').map(g=>g.choices.spell)];
 for(const name of ['Pacto da Corrente','Pacto da Lâmina','Pacto do Tomo','Lâmina Sedenta']){
  if(option.name!==name&&raw.slice(0,220).includes(name)){const other=options.find(x=>x.kind==='invocation'&&x.name===name);if(other&&!chosen.includes(other.id))return {allowed:false,reason:'Escolha primeiro '+name+'.'};}
 }
 return {allowed:true,reason:''};
}
const scoreFrom=(c,k)=>integer(c.base?.[k]??10,1,30)+integer(c.origin?.[k],0,30)+integer(c.advances?.[k],0,30)+featBoosts012(c)[k];
export const featScore012=(c,k)=>Math.min(30,Math.max(1,scoreFrom(c,k)));
export function validateFeatChoice012(c,name,choice={}, {context={},book=[],options=SUPPLEMENT_OPTIONS,recordId='',existing=false}={}){
 const rule=featSpec012(name),old=featRecords012(c).find(g=>g.id===recordId),others=featRecords012(c,name).filter(g=>g.id!==recordId);
 const ctx=featContext012(c,context),catalog=featCatalog012(name);
 if(!existing&&['Adepto Metamágico','Adepto Místico'].some(n=>same(n,name))&&!ctx.spellcasting)throw Error('Este talento exige Conjuração ou Magia de Pacto.');
 if(!existing&&catalog){const status=featEligibility(catalog,ctx);if(!status.eligible)throw Error(status.reason);}
 if(!existing&&!rule.repeatable&&hasFeat012(c,name))throw Error('Você já possui este talento.');
 if(!existing&&rule.repeatable&&hasFeat012(c,name)&&!others.length)throw Error('Configure a aquisição anterior antes de registrar outra cópia deste talento.');
 if(existing&&!hasFeat012(c,name))throw Error('O personagem não possui este talento.');
 if(existing&&!old&&others.length&&!rule.repeatable)throw Error('Este talento já possui escolhas configuradas. Edite a aquisição existente.');
 if(rule.abilities){
  const boosts=rule.points===2?choice.boosts:{[choice.ability]:1};
  if(!boosts||Object.values(boosts).reduce((a,v)=>a+Number(v||0),0)!==rule.points)throw Error('Distribua '+rule.points+' ponto(s) de atributo.');
  for(const [k,n]of Object.entries(boosts)){
   if(!rule.abilities.includes(k)||!Number.isInteger(n)||n<1||n>2)throw Error('Escolha um atributo permitido pelo talento.');
   const before=Number(ctx.abilities?.[k]??scoreFrom(c,k))-Number(old?.boosts?.[k]||0);
   if(!choice.abilityAlreadyApplied&&before+n>rule.cap)throw Error('O talento não pode elevar esse atributo acima de '+rule.cap+'.');
  }
 }
 const skills=ctx.skills||{},prof=s=>Number(skills[s]||0)>0,expert=s=>Number(skills[s]||0)>=2;
 if(rule.choice==='adaptiveSkill'){
  if(!rule.skills.includes(choice.skill)||expert(choice.skill))throw Error('Escolha uma perícia permitida sem especialização.');
 }
 if(rule.choice==='skillExpert'&&(!SKILLS.some(([s])=>s===choice.skill)||prof(choice.skill)))throw Error('Escolha uma nova proficiência.');
 if(['skillExpert','epicSkill'].includes(rule.choice)&&(!SKILLS.some(([s])=>s===choice.expertise)||expert(choice.expertise)||!prof(choice.expertise)&&choice.expertise!==choice.skill))throw Error('Escolha uma perícia com proficiência e sem especialização.');
 if(rule.choice==='save'&&(ctx.saveProficiencies||[]).includes(choice.ability))throw Error('Você já tem proficiência nessa salvaguarda.');
 if(rule.choice==='skilled'){
  const p=choice.proficiencies||[];if(p.length!==3||new Set(p).size!==3||p.some(x=>x.startsWith('skill:')?(!SKILLS.some(([s])=>s===x.slice(6))||prof(x.slice(6))):!x.startsWith('tool:')||!TOOLS012.includes(x.slice(5))||(ctx.tools||[]).includes(x.slice(5))))throw Error('Escolha três novas perícias ou ferramentas diferentes.');
 }
 if(rule.choice==='instruments'&&((choice.tools||[]).length!==3||new Set(choice.tools).size!==3||choice.tools.some(x=>!INSTRUMENTS012.includes(x))))throw Error('Escolha três instrumentos diferentes.');
 if(rule.choice==='element'&&(!ELEMENTS012.includes(choice.element)||others.some(g=>g.choices.element===choice.element)))throw Error('Escolha um elemento ainda não adquirido por este talento.');
 if(rule.choice==='resistances'&&((choice.resistances||[]).length!==2||new Set(choice.resistances).size!==2||choice.resistances.some(x=>!ENERGY_TYPES012.includes(x))))throw Error('Escolha dois tipos de energia diferentes.');
 if(old&&['resistances','mastery'].includes(rule.choice)&&JSON.stringify(old.choices[rule.choice==='mastery'?'mastery':'resistances'])!==JSON.stringify(choice[rule.choice==='mastery'?'mastery':'resistances'])&&integer(c.featLongRest012)<=old.masteryRest)throw Error('Essa escolha pode ser trocada após um descanso longo.');
 if(rule.choice==='mastery'&&(!WEAPONS[choice.mastery]?.mastery||!ctx.proficientWeapons?.includes(choice.mastery)))throw Error('Escolha uma arma com a qual tenha proficiência.');
 if(rule.choice==='style'&&(!FIGHTING_STYLE_FEATS.includes(choice.style)||(ctx.styles||[]).includes(choice.style)||!ctx.martialWeaponProficiency))throw Error('Escolha um estilo novo e confira a proficiência com arma marcial.');
 if(rule.choice==='metamagic'&&((choice.metamagics||[]).length!==2||new Set(choice.metamagics).size!==2||choice.metamagics.some(id=>!options.some(o=>o.id===id&&o.kind==='metamagic'&&o.selectable!==false))))throw Error('Escolha duas metamagias diferentes.');
 if(rule.choice==='invocation'){
  const selected=options.find(o=>o.id===choice.spell),check=featInvocationAllowed012(c,selected,options);if(!check.allowed)throw Error(check.reason);
  if((c.advancedChoices?.invocation||[]).includes(choice.spell)||others.some(g=>g.choices.spell===choice.spell))throw Error('Essa invocação já foi escolhida.');
 }
 const byId=id=>book.find(s=>s.id===id),list=rule.choice==='artificerSpell'?'Artífice':choice.list;
 if(['magicInitiate','artificerSpell'].includes(rule.choice)){
  if(rule.choice==='magicInitiate'&&!['Clérigo','Druida','Mago'].includes(list))throw Error('Escolha uma lista válida.');
  if(rule.choice==='magicInitiate'&&(others.some(g=>g.choices.list===list)||!existing&&featNames012(c).some(n=>same(n,'Iniciado em Magia')&&n.includes('('+list+')'))))throw Error('Iniciado em Magia exige uma lista diferente a cada aquisição.');
  const count=rule.choice==='artificerSpell'?1:2;
  if((choice.cantrips||[]).length!==count||new Set(choice.cantrips).size!==count||choice.cantrips.some(id=>byId(id)?.level!==0||!byId(id)?.classes?.includes(list)))throw Error('Escolha os truques da mesma lista.');
  if(byId(choice.spell)?.level!==1||!byId(choice.spell)?.classes?.includes(list))throw Error('Escolha uma magia de 1º círculo da mesma lista.');
  if(rule.choice==='magicInitiate'&&!mental.includes(choice.castAbility))throw Error('Escolha o atributo de conjuração.');
  if(rule.choice==='artificerSpell'&&!ARTISAN_TOOLS012.includes(choice.tool))throw Error('Escolha ferramentas de artesão.');
 }
 if(rule.choice==='rituals'&&((choice.spells||[]).length!==featPB012({...c,level:ctx.level,classes:undefined})||new Set(choice.spells).size!==choice.spells.length||choice.spells.some(id=>byId(id)?.level!==1||!byId(id)?.ritual)))throw Error('Escolha uma magia ritual de 1º círculo por ponto de proficiência.');
 if(['fey','shadow'].includes(rule.choice)){
  const schools=rule.choice==='fey'?['Adivinhação','Encantamento']:['Ilusão','Necromancia'];
  if(byId(choice.spell)?.level!==1||!schools.includes(byId(choice.spell)?.school))throw Error('Escolha uma magia de 1º círculo das escolas permitidas.');
 }
 if(rule.choice==='metallicSpell'&&!mental.includes(choice.castAbility))throw Error('Escolha o atributo de conjuração de Curar Ferimentos.');
 return true;
}
export function applyFeatChoice012(c,name,choice,settings={}){
 const old=featRecords012(c).find(g=>g.id===settings.recordId);validateFeatChoice012(c,name,choice,settings);
 const rule=featSpec012(name),boosts=choice.abilityAlreadyApplied?{}:rule.abilities?(rule.points===2?{...choice.boosts}:{[choice.ability]:1}):{};
 const clean=structuredClone(choice);if(rule.choice==='adaptiveSkill')clean.expertise=(settings.context?.skills?.[choice.skill]||0)>0?choice.skill:'';
 const record={id:old?.id||crypto.randomUUID(),name,source:old?.source||settings.source||'Adicional',level:old?.level||settings.context?.level||featLevel012(c),boosts,choices:clean,masteryRest:integer(c.featLongRest012)};
 c.featGrants012=(c.featGrants012||[]).filter(g=>g.id!==record.id);c.featGrants012.push(record);
 if(!hasFeat012(c,name))c.feats=[...new Set([...(c.feats||[]),name])];
 normalizeFeats012(c);return c.featGrants012.find(g=>g.id===record.id);
}
export function featState012(c,id){c.featState012??={};return c.featState012[id]??=( {used:0,stock:0,active:false,note:'',names:'',element:'',weaponId:''} );}
export function featResources012(c){const pb=featPB012(c),out=[];const add=(name,id,label,max,recovery)=>{if(hasFeat012(c,name))out.push({name,id,label,max,recovery,used:integer(c.featState012?.[id]?.used,0,max??999)});};
 add('Adepto Metamágico','metamagic','Pontos de Adepto Metamágico',2,'long');
 add('Dádiva do Destino','destiny','Aprimorar Destino',1,'initiative');
 add('Dádiva da Recuperação','recoveryDice','Dados d10 de Recuperar Vitalidade',10,'long');
 add('Dádiva da Recuperação','recoverySurvive','Até a Morte',1,'long');
 add('Exterminador de Conjuradores','mentalGuard','Resguardo Mental',1,'short');
 add('Presente do Dragão Cromático','chromaticInfusion','Infusão Cromática',1,'long');
 add('Presente do Dragão Cromático','chromaticReaction','Resistência Reativa',pb,'long');
 add('Presente do Dragão de Gemas','gemReprisal','Represália Telecinética',pb,'long');
 add('Presente do Dragão Metálico','metalWings','Asas Protetoras',pb,'long');
 add('Dádiva da Resistência à Energia','energyRedirect','Redirecionamento de Energia',null,'manual');
 for(const g of featRecords012(c,'Conjurador Ritualista'))out.push({name:g.name,id:g.id+':quickRitual',label:'Ritual Rápido',max:1,recovery:'long',used:integer(c.featState012?.[g.id+':quickRitual']?.used,0,1)});
 return out;
}
export function spendFeatResource012(c,id,count=1){const r=featResources012(c).find(r=>r.id===id);if(!r)throw Error('O talento não concede esse recurso.');if(!Number.isInteger(count)||count<1||r.max!==null&&r.used+count>r.max)throw Error('Sem usos suficientes desse recurso.');const state=featState012(c,id);state.used+=count;return r.max===null?null:r.max-state.used;}
export function recoverFeats012(c,{long=false,initiative=false}={}){
 for(const r of featResources012(c))if((initiative&&r.recovery==='initiative')||(!initiative&&(long&&r.recovery!=='manual'||r.recovery==='short'||r.recovery==='initiative')))featState012(c,r.id).used=0;
 if(long){c.lastSlot012=null;c.featLongRest012=integer(c.featLongRest012)+1;for(const [id,s]of Object.entries(c.featState012||{}))if(id.startsWith('spell:'))s.used=0;}
 return c;
}
export function featSpellPlans012(c,book){const out=[];const named=name=>book.find(s=>s.name===name)?.id;
 for(const g of featRecords012(c)){
  const v=g.choices,rule=featSpec012(g.name),ability=v.castAbility||v.ability||'int';
  const add=(id,key,free=false)=>{const sp=book.find(x=>x.id===id);if(!sp)return;out.push({grantId:g.id,feat:g.name,spellId:id,key,ability:rule.choice==='artificerSpell'?'int':ability,free:free&&sp.level>0,used:integer(c.featState012?.['spell:'+g.id+':'+key]?.used,0,1),ritual:!!sp.ritual,quickRitual:rule.choice==='rituals'});};
  if(['magicInitiate','artificerSpell'].includes(rule.choice)){(v.cantrips||[]).forEach((id,i)=>add(id,'cantrip'+i));add(v.spell,'first',true);}
  if(rule.choice==='rituals')(v.spells||[]).forEach((id,i)=>add(id,'ritual'+i));
  if(rule.choice==='telekinetic')add(named('Mãos Mágicas'),'cantrip');
  if(rule.choice==='telepathic')add(named('Detectar Pensamentos'),'first',true);
  if(rule.choice==='fey'){add(named('Passo Nebuloso'),'fixed',true);add(v.spell,'choice',true);}
  if(rule.choice==='shadow'){add(named('Invisibilidade'),'fixed',true);add(v.spell,'choice',true);}
  if(rule.choice==='metallicSpell')add(named('Curar Ferimentos'),'first',true);
 }return out;
}
export const featSpellSources012=(c,spell,book)=>featSpellPlans012(c,book).filter(p=>p.spellId===spell.id);
export function spendFeatSpell012(c,plan,{quick=false}={}){
 if(!featRecords012(c).some(g=>g.id===plan.grantId))throw Error('A fonte do talento não está disponível.');
 if(quick){if(!plan.quickRitual||!plan.ritual)throw Error('Ritual Rápido exige uma magia ritual preparada por esse talento.');spendFeatResource012(c,plan.grantId+':quickRitual');return;}
 const current=featState012(c,'spell:'+plan.grantId+':'+plan.key);if(!plan.free||current.used>=1)throw Error('A conjuração gratuita já foi usada.');current.used++;
}
export function recordSlot012(c,{kind='standard',index,spellName='',before}={}){c.lastSlot012=hasFeat012(c,'Dádiva da Recordação de Magia')&&['standard','pact'].includes(kind)&&Number.isInteger(index)&&index>=0&&index<4?{kind,index,before,after:before+1,spellName,checked:false}:null;}
export function recallSlot012(c,random){const e=c.lastSlot012;if(!hasFeat012(c,'Dádiva da Recordação de Magia')||!e||e.checked||e.index<0||e.index>3)throw Error('Nenhum espaço elegível aguardando o d4.');const value=random(4);if(!Number.isInteger(value)||value<1||value>4)throw Error('Rolagem de d4 inválida.');e.checked=true;const restored=value===e.index+1&&(e.kind==='pact'?(c.pactUsed||0):(c.slotsUsed?.[e.index]||0))===e.after;if(restored){if(e.kind==='pact')c.pactUsed=e.before;else c.slotsUsed[e.index]=e.before;}return {value,level:e.index+1,restored,spellName:e.spellName};}
export function modifyFeatDamage012(c,result,{type='',spell=false,unarmed=false,random}={}){
 const elemental=spell&&featRecords012(c,'Adepto Elemental').some(g=>g.choices.element===type),tavern=unarmed&&hasFeat012(c,'Valentão de Taverna')&&c.featCombat012?.tavernReroll!==false;
 const adjustments=[];
 for(const part of result.detail||[])if(part.type==='dice')part.values=part.values.map(value=>{let to=value;
  if(tavern&&value===1){if(typeof random!=='function')throw Error('Gerador de dados indisponível.');to=random(part.sides);adjustments.push({from:value,to,reason:'Valentão de Taverna'});}
  if(elemental&&to===1){to=2;adjustments.push({from:1,to:2,reason:'Adepto Elemental'});}
  result.total+=(to-value)*part.sign;return to;
 });result.featAdjustments=adjustments;return result;
}
export function repeatOneDamageDie012(c,part,detailIndex,valueIndex,random){if(!hasFeat012(c,'Perfurador')||part.type!=='Perfurante')throw Error('Perfurador exige dano perfurante.');const d=part.roll?.detail?.[detailIndex];if(d?.type!=='dice'||!Number.isInteger(valueIndex)||valueIndex<0||valueIndex>=d.values.length)throw Error('Dado inválido.');const old=d.values[valueIndex],value=random(d.sides);d.values[valueIndex]=value;part.roll.total+=(value-old)*d.sign;return {old,value,sides:d.sides};}
export function savageDamage012(c,part,roller){if(!hasFeat012(c,'Atacante Selvagem')||!part.mainWeapon)throw Error('Atacante Selvagem exige os dados de dano de uma arma.');const before=part.roll,totalDice=r=>r.detail.filter(d=>d.type==='dice').reduce((s,d)=>s+d.sign*d.values.reduce((a,b)=>a+b,0),0);const candidate=roller(part.formula);const best=totalDice(candidate)>totalDice(before)?candidate:before;part.roll=best;return {before:before.total,second:candidate.total,chosen:best.total};}
export function featResistanceNotes012(c){const out=[];for(const g of featRecords012(c,'Dádiva da Resistência à Energia'))out.push(...(g.choices.resistances||[]));if(hasFeat012(c,'Dádiva do Espírito da Noite')&&c.featCombat012?.night)out.push('Todos os danos, exceto Psíquico e Radiante (penumbra/escuridão)');return [...new Set(out)];}
export function craftPoison012(c){if(!hasFeat012(c,'Envenenador'))throw Error('O personagem não possui Envenenador.');if(Number(c.coins?.po||0)<50)throw Error('Registre 50 PO para os materiais antes de fabricar.');c.coins.po-=50;const stock=featState012(c,'poisonStock');stock.stock+=featPB012(c);return stock.stock;}
export function spendPoison012(c){const s=featState012(c,'poisonStock');if(!hasFeat012(c,'Envenenador')||s.stock<1)throw Error('Fabrique uma dose antes de aplicá-la.');s.stock--;return s.stock;}
