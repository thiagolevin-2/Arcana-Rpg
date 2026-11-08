// Um plano confirmado acompanha o ataque até a rolagem de dano.
// Não interpreta duração, alvos nem consequências de uma magia.
import {validMacroFormula,MACRO_DAMAGE_TYPES} from './macros094-data.js';

export function resolveSpellRoll(automatic,configuration={}){
 const mode=configuration.mode||'auto';
 if(mode==='auto')return automatic?{...automatic}:null;
 if(mode==='none'||mode==='test')return null;
 if(!['attack','save','healing'].includes(mode)||!validMacroFormula(configuration.formula))throw Error('Informe um valor fixo ou uma fórmula de dados válida para a magia.');
 const formula=String(configuration.formula).replace(/\s/g,'').toLowerCase();
 const type=mode==='healing'?'Cura':MACRO_DAMAGE_TYPES.includes(configuration.type)?configuration.type:automatic?.type&&automatic.type!=='Cura'?automatic.type:'Energético';
 return {formula,type,...(mode==='attack'?{attack:true}:mode==='healing'?{healing:true}:{save:automatic?.save||'Conforme a magia',half:!!automatic?.half}),custom:true};
}

export function spellDamagePlan(context){
 const plan=context.spellRollPlan||context.weapon;
 if(!plan||!validMacroFormula(plan.formula))throw Error('Esta conjuração não possui uma fórmula de dano confirmada. Configure a rolagem na aba Magias.');
 return {label:context.spell?.name||context.label||'Magia',formula:String(plan.formula),type:plan.type||'Energético'};
}
