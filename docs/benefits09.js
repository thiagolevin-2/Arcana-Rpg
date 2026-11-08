import {featNames012,featSpec012,featRecords012,featOriginIssues012} from './feat-rules012.js';
import {CLASSES,SPECIES,BACKGROUNDS} from './data.js';
import {speciesChoiceNeeds,speciesFeats,speciesSkills} from './species096.js';
import {classEntries,cantripLimitFor} from './progression.js';
import {arcanumCircles,choiceLimit,superiorityPool,speciesRule,attunementLimit,attunementUsage} from './rules091.js';
import {infusionLimits,infusionEffects,itemEffects,masteryLimit,dragonBreathInfo} from './rules092.js';

// Lista transparente: "aplicado" significa somente o efeito descrito aqui, não a regra inteira.
export function characterAudit(c, knownSpellCount=()=>0) {
 const applied=[],manual=[],pending=[];
 const add=(group,name,detail)=>group.push({name,detail});
 for(const issue of speciesChoiceNeeds(c))add(pending,'Escolha de espécie',issue);
 const feats=new Set([BACKGROUNDS[c.backgroundId]?.feat,...(c.feats||[]),...speciesFeats(c)]);
 for(const e of classEntries(c)){
  if(e.level>=3&&!e.subclass)add(pending,CLASSES[e.classId]?.name||e.classId,'Escolha a subclasse desta classe.');
  if(['guerreiro','paladino','guardiao'].includes(e.classId)&&e.level>=2&&!((c.styles||[]).length||c.style||c.fightingStyleAlternative))add(pending,'Estilo de luta','Escolha o estilo concedido por esta classe.');
  if(cantripLimitFor(c,e.classId)>0 && knownSpellCount(e.classId)===0)add(pending,'Truques de '+(CLASSES[e.classId]?.name||e.classId),'Nenhum truque registrado para esta fonte de conjuração.');
 }
 for(const kind of ['invocation','metamagic','maneuver']){const limit=choiceLimit(c,kind),count=(c.advancedChoices?.[kind]||[]).length;const label=({invocation:'Invocações Místicas',metamagic:'Metamagia',maneuver:'Manobras'})[kind];if(limit>count)add(pending,label,`${count} de ${limit} opções escolhidas. Gerencie em Habilidades.`);if(count)add(applied,label,`${count} escolha(s) registrada(s), respeitando o limite da classe; aplicação dos efeitos situacionais permanece manual.`);}
 for(const circle of arcanumCircles(c)){if(!c.mysticArcanum?.[circle])add(pending,`Arcano Místico ${circle}º`, 'Escolha uma magia de Bruxo deste círculo em Habilidades.');else add(applied,`Arcano Místico ${circle}º`, c.mysticUsed?.[circle]?'Uso gasto; recupera no descanso longo.':'Magia concedida e uso disponível; não consome espaços de magia.');}
 if(speciesRule(c).naturalAC!==null)add(applied,speciesRule(c).shellCapable?'Carapaça natural':'Armadura natural',speciesRule(c).shellCapable?'CA base 17 sem bônus de DES e Casco Defensivo alternável em Habilidades.':'CA base 13 + DES sem armadura (opção na CA).');
 if(speciesRule(c).skills.length)add(applied,'Proficiências de espécie',speciesRule(c).skills.join(', '));
 if(superiorityPool(c))add(applied,'Dados de Superioridade','Recuperação por descanso curto; escolha das manobras controlada em Habilidades.');
 const infusion=infusionLimits(c);if(infusion.known){const count=(c.knownInfusions||[]).length;if(count<infusion.known)add(pending,'Infusões do Artífice',`${count}/${infusion.known} infusões conhecidas. Escolha na seção Infusões.`);if((c.activeInfusions||[]).length)add(applied,'Infusões vinculadas',`${c.activeInfusions.length}/${infusion.active} itens, com bônus numéricos reconhecidos aplicados e efeitos situacionais manuais.`);}
 const mastery=masteryLimit(c);if(mastery){if((c.masteries||[]).length<mastery)add(pending,'Maestria de Armas',`${(c.masteries||[]).length}/${mastery} armas dominadas.`);else add(applied,'Maestria de Armas','Propriedades aprendidas identificadas; resolução de alvos manual.');}
 const equipped=itemEffects(c);if(equipped.active.length)add(applied,'Itens equipados',`${equipped.active.length} item(ns) com bônus fixos configurados. Regras condicionais continuam manuais.`);
 if(c.speciesId==='draconato'&&dragonBreathInfo(c)?.type)add(applied,'Sopro Dracônico','Dado de dano, tipo ancestral e CD calculados por nível; salvaguardas dos alvos manuais.');
 if(c.speciesId==='orc')add(applied,'Orc: Adrenalina e Resistência Implacável','PV temporários da Adrenalina e recuperação a 1 PV via botão quando cai a 0.');
 if(c.speciesId==='golias'&&c.level>=5)add(applied,'Golias: Forma Grande','Bônus de deslocamento e vantagem em testes de Força quando a forma está ativada.');
 if(['elfo','tiferino'].includes(c.speciesId)&&c.variant)add(applied,'Magias de linhagem','Concessões fixas por nível, com usos gratuitos e atributo de conjuração escolhido na edição.');
 if(attunementUsage(c)>attunementLimit(c))add(pending,'Itens sintonizados',`Limite excedido: ${attunementUsage(c)}/${attunementLimit(c)} itens.`);
  if(SPECIES[c.speciesId]?.variants?.length&&!c.variant)add(pending,'Linhagem ou variante','Escolha sua opção de ancestralidade, quando exigida.');
 if((c.progressionLog||[]).some(x=>x.pending))add(pending,'Evolução de atributos','Existe aumento de atributo ou talento pendente na progressão.');
 if(feats.has('Alerta'))add(applied,'Alerta','Bônus de proficiência incorporado à iniciativa.');
 if(feats.has('Vigoroso'))add(applied,'Vigoroso','2 PV adicionais por nível aplicados retroativamente.');
 if(feats.has('Sortudo'))add(applied,'Sortudo','Pontos de Sorte exibidos nos recursos. O uso no resultado ainda requer decisão do jogador.');
 for(const feat of ['Especialista em Armaduras Leves','Especialista em Armaduras Médias','Especialista em Armaduras Pesadas'])if(feats.has(feat))add(applied,feat,'Treinamento concedido incorporado à CA e às restrições de conjuração.');
 if(c.speciesId==='anao')add(applied,'Vigor Anão','PV máximos aumentam em 1 por nível.');
 if(c.speciesId==='pequenino')add(applied,'Sortudo do Pequenino','Repetição automática do 1 natural em rolagens d20.');
 if(c.speciesId==='gnomo')add(applied,'Astúcia Gnômica','Vantagem nas salvaguardas mentais aplicada na rolagem.');
 if(c.speciesId==='golias')add(applied,'Compleição Poderosa','Capacidade de carga multiplicada por 2.');
 if(c.speciesId==='humano')add(applied,'Inspiração Heroica','Concedida ao fim do descanso longo.');
 if(c.styles?.length||c.style)add(applied,'Estilos de Luta','Bônus numéricos aplicados conforme arma, armadura e condições; efeitos situacionais permanecem manuais.');
 if((c.customArmors||[]).length||c.armor?.startsWith('custom:'))add(applied,'Armadura personalizada','Fórmula base e bônus configurado incorporados à CA.');
 if((c.customShields||[]).length||c.shieldId)add(applied,'Escudo personalizado','Bônus do escudo equipado usado quando houver treinamento.');
 for(const e of classEntries(c)){
  if(e.classId==='paladino'&&e.level>=6)add(applied,'Aura de Proteção','Bônus numérico calculado para salvaguardas. Alcance e aliados são acompanhados manualmente.');
  if(e.classId==='monge')add(applied,'Artes Marciais','Dado, atributo, CA sem armadura e velocidade quando os requisitos são atendidos.');
  if(e.classId==='barbaro')add(applied,'Fúria','Bônus de dano/Força quando ativa; encerramentos e resistências exigem acompanhamento.');
  if(e.classId==='feiticeiro'&&e.level>=3&&e.subclass==='Feitiçaria Dracônica')add(applied,'Resiliência Dracônica','Fórmula de CA e PV extras de classe calculados.');
  if(e.level>=3&&e.subclass&&!['Feitiçaria Dracônica'].includes(e.subclass))add(manual,'Subclasse: '+e.subclass,'Algumas características estão documentadas; confira os efeitos situacionais no livro.');
 }
 if(c.speciesId&&!['humano','anao','pequenino','gnomo','golias'].includes(c.speciesId))add(manual,'Espécie: '+(SPECIES[c.speciesId]?.name||c.speciesId),'Confira poderes ativos, resistências, escolhas e usos não automatizados.');
 for(const optionId of c.selectedOptions||[])add(manual,'Opção adicional: '+optionId,'O catálogo registra a escolha, mas não garante aplicação de todos os benefícios.');
 for(const item of c.items||[])if(item.attunement || item.maxCharges)add(manual,'Item: '+item.name,'Sintonização/cargas são registradas; efeitos sobre atributos e ações precisam de conferência.');
 for(const message of featOriginIssues012(c))add(pending,'Talento de Origem duplicado',message);for(const name of featNames012(c)){const spec=featSpec012(name),records=featRecords012(c,name);if((spec.points||spec.choice)&&!records.length)add(pending,name,'Complete as escolhas no cartão do talento; aumentos antigos não são presumidos na importação.');for(const g of records)add(applied,name,'Escolhas registradas na aquisição '+g.source+'. Usos e efeitos situacionais continuam sob seu controle.');}return {applied,manual,pending};
}
