// Raças de "Mordenkainen Apresenta Monstros do Multiverso" (2022), versão em português.
// Substituem as versões antigas (2014–2016) mantendo os mesmos IDs, para não quebrar fichas salvas.
// Regras de 2024 continuam com prioridade: aumentos de atributo vêm do antecedente; idiomas da criação 2024.

export const MOTM_SOURCE='Mordenkainen Apresenta Monstros do Multiverso (2022)';
const SKILLS_ALL=['Acrobacia','Arcanismo','Atletismo','Atuação','Enganação','Furtividade','História','Intimidação','Intuição','Investigação','Lidar com Animais','Medicina','Natureza','Percepção','Persuasão','Prestidigitação','Religião','Sobrevivência'].map(s=>s.replace('­',''));
const CAST='Inteligência, Sabedoria ou Carisma é o atributo de conjuração dessas magias (escolha ao editar a ficha).';
const SPELL_RULE='Cada magia concedida por este traço pode ser conjurada assim uma vez por descanso longo; também pode ser conjurada com espaços de magia do círculo apropriado.';
const DV18='Visão no Escuro: enxerga até 18 m na meia-luz como se fosse luz plena e, na escuridão, como meia-luz (apenas tons de cinza).';
const DV36='Visão no Escuro: enxerga até 36 m na meia-luz como se fosse luz plena e, na escuridão, como meia-luz (apenas tons de cinza).';
const FEY='Ancestralidade Feérica: vantagem em salvaguardas para evitar ou encerrar a condição Enfeitiçado.';
const TRANCE='Transe: não precisa dormir e magia não pode fazê-lo dormir. Conclui um descanso longo em 4 horas de meditação consciente (regra do Elfo 2024).';
const KEEN={key:'skill',label:'Sentidos Aguçados · perícia',options:['Intuição','Percepção','Sobrevivência'],count:1,skill:true};
const KEEN_TXT='Sentidos Aguçados: proficiência em Intuição, Percepção ou Sobrevivência, à escolha (regra do Elfo 2024).';
const POWERFUL='Porte Poderoso: conta como uma categoria de tamanho acima para capacidade de carga e para empurrar, arrastar ou levantar.';
const nat=(name,type,text)=>({name,text:`${name}: ${text} Golpe desarmado que causa 1d6 + modificador de Força de dano ${type}, em vez do dano normal.`,natural:type});

