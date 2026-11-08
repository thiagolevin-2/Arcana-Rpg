import {SUPPLEMENT_OPTIONS,SOURCE_META,EXPANSION_SUMMARY} from './expansion-data.js';
export {SUPPLEMENT_OPTIONS,SOURCE_META,EXPANSION_SUMMARY};
export const optionById=id=>SUPPLEMENT_OPTIONS.find(e=>e.id===id);
export const sourceName=id=>id==='phb2024'?'Livro do Jogador 2024':SOURCE_META.find(s=>s.id===id)?.title||id;
export const supplementalSubclass=(classId,name)=>SUPPLEMENT_OPTIONS.find(e=>e.kind==='subclass'&&e.classId===classId&&e.name===name&&e.selectable!==false);
export function applySupplements(classes,species,arrays){
 for(const e of SUPPLEMENT_OPTIONS){if(e.selectable===false)continue;
  if(e.kind==='class'&&e.classId==='artifice'&&!classes.artifice){classes.artifice={name:e.name,tag:'Crie o extraordinário',icon:'settings',hd:e.hd||8,saves:e.saves||['con','int'],primary:e.primary||['int'],casting:'int',caster:'half',armor:'Média',weapons:'Simples',skills:e.skills||['Arcanismo','História','Investigação','Medicina','Natureza','Percepção','Prestidigitação'],skillCount:e.skillCount||2,art:'mago',subclasses:[],page:e.page,source:e.source,catalogId:e.id,description:e.summary,features:(e.features||[]).map(f=>[f.level,f.name,f.text]),legacyPrepared:true,infusedItems:e.infusedItems||[]};arrays.artifice=[8,14,13,15,12,10]}
 }
 for(const e of SUPPLEMENT_OPTIONS){if(e.selectable===false)continue;
  if(e.kind==='subclass'&&classes[e.classId]&&!classes[e.classId].subclasses.includes(e.name))classes[e.classId].subclasses.push(e.name);
  if(e.kind==='species'&&!species[e.id]){species[e.id]={name:e.name,speed:Number(e.speed)||9,variants:e.variants||[],page:e.page,traits:(e.traits?.length?e.traits:[e.summary]).filter(t=>!/^Idiomas\s*:/i.test(t)),size:e.size||'Consulte a fonte',source:e.source,catalogId:e.id,playtest:!!e.playtest,movement:e.movement||{},adaptations:e.adaptations||[]}}
 }
}
