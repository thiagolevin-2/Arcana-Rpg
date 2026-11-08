const normalize = value => String(value ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/-\s+/g, '').replace(/\s+/g, ' ').toLowerCase();

export const FIGHTING_STYLE_FEATS = Object.freeze([
  'Arquearia',
  'Combate com Armas de Arremesso',
  'Combate com Armas Grandes',
  'Combate com Duas Armas',
  'Combate Desarmado',
  'Defensivo',
  'Duelismo',
  'Interceptação',
  'Luta às Cegas',
  'Protetivo'
]);

export const FIGHTING_STYLE_FEATURE_LEVELS = Object.freeze({
  guerreiro: 1,
  paladino: 2,
  guardiao: 2
});

export function grantsFightingStyle(classId, classLevel) {
  return FIGHTING_STYLE_FEATURE_LEVELS[classId] === Number(classLevel);
}

export function hasFightingStyleFeature(classLevels = {}) {
  return Object.entries(FIGHTING_STYLE_FEATURE_LEVELS)
    .some(([id, level]) => Number(classLevels[id] || 0) >= level);
}

export function featCategory(feat) {
  const text = normalize(`${feat?.summary || ''} ${feat?.adaptedText || ''} ${feat?.originalText || ''} ${feat?.category || ''}`);
  if (text.includes('talento de estilo de luta')) return 'Estilo de Luta';
  if (text.includes('talento de dadiva epica') || text.includes('epic boon')) return 'Dádiva Épica';
  if (text.includes('talento geral')) return 'Geral';
  if (text.includes('talento de origem')) return 'Origem';
  return 'Outros';
}

// Exibe a exigência declarada sem confundi-la com os benefícios do talento.
// Requisitos não estruturados continuam sob conferência do jogador.
export function featPrerequisiteText(feat){
 const source=String(feat?.prerequisites||feat?.prerequisite||feat?.originalText||feat?.adaptedText||feat?.summary||'').replace(/(\p{L})-\s+(\p{L})/gu,'$1$2').replace(/\s+/g,' ').trim();
 if(feat?.prerequisites||feat?.prerequisite)return source.slice(0,500);
 return source.match(/Pré-requisitos?\s*:\s*([^)]*)/i)?.[1]?.trim().slice(0,500)||'';
}

export function featEligibility(feat, context = {}) {
  const text = normalize(`${feat?.summary || ''} ${feat?.adaptedText || ''} ${feat?.originalText || ''}`);
  const category = featCategory(feat);
  const level = Math.max(1, Number(context.level) || 1);
  const abilities = context.abilities || {};
  const reasons = [];

  if (category === 'Geral' && level < 4) reasons.push('Talentos gerais exigem nível 4 ou superior.');
  if (category === 'Dádiva Épica' && level < 19) reasons.push('Dádivas épicas exigem nível 19 ou superior.');
  if (category === 'Estilo de Luta' && !context.fightingStyleFeature) reasons.push('Exige a característica Estilo de Luta de uma classe.');

  const minLevels = [...text.matchAll(/nivel\s+(\d+)\s+ou\s+superior/g)].map(m => Number(m[1]));
  const minLevel = minLevels.length ? Math.max(...minLevels) : 0;
  if (minLevel && level < minLevel && !reasons.some(r => r.includes('nível'))) {
    reasons.push(`Exige nível ${minLevel} ou superior.`);
  }

  const abilityIds = {
    forca: 'str', destreza: 'dex', constituicao: 'con',
    inteligencia: 'int', sabedoria: 'wis', carisma: 'cha'
  };
  const abilityPattern = /((?:forca|destreza|constituicao|inteligencia|sabedoria|carisma)(?:(?:\s*,\s*|\s+ou\s+)(?:forca|destreza|constituicao|inteligencia|sabedoria|carisma))*)\s+(\d+)\s+ou\s+superior/g;
  for (const match of text.matchAll(abilityPattern)) {
    const required = Number(match[2]);
    const eligibleAbilities = match[1].match(/forca|destreza|constituicao|inteligencia|sabedoria|carisma/g) || [];
    if (eligibleAbilities.length && !eligibleAbilities.some(name => Number(abilities[abilityIds[name]] || 0) >= required)) {
      const labels = [...new Set(eligibleAbilities)].map(name => ({forca:'Força',destreza:'Destreza',constituicao:'Constituição',inteligencia:'Inteligência',sabedoria:'Sabedoria',carisma:'Carisma'}[name])).join(' ou ');
      reasons.push(`Exige ${labels} ${required} ou superior.`);
    }
  }

  if ((text.includes('conjuracao ou magia de pacto') || text.includes('caracteristica de conjuracao')) && !context.spellcasting) {
    reasons.push('Exige característica de Conjuração ou Magia de Pacto.');
  }
  // Somente pré-requisitos declarados explicitamente podem bloquear o talento; a descrição inclui benefícios.
  const prerequisite = normalize(featPrerequisiteText(feat));
  if (prerequisite.includes('treinamento com armadura leve') && Number(context.armorTraining || 0) < 1) reasons.push('Exige treinamento com armadura leve.');
  if (prerequisite.includes('treinamento com armadura media') && Number(context.armorTraining || 0) < 2) reasons.push('Exige treinamento com armadura média.');
  if (prerequisite.includes('treinamento com armadura pesada') && Number(context.armorTraining || 0) < 3) reasons.push('Exige treinamento com armadura pesada.');
  if (prerequisite.includes('treinamento com escudo') && !context.shieldTraining) reasons.push('Exige treinamento com escudo.');
  const requiredArmor={
    'especialista em armaduras medias':1,
    'especialista em armaduras pesadas':2,
    'mestre em armaduras medias':2,
    'mestre em armaduras pesadas':3
  }[normalize(feat?.name)];
  if(requiredArmor&&Number(context.armorTraining||0)<requiredArmor&&!reasons.some(r=>r.includes('armadura')))reasons.push('Exige treinamento com armadura '+['','leve','média','pesada'][requiredArmor]+'.');
  if(normalize(feat?.name)==='mestre em escudos'&&!context.shieldTraining&&!reasons.some(r=>r.includes('escudo')))reasons.push('Exige treinamento com escudos.');

  const repeatable = text.includes('repetivel') || ['adepto elemental','habilidoso','iniciado em magia','aumento no valor de atributo'].includes(normalize(feat?.name));
  const owned = (context.ownedFeats || []).map(normalize);
  if (!repeatable && owned.includes(normalize(feat?.name))) reasons.push('Você já possui este talento.');

  return { eligible: reasons.length === 0, category, reason: reasons[0] || '', reasons, repeatable };
}