export const MOTM_SPECIES={
 'supp-races-small-species-aarakocra':{name:'Aarakocra',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{name:'Voo',text:'Voo: deslocamento de voo igual ao de caminhada. Não pode usá-lo vestindo armadura média ou pesada.'},
   nat('Garras','cortante','Garras afiadas.'),
   {name:'Manipulador de Vento',text:`Manipulador de Vento: a partir do 3º nível, conjura Lufada de Vento sem componente material. ${SPELL_RULE} ${CAST}`}],
  spells:[[3,'Lufada de Vento']]},
 'supp-races-large-species-bugbear':{name:'Bugurso',aliases:['Bugbear'],size:'Médio',speed:9,movement:{walk:9},type:'Humanoide (goblinoide)',skills:['Furtividade'],
  traits:[{text:DV18},{text:FEY},
   {name:'Ataque Surpresa',text:'Ataque Surpresa: ao acertar uma criatura com uma jogada de ataque, ela sofre 2d6 de dano extra se ainda não tiver jogado um turno no combate atual (não depende da regra de Surpresa de 2024, que só dá desvantagem na iniciativa).',power:{kind:'damage',formula:'2d6',max:0}},
   {text:'Membros Longos: ao fazer um ataque corpo a corpo no seu turno, seu alcance é 1,5 m maior.'},
   {text:POWERFUL},
   {text:'Sorrateiro: proficiência em Furtividade (aplicada na ficha). Pode se mover e parar em um espaço grande o bastante para uma criatura Pequena, sem se espremer.'}]},
 'supp-races-large-species-centauro':{name:'Centauro',size:'Médio',speed:12,movement:{walk:12},type:'Feérico',
  choices:[{key:'skill',label:'Afinidade com a Natureza · perícia',options:['Lidar com Animais','Medicina','Natureza','Sobrevivência'],count:1,skill:true}],
  traits:[{text:'Afinidade com a Natureza: proficiência em uma perícia à escolha entre Lidar com Animais, Medicina, Natureza ou Sobrevivência.'},
   {text:'Carga: se mover pelo menos 9 m em linha reta na direção de um alvo e acertá-lo com um ataque corpo a corpo com arma no mesmo turno, pode fazer outro ataque com os cascos como Ação Bônus.'},
   nat('Cascos','contundente','Cascos de cavalo.'),
   {text:'Porte Equino: conta como uma categoria de tamanho acima para capacidade de carga e para empurrar, arrastar ou levantar. Escaladas que exigem mãos e pés custam 1,2 m extras por 0,3 m.'}]},
 'supp-races-small-species-duergar':{name:'Duergar',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide (anão)',
  traits:[{text:DV36},
   {text:'Fortitude Psiônica: vantagem em salvaguardas para evitar ou encerrar as condições Enfeitiçado ou Atordoado.'},
   {text:`Magia dos Duergar: a partir do 3º nível conjura Aumentar/Reduzir e, a partir do 5º, Invisibilidade, sem componentes materiais. ${SPELL_RULE} ${CAST}`},
   {text:'Resistência a Toxinas: vantagem em salvaguardas para evitar ou encerrar a condição Envenenado e resistência a dano venenoso.'}],
  spells:[[3,'Aumentar/Reduzir'],[5,'Invisibilidade']]},
 'supp-races-large-species-metamorfo-changeling':{name:'Duplicante',aliases:['Metamorfo (Changeling)','Changeling'],size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Feérico',
  choices:[{key:'skill',label:'Instinto Duplicante · perícia',options:['Atuação','Enganação','Intimidação','Intuição','Persuasão'],count:2,skill:true}],
  traits:[{text:'Instinto Duplicante: proficiência em duas perícias à escolha entre Atuação, Enganação, Intimidação, Intuição ou Persuasão.'},
   {text:'Metamorfo: como Ação, altera aparência e voz (coloração, cabelo, sexo, altura, peso; pode alternar entre Médio e Pequeno). Pode se passar por outra raça, sem mudar estatísticas. Não copia quem nunca viu, mantém a mesma disposição de membros e não altera roupas. Dura até usar uma Ação para voltar ou morrer.'}]},
 'supp-races-large-species-eladrin':{name:'Eladrin',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide (elfo)',choices:[KEEN],
  traits:[{text:DV18},{text:FEY},
   {name:'Passo Feérico',text:'Passo Feérico: como Ação Bônus, teleporta-se até 9 m para um espaço desocupado que possa ver.',power:{kind:'use',max:'pb'}},
   {name:'Estação',season:true},
   {text:KEEN_TXT},
   {text:TRANCE+' Ao terminar um descanso longo, também pode mudar de estação.'}]},
 'supp-races-large-species-elfo-do-mar':{name:'Elfo Marinho',aliases:['Elfo do Mar'],size:'Médio',speed:9,movement:{walk:9,swim:9},type:'Humanoide (elfo)',choices:[KEEN],
  traits:[{text:DV18},{text:FEY},
   {text:'Amigo do Mar: comunica ideias simples a qualquer fera com deslocamento de natação; elas entendem suas palavras, mas você não as entende.'},
   {text:'Criança do Mar: respira ar e água, deslocamento de natação igual ao de caminhada e resistência a dano gélido.'},
   {text:KEEN_TXT},{text:TRANCE}]},
 'supp-races-large-species-firbolg':{name:'Firbolg',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:'Fala da Fera e da Folha: comunica-se de forma limitada com feras e plantas (elas entendem você, mas você não as entende) e tem vantagem em testes de Carisma para influenciá-las.'},
   {text:`Magia dos Firbolg: conjura Detectar Magia e Disfarçar-se (nesta versão pode parecer até 1 m mais alto ou mais baixo). ${SPELL_RULE} ${CAST}`},
   {name:'Passo Oculto',text:'Passo Oculto: como Ação Bônus, fica invisível até o início do próximo turno ou até atacar, causar dano ou forçar uma salvaguarda.',power:{kind:'use',max:'pb'}},
   {text:POWERFUL}],
  spells:[[1,'Detectar Magia'],[1,'Disfarçar-se']]},
 'supp-races-small-species-genasi-da-agua':{name:'Genasi da Água',size:'Médio ou Pequeno',speed:9,movement:{walk:9,swim:9},type:'Humanoide',
  traits:[{text:DV18},{text:'Anfíbio: respira ar e água. Deslocamento de natação igual ao de caminhada.'},
   {text:`Chamado da Onda: conhece o truque Bolha Ácida. A partir do 3º nível conjura Criar ou Destruir Água e, a partir do 5º, Caminhar Sobre as Águas (sem componente material). ${SPELL_RULE} ${CAST}`},
   {text:'Resistência a Ácido: resistência a dano ácido.'}],
  spells:[[1,'Bolha Ácida'],[3,'Criar ou Destruir Água'],[5,'Caminhar Sobre as Águas']]},
 'supp-races-small-species-genasi-do-ar':{name:'Genasi do Ar',size:'Médio ou Pequeno',speed:10.5,movement:{walk:10.5},type:'Humanoide',
  traits:[{text:DV18},{text:'Fôlego Infinito: pode prender a respiração indefinidamente enquanto não estiver incapacitado.'},
   {text:'Resistência a Eletricidade: resistência a dano elétrico.'},
   {text:`Misturar-se ao Vento: conhece o truque Toque Chocante. A partir do 3º nível conjura Queda Suave e, a partir do 5º, Levitação (sem componente material). ${SPELL_RULE} ${CAST}`}],
  spells:[[1,'Toque Chocante'],[3,'Queda Suave'],[5,'Levitação']]},
 'supp-races-small-species-genasi-do-fogo':{name:'Genasi do Fogo',size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:DV18},
   {text:`Abarcar a Chama: conhece o truque Criar Chamas. A partir do 3º nível conjura Mãos Flamejantes e, a partir do 5º, Lâmina Flamejante (sem componente material). ${SPELL_RULE} ${CAST}`},
   {text:'Resistência ao Fogo: resistência a dano ígneo.'}],
  spells:[[1,'Criar Chamas'],[3,'Mãos Flamejantes'],[5,'Lâmina Flamejante']]},
 'supp-races-small-species-genasi-da-terra':{name:'Genasi da Terra',size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:DV18},
   {text:'Caminhada Telúrica: move-se em terreno difícil sem custo extra quando usa o deslocamento de caminhada no solo.'},
   {name:'Fundir-se à Pedra',text:`Fundir-se à Pedra: conhece o truque Proteção Contra Lâminas e pode conjurá-lo como Ação Bônus algumas vezes por descanso longo. A partir do 5º nível conjura Passo Sem Rastro sem componente material. ${SPELL_RULE} ${CAST}`,power:{kind:'use',max:'pb'}}],
  spells:[[1,'Proteção Contra Lâminas'],[5,'Passo Sem Rastro']]},
 'supp-races-large-species-githyanki':{name:'Githyanki',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:'Conhecimento Astral: ao terminar um descanso longo, ganha proficiência em uma perícia e com uma arma ou ferramenta à escolha, até o fim do próximo descanso longo.'},
   {text:`Psionismo Githyanki: conhece Mãos Mágicas (a mão é invisível). A partir do 3º nível conjura Salto e, a partir do 5º, Passo Nebuloso, sem componentes materiais. ${SPELL_RULE} ${CAST}`},
   {text:'Resiliência Psíquica: resistência a dano psíquico.'}],
  spells:[[1,'Mãos Mágicas'],[3,'Salto'],[5,'Passo Nebuloso']]},
 'supp-races-large-species-githzerai':{name:'Githzerai',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:'Disciplina Mental: vantagem em salvaguardas para evitar ou encerrar as condições Enfeitiçado e Amedrontado.'},
   {text:`Psionismo Githzerai: conhece Mãos Mágicas (a mão é invisível). A partir do 3º nível conjura Escudo Arcano e, a partir do 5º, Detectar Pensamentos, sem componentes materiais. ${SPELL_RULE} ${CAST}`},
   {text:'Resiliência Psíquica: resistência a dano psíquico.'}],
  spells:[[1,'Mãos Mágicas'],[3,'Escudo Arcano'],[5,'Detectar Pensamentos']]},
 'supp-races-small-species-gnomo-das-profundezas':{name:'Gnomo das Profundezas',size:'Pequeno',speed:9,movement:{walk:9},type:'Humanoide (gnomo)',
  traits:[{text:DV36},
   {name:'Camuflagem Svirfneblin',text:'Camuflagem Svirfneblin: ao fazer um teste de Destreza (Furtividade), pode fazê-lo com vantagem.',power:{kind:'use',max:'pb'}},
   {text:`Dádiva dos Svirfneblin: a partir do 3º nível conjura Disfarçar-se e, a partir do 5º, Indetectável (sem componente material). ${SPELL_RULE} ${CAST}`},
   {text:'Astúcia Gnômica: vantagem em salvaguardas de Inteligência, Sabedoria e Carisma (regra do Gnomo 2024, no lugar da antiga Resistência dos Gnomos a Magia).'}],
  spells:[[3,'Disfarçar-se'],[5,'Indetectável']]},
 'supp-races-large-species-goblin':{name:'Goblin',size:'Pequeno',speed:9,movement:{walk:9},type:'Humanoide (goblinoide)',
  traits:[{text:DV18},{text:FEY},
   {text:'Fuga Ligeira: pode usar Desengajar ou Esconder-se como Ação Bônus em cada um dos seus turnos.'},
   {name:'Fúria dos Pequenos',text:'Fúria dos Pequenos: ao causar dano com ataque ou magia a uma criatura de tamanho maior que o seu, causa dano extra igual ao seu bônus de proficiência. No máximo uma vez por turno.',power:{kind:'use',max:'pb'}}]},
 'supp-races-large-species-hobgoblin':{name:'Hobgoblin',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide (goblinoide)',
  traits:[{text:DV18},{text:FEY},
   {name:'Presente Feérico',text:'Presente Feérico: usa a ação Ajudar (regra 2024: auxiliar um teste de atributo ou dar vantagem na próxima jogada de ataque de um aliado contra um inimigo a até 1,5 m de você) como Ação Bônus. A partir do 3º nível, escolha um efeito extra ao ajudar: Despeito (o alvo atingido pelo aliado tem desvantagem na próxima jogada de ataque em 1 minuto), Hospitalidade (você e o aliado ganham 1d6 + bônus de proficiência PV temporários) ou Passagem (você e o aliado ganham +3 m de deslocamento até o início do seu próximo turno).',power:{kind:'use',max:'pb'}},
   {name:'Sorte dos Muitos',text:'Sorte dos Muitos: ao errar uma jogada de ataque ou falhar em teste de atributo ou salvaguarda, ganha um bônus igual ao número de aliados que possa ver a até 9 m (máximo +3).',power:{kind:'use',max:'pb'}}]},
 'supp-races-large-species-kenku':{name:'Kenku',size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  choices:[{key:'skill',label:'Lembrança Kenku · perícia',options:SKILLS_ALL,count:2,skill:true}],
  traits:[{text:'Especialista em Cópias: vantagem em testes de atributo para produzir duplicatas exatas de escritos ou trabalhos manuais.'},
   {name:'Lembrança Kenku',text:'Lembrança Kenku: proficiência em duas perícias à escolha. Ao fazer um teste com uma perícia em que é proficiente, pode ganhar vantagem antes de rolar.',power:{kind:'use',max:'pb'}},
   {name:'Mimetismo',text:'Mimetismo: imita sons e vozes que ouviu. Quem ouve só percebe a imitação com teste de Sabedoria (Intuição) bem-sucedido contra CD 8 + bônus de proficiência + modificador de Carisma.',dc:'cha'}]},
 'supp-races-large-species-kobold':{name:'Kobold',size:'Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  choices:[{key:'legacy',label:'Legado Kobold',options:['Astúcia','Enfrentamento','Feitiçaria Dracônica'],count:1},
   {key:'skill',label:'Se Astúcia · perícia',options:['Arcanismo','Investigação','Medicina','Prestidigitação','Sobrevivência'],count:1,skill:true,when:{legacy:'Astúcia'}}],
  traits:[{text:DV18},
   {name:'Grito Dracônico',text:'Grito Dracônico: como Ação Bônus, solta um grito contra inimigos a até 3 m. Até o início do seu próximo turno, você e seus aliados têm vantagem em jogadas de ataque contra os inimigos que o ouviram.',power:{kind:'use',max:'pb'}},
   {name:'Legado Kobold',legacy:true,text:'Legado Kobold: escolha Astúcia (uma perícia entre Arcanismo, Investigação, Medicina, Prestidigitação ou Sobrevivência), Enfrentamento (vantagem em salvaguardas para evitar ou encerrar Amedrontado) ou Feitiçaria Dracônica (um truque de Feiticeiro à escolha; adicione-o em Magias).'}]},
 'supp-races-large-species-homem-lagarto':{name:'Reptante',aliases:['Homem-Lagarto','Lizardfolk'],size:'Médio',speed:9,movement:{walk:9,swim:9},type:'Humanoide',
  naturalAC:{base:13,dex:true,label:'Armadura natural'},
  choices:[{key:'skill',label:'Intuição da Natureza · perícia',options:['Furtividade','Lidar com Animais','Medicina','Natureza','Percepção','Sobrevivência'],count:2,skill:true}],
  traits:[{text:'Armadura Natural: sem armadura, CA base 13 + modificador de Destreza (opção disponível na CA da ficha). Escudo se aplica normalmente.'},
   {text:'Intuição da Natureza: proficiência em duas perícias entre Furtividade, Lidar com Animais, Medicina, Natureza, Percepção ou Sobrevivência.'},
   {name:'Mandíbula Faminta',text:'Mandíbula Faminta: como Ação Bônus, faz um ataque especial de Mordida. Se acertar, causa o dano normal e você ganha PV temporários iguais ao bônus de proficiência.',power:{kind:'use',max:'pb'}},
   nat('Mordida','cortante','Boca com presas.'),
   {text:'Prender a Respiração: pode prender a respiração por até 15 minutos. Deslocamento de natação igual ao de caminhada.'}]},
 'supp-races-large-species-shadar-kai':{name:'Shadar-kai',size:'Médio',speed:9,movement:{walk:9},type:'Humanoide (elfo)',choices:[KEEN],
  traits:[{text:DV18},{text:FEY},
   {name:'Bênção da Rainha Corvo',text:'Bênção da Rainha Corvo: como Ação Bônus, teleporta-se até 9 m para um espaço desocupado que possa ver. A partir do 3º nível, também ganha resistência a todo dano até o início do seu próximo turno ao se teleportar assim.',power:{kind:'use',max:'pb'}},
   {text:'Resistência Necrótica: resistência a dano necrótico.'},
   {text:KEEN_TXT},{text:TRANCE}]},
 'supp-races-large-species-tabaxi':{name:'Tabaxi',size:'Médio ou Pequeno',speed:9,movement:{walk:9,climb:9},type:'Humanoide',skills:['Furtividade','Percepção'],
  traits:[{text:DV18},
   {text:'Agilidade Felina: ao se mover no seu turno em combate, pode dobrar o deslocamento até o fim do turno. Só pode usar de novo após um turno em que se mova 0 m.'},
   nat('Garras Felinas','cortante','Garras de gato. Também concedem deslocamento de escalada igual ao de caminhada.'),
   {text:'Talento Felino: proficiência em Furtividade e Percepção (aplicadas na ficha).'}]},
 'supp-races-large-species-tortle':{name:'Tortuga',aliases:['Tortle'],size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  naturalAC:{base:17,dex:false,label:'Carapaça natural',shell:true},
  choices:[{key:'skill',label:'Intuição da Natureza · perícia',options:['Furtividade','Lidar com Animais','Medicina','Natureza','Percepção','Sobrevivência'],count:1,skill:true}],
  traits:[{text:'Armadura Natural: CA base 17 (Destreza não altera). Não pode usar armadura leve, média ou pesada; o escudo se aplica normalmente.'},
   {text:'Casco Defensivo: como Ação, recolhe-se no casco (+4 CA, vantagem em salvaguardas de Força e Constituição). Enquanto recolhido: considerado Caído, deslocamento 0, desvantagem em salvaguardas de Destreza, sem reações e a única ação possível é uma Ação Bônus para sair. Use o controle de Carapaça na ficha.'},
   nat('Garras','cortante','Garras afiadas.'),
   {text:'Intuição da Natureza: proficiência em uma perícia entre Furtividade, Lidar com Animais, Medicina, Natureza, Percepção ou Sobrevivência.'},
   {text:'Prender a Respiração: pode prender a respiração por até 1 hora.'}]},
 'supp-races-large-species-tritao':{name:'Tritão',size:'Médio',speed:9,movement:{walk:9,swim:9},type:'Humanoide',
  traits:[{text:DV18},{text:'Anfíbio: respira ar e água. Deslocamento de natação igual ao de caminhada.'},
   {text:`Controle do Ar e da Água: conjura Névoa Obscurecente; a partir do 3º nível, Lufada de Vento; a partir do 5º, Caminhar Sobre as Águas. ${SPELL_RULE} ${CAST}`},
   {text:'Emissário do Mar: comunica ideias simples a feras, elementais e monstruosidades com deslocamento de natação.'},
   {text:'Guardião das Profundezas: resistência a dano gélido.'}],
  spells:[[1,'Névoa Obscurecente'],[3,'Lufada de Vento'],[5,'Caminhar Sobre as Águas']]},
 'supp-races-large-species-yuan-ti-puro-sangue':{name:'Yuan-ti',aliases:['Yuan-Ti Puro-Sangue'],size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:DV18},
   {text:`Conjuração Ofídica: conhece o truque Rajada de Veneno e conjura Amizade Animal à vontade, apenas em cobras. A partir do 3º nível conjura Sugestão uma vez por descanso longo (ou com espaços de 2º círculo ou superior). ${CAST}`},
   {text:'Resistência a Magia: vantagem em salvaguardas contra magias.'},
   {text:'Resistência a Veneno: vantagem em salvaguardas para evitar ou encerrar Envenenado e resistência a dano venenoso.'}],
  spells:[[1,'Rajada de Veneno'],[1,'Amizade Animal',{atwill:true}],[3,'Sugestão']]}
};


