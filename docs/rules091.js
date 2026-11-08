import {subclassAllowsSpell013} from './subclass-rules013.js';
// Recursos adicionais testáveis sem dependência de DOM.
import {classLevel,subclassFor} from './progression.js';
import {motmNaturalAC} from './species-motm022.js';

export const ARCANUM_THRESHOLDS=Object.freeze({6:11,7:13,8:15,9:17});
export function arcanumCircles(c){const level=classLevel(c,'bruxo');return Object.entries(ARCANUM_THRESHOLDS).filter(([,min])=>level>=min).map(([circle])=>Number(circle));}
export function arcanumSpell(c,spell,circle){return arcanumCircles(c).includes(Number(circle))&&Number(spell?.level)===Number(circle)&&Array.isArray(spell.classes)&&(spell.classes.includes('Bruxo')||subclassAllowsSpell013(c,spell,'bruxo'));}
export function setArcanum(c,circle,spell,catalog){if(!arcanumSpell(c,spell,circle))throw Error('Arcano Místico exige Bruxo com nível suficiente e magia de Bruxo do círculo correspondente.');if(!catalog.some(s=>s.id===spell.id))throw Error('Magia ausente no catálogo.');c.mysticArcanum??={};c.mysticUsed??={};const alreadyUsed=!!c.mysticUsed[circle];c.mysticArcanum[circle]=spell.id;c.mysticUsed[circle]=alreadyUsed;return c;}
export function arcanumAvailability(c,spell){const circle=Number(spell?.level);return arcanumSpell(c,spell,circle)&&c.mysticArcanum?.[circle]===spell.id?{circle,ready:!c.mysticUsed?.[circle]}:null;}
export function spendArcanum(c,spell){const available=arcanumAvailability(c,spell);if(!available||!available.ready)throw Error('Este Arcano Místico não está disponível.');c.mysticUsed??={};c.mysticUsed[available.circle]=true;return available.circle;}
export const CHOICE_KINDS=Object.freeze(['invocation','metamagic','maneuver']);
export function choiceLimit(c,kind){const w=classLevel(c,'bruxo'),s=classLevel(c,'feiticeiro'),f=classLevel(c,'guerreiro');switch(kind){
 case 'invocation':return w>=18?10:w>=15?9:w>=12?8:w>=9?7:w>=7?6:w>=5?5:w>=2?3:w>=1?1:0;
 case 'metamagic':return s>=17?6:s>=10?4:s>=2?2:0;
 case 'maneuver':return subclassFor(c,'guerreiro')==='Mestre da Batalha'?(f>=15?9:f>=10?7:f>=7?5:f>=3?3:0):0;
 default:return 0;
}}
export function choiceNames(c,kind,catalog){const chosen=new Set(c.advancedChoices?.[kind]||[]);return catalog.filter(e=>e.kind===kind&&chosen.has(e.id));}
export function invocationRequirement(c,option,catalog=[]){if(!option||option.kind!=='invocation')return {allowed:true,reason:''};const text=String(option.summary||'').slice(0,200),level=Number(text.match(/Bruxo Nível\s+(\d+)/i)?.[1]||0);if(level&&classLevel(c,'bruxo')<level)return {allowed:false,reason:'Esta invocação exige Bruxo de nível '+level+'.'};const requires=['Pacto da Corrente','Pacto da Lâmina','Pacto do Tomo','Lâmina Sedenta'].find(name=>option.name!==name&&text.slice(0,115).includes(name));if(requires){const id=catalog.find(o=>o.kind==='invocation'&&o.name===requires)?.id;if(id&&!((c.advancedChoices?.invocation||[]).includes(id)))return {allowed:false,reason:'Escolha primeiro '+requires+'.'};}return {allowed:true,reason:''};}
export function toggleChoice(c,kind,option,catalog){if(!CHOICE_KINDS.includes(kind)||!catalog.includes(option)||option.kind!==kind||option.selectable===false)throw Error('Opção inválida.');const existing=[...(c.advancedChoices?.[kind]||[])];if(existing.includes(option.id)){c.advancedChoices[kind]=existing.filter(id=>id!==option.id);return false;}if(kind==='invocation'){const req=invocationRequirement(c,option,catalog);if(!req.allowed)throw Error(req.reason);}if(existing.length>=choiceLimit(c,kind))throw Error('O limite de escolhas deste nível já foi atingido.');c.advancedChoices??={};c.advancedChoices[kind]=[...existing,option.id];return true;}
export function canUseStyleCantrip(c,sourceId,spell){if(Number(spell?.level)!==0||!Array.isArray(spell?.classes))return false;
 return sourceId==='paladino'&&classLevel(c,'paladino')>=2&&c.fightingStyleAlternative==='Guerreiro Abençoado'&&spell.classes.includes('Clérigo')||sourceId==='guardiao'&&classLevel(c,'guardiao')>=2&&c.fightingStyleAlternative==='Guerreiro Druídico'&&spell.classes.includes('Druida');}
