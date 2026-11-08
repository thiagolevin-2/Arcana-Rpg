import {featScore012} from './feat-rules012.js';
// Mestre da Batalha, PHB 2024 fornecido, pp. 133–135.
// Recursos e dados são calculados; gatilhos, alvos e o limite por turno são manuais.
import {CLASSES} from './data.js';
import {classLevel,subclassFor,totalLevel} from './progression.js';
import {superiorityPool,choiceLimit} from './rules091.js';
import {SUPPLEMENT_OPTIONS} from './compatibility.js';

export const ARTISAN_TOOLS=Object.freeze(['Suprimentos de Alquimista','Suprimentos de Calígrafo','Ferramentas de Carpinteiro','Ferramentas de Cartógrafo','Suprimentos de Cervejeiro','Ferramentas de Coureiro','Ferramentas de Entalhador','Ferramentas de Ferreiro','Ferramentas de Funileiro','Ferramentas de Joalheiro','Ferramentas de Oleiro','Ferramentas de Pedreiro','Suprimentos de Pintor','Ferramentas de Sapateiro','Ferramentas de Tecelão','Ferramentas de Vidreiro','Utensílios de Cozinheiro']);
export const BATTLE_MASTER_FEATURES=Object.freeze([
 {level:3,name:'Estudioso da Guerra',description:'Escolha uma perícia da lista inicial de Guerreiro e um tipo de Ferramentas de Artesão. A perícia escolhida entra nos cálculos; a ferramenta fica registrada com proficiência.'},
 {level:3,name:'Superioridade em Combate',description:'Aprenda três manobras e receba quatro Dados de Superioridade d8. Use apenas uma manobra por ataque. Todos os dados se recuperam no descanso curto ou longo. A CD usa Força ou Destreza, à sua escolha.'},
 {level:7,name:'Conheça Seu Inimigo',description:'Como Ação Bônus, examine uma criatura visível a até 9 m: o Mestre informa suas imunidades, resistências e vulnerabilidades. Um uso por descanso longo. É possível recuperar um uso gastando um Dado de Superioridade, sem ação.'},
 {level:10,name:'Superioridade em Combate Aprimorada',description:'Seus Dados de Superioridade passam a ser d10.'},
 {level:15,name:'Implacável',description:'Uma vez por turno, ao usar uma manobra, você pode rolar 1d8 em vez de gastar um Dado de Superioridade. O jogador confirma quando esse uso por turno está disponível.'},
 {level:18,name:'Superioridade em Combate Suprema',description:'Seus Dados de Superioridade passam a ser d12.'}
]);
export const isBattleMaster=c=>classLevel(c,'guerreiro')>=3&&subclassFor(c,'guerreiro')==='Mestre da Batalha';
export function normalizeBattleMaster(c){
 if(c.classId==='guerreiro'&&c.subclass==='Mestre de Batalha')c.subclass='Mestre da Batalha';
 if(Array.isArray(c.classes))for(const entry of c.classes)if(entry.classId==='guerreiro'&&entry.subclass==='Mestre de Batalha')entry.subclass='Mestre da Batalha';
 for(const field of ['featureChoices','featureSettings','abilityActions'])if(c[field]&&typeof c[field]==='object'&&!Array.isArray(c[field]))for(const key of Object.keys(c[field]))if(key.startsWith('guerreiro::Mestre de Batalha::')){const canonical=key.replace('guerreiro::Mestre de Batalha::','guerreiro::Mestre da Batalha::');if(!Object.hasOwn(c[field],canonical))c[field][canonical]=c[field][key];delete c[field][key];}
 if(!c.battleMaster&&!isBattleMaster(c))return c;
 const raw=c.battleMaster&&typeof c.battleMaster==='object'?c.battleMaster:{};
 c.battleMaster={skill:CLASSES.guerreiro.skills.includes(raw.skill)?raw.skill:'',tool:ARTISAN_TOOLS.includes(raw.tool)?raw.tool:'',ability:raw.ability==='dex'?'dex':'str'};
 return c;
}
export function battleMasterSkill(c){return isBattleMaster(c)&&CLASSES.guerreiro.skills.includes(c.battleMaster?.skill)?c.battleMaster.skill:null;}
export function battleMasterInfo(c){
 if(!isBattleMaster(c))return null;
 const level=classLevel(c,'guerreiro'),pool=superiorityPool(c),ability=c.battleMaster?.ability==='dex'?'dex':'str';
 const value=featScore012(c,ability),modifier=Math.floor((value-10)/2),pb=2+Math.floor((totalLevel(c)-1)/4);
 const knownIds=new Set(c.advancedChoices?.maneuver||[]),maneuvers=SUPPLEMENT_OPTIONS.filter(o=>o.kind==='maneuver'&&o.source==='phb2024'&&o.selectable!==false&&knownIds.has(o.id)).slice(0,choiceLimit(c,'maneuver'));
 return {level,pool,remaining:Math.max(0,pool.max-(c.resourceUsed?.superiority||0)),ability,modifier,dc:8+modifier+pb,maneuvers,limit:choiceLimit(c,'maneuver'),features:BATTLE_MASTER_FEATURES.filter(f=>f.level<=level),relentless:level>=15,enemyReady:level>=7&&!(c.resourceUsed?.knowyourenemy||0)};
}
export function configureBattleMaster(c,{skill='',tool='',ability='str'}={}){
 if(!isBattleMaster(c))throw Error('Estudioso da Guerra exige Guerreiro Mestre da Batalha de nível 3.');
 if(skill&&!CLASSES.guerreiro.skills.includes(skill)||tool&&!ARTISAN_TOOLS.includes(tool)||!['str','dex'].includes(ability))throw Error('Escolha uma perícia, ferramenta e atributo válidos.');
 c.battleMaster={skill,tool,ability};return c;
}
export function useManeuver(c,id,{relentless=false,roll}={}){
 const info=battleMasterInfo(c),option=info?.maneuvers.find(m=>m.id===id);
 if(!option)throw Error('Escolha uma manobra de 2024 que este personagem conhece.');
 if(relentless&&!info.relentless)throw Error('Implacável exige Guerreiro de nível 15.');
 if(!relentless&&info.remaining<1)throw Error('Sem Dados de Superioridade disponíveis.');
 const sides=relentless?8:info.pool.sides,extra=option.name==='Aparar'?info.modifier:option.name==='Recuperar Energia'?Math.floor(info.level/2):0;
 const formula='1d'+sides+(extra>0?'+'+extra:extra<0?String(extra):'');
 if(typeof roll!=='function')throw Error('Rolagem indisponível.');
 const result=roll(formula); // Nenhum custo é debitado se a rolagem não puder ser realizada.
 if(!relentless){c.resourceUsed??={};c.resourceUsed.superiority=(c.resourceUsed.superiority||0)+1;}
 return {name:option.name,formula,result,spent:relentless?0:1,relentless,dc:info.dc,kind:option.name==='Aparar'?'Redução de dano':option.name==='Recuperar Energia'?'PV temporários para o aliado':'Resultado da manobra'};
}
export function useKnowYourEnemy(c){const info=battleMasterInfo(c);if(!info||info.level<7)throw Error('Conheça Seu Inimigo exige Guerreiro de nível 7.');if(!info.enemyReady)throw Error('Conheça Seu Inimigo já foi usado; recupere o uso ou complete um descanso longo.');c.resourceUsed??={};c.resourceUsed.knowyourenemy=1;return c;}
export function restoreKnowYourEnemy(c){const info=battleMasterInfo(c);if(!info||info.level<7)throw Error('Conheça Seu Inimigo exige Guerreiro de nível 7.');if(info.enemyReady)throw Error('Conheça Seu Inimigo já está disponível.');if(info.remaining<1)throw Error('Sem Dados de Superioridade para recuperar o uso.');c.resourceUsed.superiority=(c.resourceUsed.superiority||0)+1;c.resourceUsed.knowyourenemy=0;return c;}