// Variantes antigas (2014–2016) adaptadas ao formato de 2024, mantidas por escolha do usuário.
export const ADAPT_SOURCE='Variante de suplemento antigo adaptada às regras de 2024';
const TIEF_BASE=[{text:DV18},{text:'Resistência Infernal: resistência a dano ígneo.'},{text:'Presença Sobrenatural: conhece o truque Taumaturgia.'}];
const LEGACY_NOTE='Adaptação 2024: as magias usam o círculo normal (sem a regra antiga de "conjurar como magia de 2º círculo"); cada uma pode ser conjurada uma vez por descanso longo por este traço ou com espaços de magia do círculo apropriado. '+CAST;
const tiefling=(legacyName,spells,desc,extra=[])=>({adapted:true,size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
 traits:[...TIEF_BASE,...(spells.length?[{text:`${legacyName}: ${desc} ${LEGACY_NOTE}`}]:[]),...extra],spells:[[1,'Taumaturgia'],...spells]});
Object.assign(MOTM_SPECIES,{
 'supp-races-large-species-tiferino-baalzebul':tiefling('Legado de Maladomini',[[3,'Raio Nauseante'],[5,'Coroa da Loucura']],'Taumaturgia; no 3º nível, Raio Nauseante; no 5º nível, Coroa da Loucura.'),
 'supp-races-large-species-tiferino-dispater':tiefling('Legado de Dis',[[3,'Disfarçar-se'],[5,'Detectar Pensamentos']],'Taumaturgia; no 3º nível, Disfarçar-se; no 5º nível, Detectar Pensamentos.'),
 'supp-races-large-species-tiferino-fierna':tiefling('Legado de Phlegethos',[[3,'Enfeitiçar Pessoa'],[5,'Sugestão']],'Truque Amizade (não existe nas regras de 2024; combine com o Mestre ou use Taumaturgia); no 3º nível, Enfeitiçar Pessoa; no 5º nível, Sugestão.'),
 'supp-races-large-species-tiferino-glasya':tiefling('Legado de Malbolge',[[1,'Ilusão Menor'],[3,'Disfarçar-se'],[5,'Invisibilidade']],'Ilusão Menor; no 3º nível, Disfarçar-se; no 5º nível, Invisibilidade.'),
 'supp-races-large-species-tiferino-levistus':tiefling('Legado de Stygia',[[1,'Raio de Gelo'],[3,'Armadura de Agathys'],[5,'Escuridão']],'Raio de Gelo; no 3º nível, Armadura de Agathys; no 5º nível, Escuridão.'),
 'supp-races-large-species-tiferino-mammon':tiefling('Legado de Minauros',[[1,'Mãos Mágicas'],[3,'Disco Flutuante de Tenser'],[5,'Tranca Arcana']],'Mãos Mágicas; no 3º nível, Disco Flutuante de Tenser; no 5º nível, Tranca Arcana (sem componente material).'),
 'supp-races-large-species-tiferino-mefistofeles':tiefling('Legado de Cania',[[1,'Mãos Mágicas'],[3,'Mãos Flamejantes'],[5,'Lâmina Flamejante']],'Mãos Mágicas; no 3º nível, Mãos Flamejantes; no 5º nível, Lâmina Flamejante.'),
 'supp-races-large-species-tiferino-zariel':tiefling('Legado de Avernus',[[3,'Destruição Cauterizante'],[5,'Destruição Radiante']],'Taumaturgia; no 3º nível, Destruição Cauterizante; no 5º nível, Destruição Radiante (antiga Marca da Punição).'),
 'supp-races-large-species-tiferino-variante':tiefling('Legado Infernal',[[1,'Raio de Fogo'],[3,'Repreensão Diabólica'],[5,'Escuridão']],'Raio de Fogo; no 3º nível, Repreensão Diabólica; no 5º nível, Escuridão (igual ao legado Infernal de 2024).',[{text:'Aparência: em vez da aparência comum dos tiferinos, escolha 1d4+1 traços (chifres pequenos, presas, língua bifurcada, olhos de gato, seis dedos, pernas de cabra, cascos, cauda bifurcada, pele escamosa, pele vermelha ou azul, sem sombra ou reflexo, cheiro de enxofre).'}]),
 'supp-races-small-species-tiferino-alado':tiefling('',[],'',[{text:'Alado: asas de morcego concedem deslocamento de voo igual ao de caminhada. Substitui as magias de legado (mantém Taumaturgia). O voo fica só na descrição, como as demais raças com voo.'}]),
 'supp-races-small-species-tiferino-fogo-infernal':tiefling('Legado do Fogo Infernal',[[1,'Raio de Fogo'],[3,'Mãos Flamejantes'],[5,'Escuridão']],'Raio de Fogo; no 3º nível, Mãos Flamejantes (no lugar de Repreensão Diabólica); no 5º nível, Escuridão.'),
 'supp-races-small-species-tiferino-lingua-do-diabo':tiefling('Língua do Diabo',[[1,'Zombaria Perversa'],[3,'Enfeitiçar Pessoa'],[5,'Cativar']],'Zombaria Perversa; no 3º nível, Enfeitiçar Pessoa; no 5º nível, Cativar.'),
 'supp-races-small-species-pequenino-fantasma':{adapted:true,size:'Pequeno',speed:9,movement:{walk:9},type:'Humanoide',
  traits:[{text:'Bravura: vantagem em salvaguardas para evitar ou encerrar a condição Amedrontado.'},
   {text:'Agilidade Pequenina: pode atravessar o espaço de criaturas de tamanho maior que o seu, sem parar ali.'},
   {text:'Sortudo: ao tirar 1 natural em um teste de d20, rola de novo e usa o novo resultado (automático na ficha).'},
   {text:'Furtividade Natural: pode usar Esconder-se mesmo quando obscurecido apenas por uma criatura pelo menos um tamanho maior.'},
   {text:'Dialeto Silencioso: fala telepaticamente com uma criatura por vez a até 9 m. Ela só entende se vocês compartilharem um idioma.'}]}
});