export function speciesRule(c,dexMod=0){const id=String(c.speciesId||'');const tortle=id.endsWith('-tortle'),tabaxi=id.endsWith('-tabaxi'),centaur=id.endsWith('-centauro');const nat=motmNaturalAC(c,Number(dexMod)||0);return {naturalAC:nat?nat.value:null,naturalLabel:nat?.label||'',shellCapable:!!nat?.shell,shell:!!nat?.shell&&!!c.shellDefense,capacityFactor:centaur?2:1,skills:[],tag:tortle?'Carapaça natural':nat?nat.label:tabaxi?'Agilidade felina':centaur?'Porte equino':null};}
export function speciesMovements(c,species){const move=species?.movement||{};return Object.fromEntries(Object.entries(move).filter(([k,v])=>k!=='walk'&&Number.isFinite(Number(v))&&Number(v)>0).map(([k,v])=>[k,Number(v)]));}
export function superiorityPool(c){const n=classLevel(c,'guerreiro');return subclassFor(c,'guerreiro')==='Mestre da Batalha'&&n>=3?{max:n>=15?6:n>=7?5:4,sides:n>=18?12:n>=10?10:8}:null;}
export function metamagicCost(option,spell){if(!option||option.kind!=='metamagic')throw Error('Metamagia inválida.');const m=String(option.summary||'').match(/Custo:\s*(\d+)\s+Pontos? de Feitiçaria/i);if(m)return Number(m[1]);return null;}
export function normalizeAdvanced(c,catalog=[]){c.mysticArcanum=Object.fromEntries(Object.entries(c.mysticArcanum&&typeof c.mysticArcanum==='object'?c.mysticArcanum:{}).filter(([k,id])=>arcanumCircles(c).includes(Number(k))&&typeof id==='string'&&id.length<130));c.mysticUsed=Object.fromEntries(Object.keys(c.mysticArcanum).map(k=>[k,!!c.mysticUsed?.[k]]));c.advancedChoices=Object.fromEntries(CHOICE_KINDS.map(k=>[k,[...new Set(Array.isArray(c.advancedChoices?.[k])?c.advancedChoices[k].filter(id=>typeof id==='string'&&id.length<130):[])].slice(0,choiceLimit(c,k))]));c.shellDefense=!!c.shellDefense&&speciesRule(c).naturalAC!==null;return c;}
// Limites de sintonização (Artífice de Tasha) e validação antes de alterar o inventário.
export function attunementLimit(c){const n=classLevel(c,'artifice');return n>=18?6:n>=14?5:n>=10?4:3;}
export function attunementUsage(c){return (c.items||[]).filter(item=>!!item.attunement&&!!item.attuned&&Number(item.qty)>0).length;}
export function validateAttunement(c,items){const max=attunementLimit(c),count=(items||[]).filter(item=>item.attuned&&item.attunement&&Number(item.qty)>0).length;if(count>max)throw Error(`O personagem só pode se sintonizar com ${max} itens ao mesmo tempo (atualmente ${count}).`);if(items.some(item=>item.attuned&&!item.attunement))throw Error('Um item sintonizado precisa marcar que requer sintonização.');return true;}
export function normalizeArchive(payload,normalize){
 if(!payload||typeof payload!=='object'||!Array.isArray(payload.characters)||payload.characters.length>100)throw Error('Backup inválido ou com mais de 100 fichas.');
 const entries=[];const problems=[];
 payload.characters.forEach((raw,index)=>{try{entries.push(normalize(raw));}catch(error){problems.push({index:index+1,message:String(error.message||'Ficha inválida').slice(0,150)});}});
 if(problems.length)throw Error(`Backup contém ${problems.length} ficha(s) inválida(s); nenhuma foi importada. Revise o arquivo antes de continuar.`);
 if(!entries.length)throw Error('O backup não contém fichas.');
 return entries;
}