// Eberron: Forge of the Artificer (2025) — Forjado Bélico nas regras de 2024.
export const EFA_SOURCE='Eberron: Forge of the Artificer (2025)';
const WARFORGED={src:EFA_SOURCE,size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Constructo',
 choices:[{key:'skill',label:'Design Especializado · perícia',options:SKILLS_ALL,count:1,skill:true}],
 traits:[{text:'Resiliência Construída: resistência a dano venenoso e vantagem em salvaguardas para evitar ou encerrar a condição Envenenado.'},
  {text:'Proteção Integrada: +1 na CA (aplicado na ficha). Armaduras vestidas se integram ao corpo e não podem ser removidas contra a sua vontade enquanto estiver vivo.'},
  {text:'Descanso da Sentinela: não precisa dormir e magia não pode fazê-lo dormir. Faz o descanso longo em pelo menos 6 horas em estado inativo e imóvel, mas consciente (vê e ouve normalmente).'},
  {text:'Design Especializado: proficiência em uma perícia e com uma ferramenta à sua escolha (anote a ferramenta na ficha).'},
  {text:'Incansável: não sofre Exaustão por desidratação, desnutrição ou sufocamento; não precisa comer, beber nem respirar.'}]};
for(const id of ['supp-races-large-species-forjado-belico','supp-races-large-species-forjado-belico-emissario','supp-races-large-species-forjado-belico-colosso','supp-races-large-species-forjado-belico-escaramucador'])
 MOTM_SPECIES[id]={...WARFORGED,...(id.endsWith('-belico')?{}:{note:'Os subtipos Emissário, Colosso e Escaramuçador vinham da versão de playtest e não existem na versão oficial; este personagem usa as regras de 2025.'})};

// Raças do Mordenkainen 2022 que não existiam no site (versão mais recente publicada).
Object.assign(MOTM_SPECIES,{
 'supp-motm-species-fada':{name:'Fada',size:'Pequeno',speed:9,movement:{walk:9},type:'Feérico',
  traits:[{text:`Magia das Fadas: conhece o truque Arte Druídica. A partir do 3º nível conjura Fogo das Fadas e, a partir do 5º, Aumentar/Reduzir. ${SPELL_RULE} ${CAST}`},
   {text:'Voo: asas concedem deslocamento de voo igual ao de caminhada. Não pode usá-lo vestindo armadura média ou pesada.'}],
  spells:[[1,'Arte Druídica'],[3,'Fogo das Fadas'],[5,'Aumentar/Reduzir']]},
 'supp-motm-species-laparlonj':{name:'Laparlonj',aliases:['Harengon'],size:'Médio ou Pequeno',speed:9,movement:{walk:9},type:'Humanoide',skills:['Percepção'],initiativePB:true,
  traits:[{text:'Disparo da Lebre: soma o bônus de proficiência à iniciativa (aplicado na ficha).'},
   {text:'Orelhas Compridas: proficiência em Percepção (aplicada na ficha).'},
   {name:'Salto do Coelho',text:'Salto do Coelho: como Ação Bônus, salta um número de metros igual a 1,5 × bônus de proficiência, sem provocar ataques de oportunidade. Só funciona se o deslocamento for maior que 0.',power:{kind:'use',max:'pb'}},
   {name:'Sorte nos Pés',text:'Sorte nos Pés: ao falhar em uma salvaguarda de Destreza, usa a Reação para rolar 1d4 e somar ao resultado. Não funciona caído ou com deslocamento 0.',power:{kind:'damage',formula:'1d4',max:0}}]},
 'supp-motm-species-satiro':{name:'Sátiro',size:'Médio',speed:10.5,movement:{walk:10.5},type:'Feérico',skills:['Atuação','Persuasão'],
  traits:[nat('Aríete','contundente','Cabeça e chifres.'),
   {text:'Farrista: proficiência em Atuação e Persuasão (aplicadas na ficha) e em um instrumento musical à escolha.'},
   {text:'Resistência a Magia: vantagem em salvaguardas contra magias.'},
   {text:'Saltos de Alegria: ao fazer um salto em distância ou em altura, rola 1d8 e soma o resultado × 0,3 m, mesmo saltando parado. A distância extra custa deslocamento normalmente.'}]}
});

// Morfo (Transmorfo): Mordenkainen 2022. As opções Caminhar no Penhasco e Garra de Navalha vêm de fonte anterior e mantêm a descrição antiga.
const SHIFT_OPTIONS={
 'couro-de-besta':['Pele de Fera','Enquanto morfado, ganha 1d6 PV temporários adicionais a cada vez que morfa e +1 na CA (aplicado na ficha).'],
 'dentes-longos':['Presa Longa','Enquanto morfado, pode usar presas alongadas para um golpe desarmado como Ação Bônus: 1d6 + modificador de Força de dano perfurante.'],
 'passos-rapidos':['Passo Ágil','Enquanto morfado, deslocamento de caminhada +3 m e pode se mover até 3 m como reação quando uma criatura termina o turno a até 1,5 m de você, sem provocar ataques de oportunidade.'],
 'cacador-selvagem':['Caça Selvagem','Enquanto morfado, vantagem em testes de Sabedoria e nenhuma criatura a até 9 m pode ter vantagem em jogadas de ataque contra você, a menos que você esteja incapacitado.']
};
const SHIFTER_IDS=['supp-races-large-species-transmorfo','supp-races-large-species-transmorfo-couro-de-besta','supp-races-large-species-transmorfo-dentes-longos','supp-races-large-species-transmorfo-passos-rapidos','supp-races-large-species-transmorfo-cacador-selvagem','supp-races-large-species-transmorfo-caminhar-no-penhasco','supp-races-large-species-transmorfo-garra-de-navalha'];
for(const id of SHIFTER_IDS){const key=Object.keys(SHIFT_OPTIONS).find(k=>id.endsWith(k));const isParent=id.endsWith('-transmorfo');const legacy=!key&&!isParent;
 MOTM_SPECIES[id]={shifter:true,legacyOption:legacy,size:'Médio',speed:9,movement:{walk:9},type:'Humanoide',
  ...(isParent||key?{}:{keepTraits:true}),
  choices:[{key:'skill',label:'Instintos Bestiais · perícia',options:['Acrobacia','Atletismo','Intimidação','Sobrevivência'],count:1,skill:true}],
  traits:[{text:DV18},
   {text:'Instintos Bestiais: proficiência em uma perícia entre Acrobacia, Atletismo, Intimidação ou Sobrevivência.'},
   {name:'Morfismo',shift:true,text:'Morfismo: como Ação Bônus, assume aparência bestial por 1 minuto (ou até usar Ação Bônus para voltar). Ao morfar, ganha PV temporários iguais a 2 × bônus de proficiência.'}]};}
export function shifterOption(c){const id=String(c.speciesId||''),v=String(c.variant||'');const map={'couro-de-besta':/Couro de Besta|Pele de Fera/,'dentes-longos':/Dentes Longos|Presa Longa/,'passos-rapidos':/Passos Rápidos|Passo Ágil/,'cacador-selvagem':/Caçador Selvagem|Caça Selvagem/};for(const [k,re] of Object.entries(map))if(id.endsWith(k)||re.test(v))return k;return '';}

const ELADRIN_SEASONS={
 'Outono':'Outono: logo após usar o Passo Feérico, até duas criaturas que possa ver a até 3 m fazem salvaguarda de Sabedoria ou ficam Enfeitiçadas por 1 minuto, ou até sofrerem dano seu ou de aliados.',
 'Inverno':'Inverno: ao usar o Passo Feérico, uma criatura que possa ver a até 1,5 m antes do teleporte faz salvaguarda de Sabedoria ou fica Amedrontada até o fim do seu próximo turno.',
 'Primavera':'Primavera: ao usar o Passo Feérico, pode tocar uma criatura voluntária a até 1,5 m; ela se teleporta no seu lugar para um espaço que você possa ver a até 9 m.',
 'Verão':'Verão: logo após usar o Passo Feérico, cada criatura à escolha a até 1,5 m sofre dano ígneo igual ao seu bônus de proficiência.'
};

// Quando o personagem escolhe a raça "mãe" (Genasi, Gith) com uma variante, usa os dados da variante.
const PARENT_VARIANTS={'supp-races-small-species-genasi':{'Genasi da Água':'supp-races-small-species-genasi-da-agua','Genasi do Ar':'supp-races-small-species-genasi-do-ar','Genasi do Fogo':'supp-races-small-species-genasi-do-fogo','Genasi da Terra':'supp-races-small-species-genasi-da-terra'},'supp-races-large-species-gith':{'Githyanki':'supp-races-large-species-githyanki','Githzerai':'supp-races-large-species-githzerai'}};
export function motmId(c){const id=String(c?.speciesId||'');return MOTM_SPECIES[id]?id:PARENT_VARIANTS[id]?.[c?.variant]||'';}
export const isMotm=id=>!!MOTM_SPECIES[id];
export function motmChoices(c){const m=MOTM_SPECIES[motmId(c)];return m?.choices||[];}
function picked(c){return c.speciesChoices?.motm||{};}
function active(ch,c){if(!ch.when)return true;const p=picked(c);return Object.entries(ch.when).every(([k,v])=>(p[k+'1']||'')===v);}
export function motmSkills(c){const m=MOTM_SPECIES[motmId(c)];if(!m)return [];const p=picked(c);const out=[...(m.skills||[])];
 for(const ch of m.choices||[])if(ch.skill&&active(ch,c))for(let i=1;i<=ch.count;i++){const s=p[ch.key+i];if(s&&ch.options.includes(s))out.push(s);}
 return [...new Set(out)];}
export function motmChoiceNeeds(c){const m=MOTM_SPECIES[motmId(c)];if(!m)return [];const p=picked(c),out=[];
 for(const ch of m.choices||[]){if(!active(ch,c))continue;const vals=[];for(let i=1;i<=ch.count;i++)vals.push(p[ch.key+i]||'');
  if(vals.some(x=>!x))out.push(`Escolha: ${ch.label}${ch.count>1?` (${ch.count})`:''}.`);else if(new Set(vals).size<vals.length)out.push(`${ch.label}: escolha opções diferentes.`);}
 return out;}
export function motmSpellPlan(c){const m=MOTM_SPECIES[motmId(c)];return m?.spells||[];}
export function motmInitiative(c,pb){return MOTM_SPECIES[motmId(c)]?.initiativePB?pb:0;}
export function motmNaturalAC(c,dexMod){const m=MOTM_SPECIES[motmId(c)];if(!m?.naturalAC)return null;const n=m.naturalAC;return {value:n.base+(n.dex?dexMod:0),label:`${n.label}: ${n.base}${n.dex?' + DES':' (sem DES)'}`,shell:!!n.shell};}

// Cartões do painel "Poderes de espécie". helpers: {C,pow,pb,str,level,cha}
export function motmCards(c,h){const m=MOTM_SPECIES[motmId(c)];if(!m)return null;const p=h.pb(c),n=h.level(c),s=h.str(c),fm=`1d6${s>=0?'+':''}${s}`;
 const slug=x=>String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const cards=[];const body=t=>{const x=String(t);const i=x.indexOf(': ');const r=i>0&&i<45?x.slice(i+2):x;return r.charAt(0).toUpperCase()+r.slice(1);};
 const head=`${m.type?'Tipo de criatura: '+m.type+'. ':''}Tamanho: ${m.size}. Fonte: ${m.src||(m.adapted?ADAPT_SOURCE:MOTM_SOURCE)}.`;
 cards.push(h.C('motm-origin',m.adapted?'Adaptação 2024':'Origem da raça',head+' Aumentos de atributo vêm do antecedente (regra 2024).'));
 if(m.note)cards.push(h.C('motm-note','Versão oficial',m.note));
 if(m.keepTraits)cards.push(h.C('motm-legacy-option','Opção de fonte anterior','Esta opção de Transmorfo não existe no Mordenkainen 2022. O Morfismo segue a regra de 2022; o benefício específico desta opção continua descrito nos traços originais da Biblioteca.'));
 for(const t of m.traits){
  const name=t.name||String(t.text).split(':')[0];const id='motm-'+slug(name);
  if(t.season){const txt=ELADRIN_SEASONS[c.variant];cards.push(h.C(id,'Estação (nível 3)',n>=3?(txt||'Escolha a estação (variante) na edição da ficha.')+(String(txt||'').includes('salvaguarda')?` CD ${8+p}+modificador de Inteligência, Sabedoria ou Carisma.`:''):'A partir do 3º nível, o Passo Feérico ganha o efeito da sua estação.'));continue;}
  if(t.legacy){const leg=picked(c).legacy1;cards.push(h.C(id,'Legado Kobold',(leg?`Legado escolhido: ${leg}. `:'')+body(t.text)));continue;}
  if(t.shift){const opt=shifterOption(c);const extra=opt?` ${SHIFT_OPTIONS[opt][0]}: ${SHIFT_OPTIONS[opt][1]}`:m.legacyOption?' O benefício da opção desta fonte anterior está descrito nos traços originais.':' Escolha a opção de Morfismo (variante) na edição da ficha.';
   cards.push(h.pow('shifter-shift','Morfismo',body(t.text)+extra+` PV temporários: ${2*p}${opt==='couro-de-besta'?' + 1d6':''}.`,{kind:'shifting',max:p,recovery:'long'}));
   if(opt==='dentes-longos'&&c.shiftingActive)cards.push(h.pow('shifter-bite','Presa Longa (morfado)','Golpe desarmado com as presas como Ação Bônus enquanto morfado.',{kind:'damage',formula:fm}));
   continue;}
  if(t.natural){cards.push(h.pow(id,name,body(t.text),{kind:'damage',formula:fm}));continue;}
  if(t.power){const pw=t.power;const max=pw.max==='pb'?p:Number(pw.max)||0;cards.push(h.pow(id,name,body(t.text)+(max?` Usos: ${max} por descanso longo (igual ao bônus de proficiência).`:''),{kind:pw.kind||'use',formula:pw.formula||'',max,recovery:'long'}));continue;}
  if(t.dc){cards.push(h.C(id,name,body(t.text)+` CD atual: ${8+p+h.cha(c)}.`));continue;}
  cards.push(h.C(id,name,body(t.text)));
 }
 return cards;
}

// Dados para o catálogo (Biblioteca, criação e seleção).
export function motmCatalogPatch(id){const m=MOTM_SPECIES[id];if(!m)return null;if(m.keepTraits)return {speed:m.speed,size:m.size,movement:m.movement};
 const traits=[`Tipo de Criatura: ${m.type}.`,`Tamanho: ${m.size}.`,`Deslocamento: ${String(m.speed).replace('.',',')} m${m.movement.swim?', natação '+String(m.movement.swim).replace('.',',')+' m':''}${m.movement.climb?', escalada '+String(m.movement.climb).replace('.',',')+' m':''}.`,...m.traits.map(t=>t.season?'Estação: a partir do 3º nível, o Passo Feérico ganha um efeito conforme a estação (Outono, Inverno, Primavera ou Verão).':t.shift?t.text+' Opções: Pele de Fera, Presa Longa, Passo Ágil ou Caça Selvagem.':t.text)];
 return {...(m.name?{name:m.name}:{}),speed:m.speed,size:m.size,movement:m.movement,traits};}
