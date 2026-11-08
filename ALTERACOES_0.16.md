# Ficha Arcana 0.16 Beta — alterações e pendências

**Base:** ZIP Ficha Arcana 0.15 GitHub com Guia de Continuidade fornecido pelo usuário.  
**Data:** 7 de novembro de 2026.  
**Entrega:** atualização incremental para GitHub Pages, com código-fonte completo em `docs/` e testes em pacote complementar.

## 1. Resultado e limite de cobertura

Esta versão amplia a Área do Mestre e seus controles. **Não é uma implementação integral conferida de todos os monstros do livro nem encerra todas as pendências do projeto.**

| Situação do catálogo | Quantidade | O que significa |
| --- | ---: | --- |
| Blocos conferidos | **80** | 9 preservados da 0.15 e 71 conferidos visualmente nesta atualização; resumos operacionais e botões de uso/rolagem. |
| Extrações provisórias | **286** | Têm campos estruturados obtidos da digitalização, mas ainda exigem conferência visual de atributos, bônus, ações e alternativas. São identificadas e sua adição ao encontro exige confirmação. |
| Referências incompletas | **137** | Nome e página identificados; faltam dados confiáveis suficientes. Não podem ser adicionadas nem roladas como blocos completos. |
| Total de nomes/páginas | **503** | Índice dos blocos do PDF, com nomes normalizados e sem duplicar variantes espúrias da extração. |

O arquivo recebido tem “2024” no nome; as páginas editoriais identificam o **Livro dos Monstros de 2025**, da linha de regras revisadas de 2024. A fonte aparece dessa forma no catálogo. Isso não troca a prioridade de regras do projeto.

O PDF tem 391 páginas, em grande parte digitalizadas. Foram comparadas leituras das colunas, tabelas e cabeçalhos. A validação matemática de dados de vida e a presença dos campos **não comprovam** a correção de um bloco extraído automaticamente. Por isso os três estados acima permanecem distintos. O PDF, as imagens das páginas e os arquivos temporários de leitura não fazem parte do pacote do GitHub.

Para usar somente o lote conferido, abra **Área do Mestre → Catálogo → Conferidos / personalizados**. O filtro **Extraídos a conferir** mostra os provisórios; **Dados incompletos** mostra o que ainda precisa de preenchimento.

## 2. Funcionalidades acrescentadas ou concluídas

| Área | Comportamento na 0.16 |
| --- | --- |
| Catálogo | Busca sem depender de acentos; filtros por origem, tipo, tamanho, faixa de ND, inclusive fracionário, e estado de conferência. Paginação de 24 entradas. |
| Quantidade | Adição de 1 a 50 cópias inteiras por operação; quantidade preservada durante a filtragem. |
| Editor | Criação/edição de ações, ações bônus, reações e ações lendárias; bônus de ataque, CD/atributo, dados, tipos de dano, parcelas, usos, recarga e custo lendário. |
| Bloco | Sentidos, defesas, traços, alinhamento, dados de vida, recursos personalizados e reserva lendária podem ser configurados. |
| Ataques | Acerto separado de dano. Dano crítico dobra dados e mantém modificadores fixos. Parcelas de tipos diferentes permanecem separadas. |
| d20 | Rolagem normal, vantagem e desvantagem em testes, salvaguardas, ataques e iniciativa individual. |
| Dados 3D | Animação integrada às rolagens do Mestre, usando os resultados já sorteados; botão para ligar/desligar. Não sorteia uma segunda vez para desenhar o dado. |
| Rolagem livre | Nome e fórmula livres, sem CD e sem gastar recursos. Vantagem/desvantagem aceita `1d20+bônus`; outras fórmulas usam rolagem normal. |
| Usos e recarga | Contadores independentes por cópia; restaurar um uso, rolar recarga em d6 e renovar reserva lendária manualmente. |
| Recursos | Gastar/restaurar recursos como Resistência Lendária, respeitando o máximo configurado. Variações de covil são informadas para ajuste em cópia própria. |
| PV | Edição de nome, PV atuais/máximos, PV temporários, iniciativa e notas de cada cópia. Dano desconta primeiro os PV temporários. |
| Backups | Prévia e confirmação de importação; mesclar por padrão ou substituir explicitamente. Remapeamento de IDs em conflitos e inclusão de referências dos monstros usados. |
| Personalizados usados | Excluir do catálogo não inutiliza as criaturas que já estão nos encontros; o bloco fica preservado como referência no backup. |
| Revisão de dados | Cópia de um bloco incompleto/provisório exige confirmação de conferência e preenchimento dos campos principais para ser salva. |

**Como os gastos funcionam:** `Acerto`, `Registrar uso` ou `Rolar e registrar` registram o uso da habilidade, quando houver limite. `Dano` e `Crítico` calculam o dano sem cobrar esse uso novamente. A mesa confirma quando a habilidade foi usada e quando recupera recursos. Rolagens avulsas do catálogo não alteram uma cópia de encontro.

## 3. Problemas efetivamente corrigidos

- Botões dentro da janela de estatísticas deixavam de chegar ao tratamento geral de ações por causa de uma interrupção de propagação do clique. O bloqueio foi retirado.
- Resultados de rolagem apareciam atrás da janela da criatura. Agora aparecem dentro dela, em área legível; o histórico é mantido.
- Rolagens de cópias renomeadas usavam o nome do monstro do catálogo. Agora identificam a cópia; nomes repetidos também recebem identificação do inimigo.
- Resultado de uma sessão anterior permanecia visível após importar outro backup. A indicação transitória é limpa na importação, sem apagar o histórico mesclado.
- Ações bônus, reações e lendárias não tinham o mesmo suporte de edição das ações comuns. As quatro listas usam os mesmos campos e controles.
- Editar/apagar uma ação anterior podia deslocar o contador de outra. IDs de ações são mantidos; contadores antigos por posição continuam compatíveis.
- Uma falha ao preparar/rolar a ação podia deixar gasto parcial. O gasto é validado em cópia e confirmado somente após a preparação da ação; dano/cura sem fórmula produz erro sem debitar o recurso.
- Dano/cura configurados em parcelas funcionam também sem exigir uma fórmula combinada redundante.
- Importações não devem truncar encontros/instâncias acima dos limites silenciosamente; são rejeitadas com mensagem. IDs duplicados são rejeitados.
- Mesclar backups com referências diferentes e mesmo ID podia trocar o bloco usado pela criatura importada. Referências conflitantes são remapeadas.
- Excluir um monstro próprio tinha tratamento interno, mas faltava botão acessível; o botão e a confirmação estão disponíveis na ficha.
- Valores ausentes de blocos pendentes não são preenchidos como atributos 10 para liberar seu uso. Esses blocos permanecem bloqueados.
- Nomes corrompidos e registros duplicados da leitura automática foram confrontados com o índice; o catálogo final usa os 503 nomes/páginas indexados.
- No lote conferido, danos condicionais de goblins, Batedor Capitão e investidas foram separados dos ataques básicos. Não entram sempre no dano.
- Salvaguarda de Carisma do Abolete corrigida para **+4** após conferência no PDF; dano da Mordida do Ankheg separado em cortante e ácido.
- O lote revisado inclui as estatísticas atuais de criaturas como Goblin/​Hobgoblin (Feérico), Coruja Gigante (Celestial), Zumbi com salvaguarda de SAB +0 e Dragão de Prata Jovem com CA 18, PV 168 e ND 9.
- IDs de seletores de modo de d20 das janelas deixaram de repetir o mesmo ID do encontro. Há tratamento de Escape e contenção de Tab nas janelas do Mestre.
- Campos do editor/filtros foram agrupados com seus rótulos, botões podem quebrar linhas e as caixas usam as cores do tema claro/escuro.

## 4. Decisões preservadas

- Não foi recriado o site. Criação/edição de personagens, classes/subclasses, espécies/linhagens/talentos, inventário, infusões, companheiros, transformações, macros, retratos e magias da 0.15 continuam na base.
- **P04 (mesma magia por várias fontes): permanece sem mudança.** Exige decisão específica; esta atualização não redefine origem de usos/espaços.
- Redução/redistribuição de níveis não foi reintroduzida. Subida de nível continua.
- Infusões e sistemas de descanso/curas dos jogadores não foram alterados nesta entrega.
- Não há relógio de combate, mapa, alvo automático, aplicação de dano no alvo, controle de duração, rodadas ou deslocamento percorrido. Velocidades do monstro são apenas texto informativo.
- Reservas, recargas, condições e gatilhos são confirmados pela mesa. As descrições não devem ser interpretadas como automação de todos os efeitos.

## 5. Compatibilidade e arquivos

- Personagens continuam em `arcana2024`; Mestre continua em **`arcanaDM015`**. O nome histórico da chave não é um erro nem precisa ser apagado.
- O formato de backup do Mestre continua `kind: arcana-dm`, `version: 1`, com campos opcionais novos. Ausência de PV temporários, recarga, reserva e referências em backups antigos é normalizada sem alterar PV zero, IDs e usos válidos.
- O módulo permanece **`docs/dm-manager015.js`** para manter o caminho existente; sua implementação agora é a 0.16. Não é necessário manter duas versões do módulo.
- IDs dos nove monstros publicados na 0.15 foram conservados. O catálogo ampliado usa IDs únicos. Não há migração destrutiva de fichas de jogadores.
- JSON armazenado inválido não é sobrescrito silenciosamente pela Área do Mestre. Exporte um backup válido após recuperar seus dados.

Arquivos de execução alterados: `docs/app.js`, `docs/dm-manager015.js`, `docs/index.html`, `docs/monsters-book-2024.json` e `docs/styles.css`. Os demais arquivos de execução foram comparados byte a byte com a base fornecida e preservados. O pacote mantém **51 arquivos de execução em `docs/`**, sem criar novos módulos/arquivos de execução.

A publicação tem **58 arquivos**: os mesmos 57 caminhos do ZIP de base, atualizados quando necessário, e este relatório. `tests/`, `package.json`, os dados de referência de desenvolvimento e os resultados dos testes ficam no ZIP complementar. Não entram caches, PDFs, leituras temporárias, backups de teste, servidores de prévia ou uma pasta `dist/` duplicada.

## 6. Verificação executada

| Verificação | Resultado |
| --- | --- |
| Base 0.15 antes das mudanças | **334 testes aprovados**. |
| Suíte completa final 0.16 | **365 aprovados, 0 falhas, 0 ignorados**; `npm test`. |
| Testes novos | **31** no arquivo `tests/master-area016.test.js`; a suíte final inclui 42 testes da Área do Mestre contando os 11 anteriores. |
| Sintaxe | JavaScript de execução verificado com `node --check`; JSONs parseados. |
| Catálogo | IDs/nomes únicos, páginas, estados de conferência e bloqueio de pendentes; atributos e fórmulas do lote conferido; média dos dados de vida compatível com PV. Isso não homologa os 286 provisórios. |
| Código preservado | Comparação com o ZIP da 0.15; somente os cinco arquivos de execução acima diferem. |
| Navegador desktop | Entrada no Mestre; busca/filtro; cópias independentes; PV; ataque, crítico, recarga e animação 3D; editor com reação; rolagem livre; exclusão de personalizado preservando cópias. |
| Backup em navegador | Importação de exemplo no formato 0.15 com PV/usos/iniciativa; mesclagem; exportação; leitura do JSON exportado; reimportação por substituição, preservando referências e PV 7/20 e 20/20. |
| Ficha de jogador em navegador | Importada ficha gerada pelo motor original 0.15; troca de armadura; conjuração de Bola de Fogo; edição/rolagem de macro e confirmação única do gasto. |
| Temas | Conferidos no desktop em claro e escuro. |

### Limitações da verificação

A conferência visual não cobriu cada uma das 503 entradas nem todas as combinações de poderes/itens/personagens. Os 286 provisórios podem conter números, tipos, ações omitidas ou fórmulas mal lidas; confirmação de adição **não os transforma em blocos homologados**. Os resumos do lote conferido também não substituem a descrição completa de cada regra.

Responsividade recebeu ajustes CSS, mas **não houve homologação em aparelho móvel físico ou uma matriz completa de larguras/navegadores**. Impressão, desempenho em celular antigo, leitor de tela e a publicação real no GitHub Pages não foram homologados nesta sessão. Não houve nova pesquisa externa de erratas; a referência desta ampliação foi o PDF fornecido e, para dados de magias explicitamente usados no lote, o catálogo 2024 já existente no projeto.

Os testes automatizados incluem cenários de dados inválidos que emitem aviso esperado de recuperação. Mensagens da extensão do navegador usadas pelo ambiente de verificação não foram tratadas como erros do site.

## 7. O que ainda falta

1. Conferir visualmente as **286 extrações provisórias**, corrigindo atributos, bônus, fórmulas e ações incompletas antes de classificá-las como conferidas.
2. Completar as **137 referências bloqueadas** listadas adiante; o índice completo não equivale a estatísticas completas para encontros.
3. Verificar habilidades especiais complexas, magias não mapeadas e continuações de blocos. É possível criar cópia editável ou usar Rolagem livre; não foi implementada a automação individual de todo o livro.
4. Em dano adicional condicionado a um ataque, a mesa confirma a elegibilidade. Nos botões separados do lote, quando o texto pedir dano crítico adicional, role a parcela duas vezes. Não foi criado um encadeamento automático de todos os danos condicionais.
5. Renovação lendária, limite de “uma vez até o próximo turno”, reações, gatilhos, alvos, áreas, engolir, estados e diferenças de covil continuam manuais, conforme a filosofia do projeto.
6. P04 e as demais revisões de itens, infusões, talentos e subclasses citadas no guia continuam pendências independentes. Este trabalho foi centrado na Área do Mestre; não é uma nova auditoria integral de todas as regras de personagens.
7. Completar a validação móvel/acessibilidade/publicação real indicada acima.

## 8. Como atualizar o GitHub

1. Exporte seus personagens e a Área do Mestre em JSON antes de substituir os arquivos.
2. Extraia `Ficha_Arcana_0.16_GitHub.zip`. Envie **o conteúdo**, com `docs/` na raiz do repositório, preservando a organização existente.
3. GitHub Pages continua em `main` → `/docs`. Não envie o ZIP fechado como se fosse a página.
4. Não envie o pacote de testes à pasta pública; ele é complementar para desenvolvimento. Não é necessário instalar dependências para executar o site estático.
5. Depois que o Pages terminar a publicação, recarregue a página e confira o título **0.16 Beta**. Não limpe os dados do navegador para atualizar a versão.

## 9. Lote conferido — nomes e páginas

Fonte: índice e blocos do PDF fornecido. Os nove da 0.15 foram preservados; os demais desta lista foram conferidos visualmente na 0.16. A apresentação usa resumos e controles numéricos; efeitos situacionais continuam na mesa.

| Criatura | Página impressa | Página no PDF | Lote |
| --- | ---: | ---: | --- |
| Aarakocra Aeromante | 10 | 13 | 0.15 |
| Aarakocra Escaramuçador | 10 | 13 | 0.15 |
| Abocanhador Matraqueante | 11 | 14 | 0.15 |
| Abolete | 13 | 16 | 0.15 |
| Ankheg | 14 | 17 | 0.15 |
| Aparição | 15 | 18 | 0.15 |
| Aquanômalo | 16 | 19 | 0.15 |
| Aracnoide | 17 | 20 | 0.15 |
| Aranha Planar | 18 | 21 | 0.15 |
| Bandido | 27 | 30 | 0.16 |
| Bandido Capitão | 27 | 30 | 0.16 |
| Batedor | 32 | 35 | 0.16 |
| Batedor Capitão | 32 | 35 | 0.16 |
| Combatente de Infantaria | 57 | 60 | 0.16 |
| Combatente Veterano | 57 | 60 | 0.16 |
| Cultista | 62 | 65 | 0.16 |
| Cultista Fanático | 63 | 66 | 0.16 |
| Cultista Hierofante | 63 | 66 | 0.16 |
| Dragão de Prata Filhote | 111 | 114 | 0.16 |
| Dragão de Prata Jovem | 111 | 114 | 0.16 |
| Dragão de Prata Adulto | 112 | 115 | 0.16 |
| Esqueleto | 152 | 155 | 0.16 |
| Esqueleto Cavalo de Guerra | 152 | 155 | 0.16 |
| Esqueleto Minotauro | 153 | 156 | 0.16 |
| Esqueleto Flamejante | 153 | 156 | 0.16 |
| Gnoll Combatente | 179 | 182 | 0.16 |
| Gnoll Senhor da Alcateia | 179 | 182 | 0.16 |
| Goblin Lacaio | 181 | 184 | 0.16 |
| Goblin Combatente | 181 | 184 | 0.16 |
| Goblin Chefe | 182 | 185 | 0.16 |
| Goblin Maleficista | 182 | 185 | 0.16 |
| Guarda | 194 | 197 | 0.16 |
| Guarda Capitão | 194 | 197 | 0.16 |
| Hobgoblin Combatente | 199 | 202 | 0.16 |
| Hobgoblin Capitão | 200 | 203 | 0.16 |
| Hobgoblin Senhor da Guerra | 200 | 203 | 0.16 |
| Lich | 225 | 228 | 0.16 |
| Ogro | 271 | 274 | 0.16 |
| Ogro Ogrillon | 271 | 274 | 0.16 |
| Troll | 325 | 328 | 0.16 |
| Membro de Troll | 325 | 328 | 0.16 |
| Worg | 337 | 340 | 0.16 |
| Worg Atroz | 337 | 340 | 0.16 |
| Zumbi | 346 | 349 | 0.16 |
| Ogro Zumbi | 346 | 349 | 0.16 |
| Aranha | 350 | 353 | 0.16 |
| Aranha Gigante | 350 | 353 | 0.16 |
| Aranha-lobo Gigante | 350 | 353 | 0.16 |
| Archelon | 350 | 353 | 0.16 |
| Babuíno | 351 | 354 | 0.16 |
| Baleia Assassina | 351 | 354 | 0.16 |
| Besouro de Fogo Gigante | 351 | 354 | 0.16 |
| Cabra | 351 | 354 | 0.16 |
| Cabra Gigante | 352 | 355 | 0.16 |
| Camelo | 352 | 355 | 0.16 |
| Caranguejo | 352 | 355 | 0.16 |
| Caranguejo Gigante | 352 | 355 | 0.16 |
| Cavalo de Carga | 353 | 356 | 0.16 |
| Cavalo de Montaria | 353 | 356 | 0.16 |
| Cavalo de Guerra | 353 | 356 | 0.16 |
| Cavalo-marinho | 353 | 356 | 0.16 |
| Cavalo-marinho Gigante | 353 | 356 | 0.16 |
| Cobra Venenosa | 355 | 358 | 0.16 |
| Cobra Venenosa Gigante | 355 | 358 | 0.16 |
| Cobra Voadora | 355 | 358 | 0.16 |
| Coruja | 355 | 358 | 0.16 |
| Coruja Gigante | 355 | 358 | 0.16 |
| Falcão | 360 | 363 | 0.16 |
| Falcão de Sangue | 360 | 363 | 0.16 |
| Gato | 360 | 363 | 0.16 |
| Hiena | 360 | 363 | 0.16 |
| Lobo | 363 | 366 | 0.16 |
| Lobo Atroz | 363 | 366 | 0.16 |
| Rã Gigante | 369 | 372 | 0.16 |
| Rato | 369 | 372 | 0.16 |
| Rato Gigante | 369 | 372 | 0.16 |
| Rinoceronte | 370 | 373 | 0.16 |
| Sapo Gigante | 370 | 373 | 0.16 |
| Texugo | 370 | 373 | 0.16 |
| Texugo Gigante | 370 | 373 | 0.16 |

## 10. Referências incompletas e bloqueadas

Esta lista não inclui os 286 provisórios. Para eles, use o filtro próprio no catálogo e o campo `provisional` do JSON. Campos extraídos parcialmente de uma referência abaixo não autorizam preencher os restantes por aproximação.

| Criatura | Página impressa | Página no PDF | Conferência necessária |
| --- | ---: | ---: | --- |
| Batraquiano Sábio do Brejo | 33 | 36 | ND |
| Bico-de-machado | 36 | 39 | Estatísticas e/ou ações; Estatísticas e ações |
| Bico-de-machado Gigante | 36 | 39 | Atributos: wis |
| Bugbear Espreitador | 38 | 41 | ND |
| Bulete | 39 | 42 | Atributos: cha |
| Carneçal Evocador do Túmulo | 43 | 46 | PV/dados |
| Carniçal Lacedon | 44 | 47 | ND |
| Cavaleiro | 47 | 50 | Atributos: con |
| Cavaleiro Andante | 47 | 50 | PV/dados |
| Centauro Zelador | 50 | 53 | Ações |
| Ciclope Oráculo | 54 | 57 | Atributos: dex,int, ND |
| Cocatrice | 55 | 58 | Estatísticas e/ou ações; Estatísticas e ações |
| Colosso | 56 | 59 | Ações |
| Couatl | 59 | 62 | PV/dados |
| Dao | 66 | 69 | Ações |
| Diabo do Gelo | 77 | 80 | Atributos: cha |
| Diabo dos Ossos | 78 | 81 | Ações |
| Diabrete | 81 | 84 | Ações |
| Djinni | 82 | 85 | PV/dados |
| Dracolich | 85 | 88 | Ações |
| Dragão Tartaruga | 86 | 89 | Ações |
| Dragão de Latão Filhote | 103 | 106 | Atributos: wis |
| Dragão Fada Adulto | 117 | 120 | Atributos: cha |
| Dragão Negro Jovem | 118 | 121 | Atributos: int |
| Dragão Verde Filhote | 122 | 125 | Atributos: wis |
| Dretch | 131 | 134 | Estatísticas e/ou ações; Estatísticas e ações |
| Elemental da Água | 135 | 138 | Atributos: str,con,cha |
| Empiriano Iota | 139 | 142 | Atributos: dex,cha, PV/dados |
| Ent | 141 | 144 | Atributos: cha |
| Espantalho | 147 | 150 | Atributos: con |
| Espectro | 149 | 152 | Atributos: cha |
| Estrangulador | 155 | 158 | Atributos: cha |
| Fungo Guinchador | 161 | 164 | ND, Ações |
| Fungo Violeta | 162 | 165 | Atributos: int |
| Enxame de Garras Rastejantes | 165 | 168 | Atributos: cha, Iniciativa, PV/dados, Nome |
| Gigante da Colina | 167 | 170 | ND |
| Gigante do Gelo | 169 | 172 | Atributos: int, Nome |
| Githyanki Combatente | 173 | 176 | Iniciativa |
| Githzerai Monge | 175 | 178 | Atributos: int |
| Gladiador | 178 | 181 | Ações |
| Gnoll Presa de Yeenoghu | 180 | 183 | Atributos: int |
| Górgon | 187 | 190 | Atributos: int |
| Górgon de Bronze | 188 | 191 | Ações |
| Grick Ancião | 191 | 194 | Atributos: con,int,wis,cha, ND |
| Grimlock | 193 | 196 | Estatísticas e/ou ações; Estatísticas e ações |
| Harpia | 195 | 198 | Estatísticas e/ou ações; Estatísticas e ações |
| Hipogrifo | 198 | 201 | Estatísticas e/ou ações; Estatísticas e ações |
| Homúnculo | 201 | 204 | Estatísticas e/ou ações; Estatísticas e ações |
| Ifriti | 204 | 207 | ND, Ações |
| Inço-praga Ramo | 205 | 208 | Atributos: int |
| Inço-praga Espinheiro | 205 | 208 | Atributos: dex,cha |
| Inço-praga de Gulthias | 207 | 210 | Ações |
| Inumano | 209 | 212 | Atributos: cha |
| Kenku | 210 | 213 | Atributos: int |
| Kobold Combatente | 211 | 214 | Ações |
| Kraken | 213 | 216 | Ações |
| Kuo-toa | 215 | 218 | Atributos: int |
| Kuo-toa Monitor | 216 | 219 | Atributos: int |
| Kuo-toa Açoitador | 216 | 219 | Estatísticas e/ou ações; Estatísticas e ações |
| Licantropo Tigre | 222 | 225 | Estatísticas e/ou ações; Estatísticas e ações |
| Licantropo Urso | 223 | 226 | Atributos: cha |
| Mantreva | 235 | 238 | Estatísticas e/ou ações; Estatísticas e ações |
| Mefit de Gelo | 239 | 242 | Estatísticas e/ou ações; Estatísticas e ações |
| Mefit de Lama | 240 | 243 | Estatísticas e/ou ações; Estatísticas e ações |
| Megera do Mar | 242 | 245 | Ações |
| Mezzoloth | 247 | 250 | Atributos: dex, PV/dados |
| Miconídeo Adulto | 249 | 252 | Estatísticas e/ou ações; Estatísticas e ações |
| Miconídeo Soberano | 249 | 252 | Estatísticas e/ou ações; Estatísticas e ações |
| Minotauro de Baphomet | 251 | 254 | Estatísticas e/ou ações; Estatísticas e ações |
| Modron Pentadrone | 254 | 257 | Ações |
| Monstro da Ferrugem | 255 | 258 | Atributos: int,cha, Ações |
| Múmia | 257 | 260 | Estatísticas e/ou ações; Estatísticas e ações |
| Múmia Real | 259 | 262 | Nome |
| Naga Espiritual | 260 | 263 | Ações |
| Naga Guardiã | 261 | 264 | Ações |
| Nalfeshnee | 263 | 266 | Atributos: int; CA ilegível |
| Armadura Animada | 267 | 270 | Atributos: con |
| Espada Voadora Animada | 267 | 270 | Atributos: int,wis,cha |
| Vassoura Animada | 268 | 271 | Ações |
| Observador | 270 | 273 | Atributos: int |
| Otyugh | 273 | 276 | Estatísticas e/ou ações; CA ilegível |
| Pirata | 279 | 282 | Atributos: cha, PV/dados; CA ilegível |
| Pirata Capitão | 280 | 283 | Atributos: int |
| Pixie das Maravilhas | 281 | 284 | Atributos: cha |
| Arbusto Desperto | 283 | 286 | Atributos: int, ND |
| Árvore Desperta | 283 | 286 | Estatísticas e/ou ações; Estatísticas e ações |
| Plebeu | 284 | 287 | Atributos: con |
| Pudim Negro | 287 | 290 | Atributos: cha |
| Remorraz | 293 | 296 | Atributos: con,cha |
| Reptante Soberano | 294 | 297 | Estatísticas e/ou ações; CA ilegível |
| Roca | 297 | 300 | Atributos: cha |
| Sátiro | 305 | 308 | Estatísticas e/ou ações; CA ilegível |
| Sátiro Mestre da Farra | 305 | 308 | Estatísticas e/ou ações; Estatísticas e ações |
| Sereiano Escaramuçador | 308 | 311 | Estatísticas e/ou ações; Estatísticas e ações |
| Serpe | 309 | 312 | Estatísticas e/ou ações; Estatísticas e ações |
| Slaad Azul | 311 | 314 | Atributos: con,int,cha |
| Sombra | 315 | 318 | ND |
| Súcubo | 317 | 320 | Estatísticas e/ou ações; Estatísticas e ações |
| Tríbulo Brutal | 323 | 326 | Atributos: cha; CA ilegível |
| Troglodita | 324 | 327 | Ações |
| Urso-coruja | 328 | 331 | Atributos: wis |
| Urso-coruja Primal | 328 | 331 | Ações |
| Valentão | 329 | 332 | Atributos: str,dex,int,wis, Iniciativa, Ações |
| Valentão Chefe | 329 | 332 | Atributos: con |
| Verme Púrpura | 335 | 338 | Atributos: con,int,cha |
| Yeti | 339 | 342 | Atributos: cha, PV/dados |
| Yochlol | 341 | 344 | Atributos: cha |
| Yuan-ti Infiltrador | 342 | 345 | Ações |
| Yuan-ti Mestiço (tipo 2) | 343 | 346 | Atributos: cha |
| Águia | 348 | 351 | ND |
| Águia Gigante | 348 | 351 | ND |
| Alossauro | 349 | 352 | Atributos: con, PV/dados |
| Anquilossauro | 349 | 352 | Atributos: con,cha, PV/dados |
| Cervo | 354 | 357 | Atributos: int; CA ilegível |
| Chacal | 354 | 357 | Atributos: int, ND |
| Cobra Constritora Gigante | 354 | 357 | Atributos: int |
| Doninha | 356 | 359 | Atributos: int, ND |
| Doninha Gigante | 357 | 360 | Estatísticas e/ou ações; Estatísticas e ações |
| Elefante | 357 | 360 | Atributos: con,int,cha, PV/dados |
| Enxame de Cobras Venenosas | 357 | 360 | Estatísticas e/ou ações; Estatísticas e ações |
| Enxame de Insetos | 358 | 361 | Estatísticas e/ou ações; Estatísticas e ações |
| Enxame de Morcegos | 358 | 361 | Ações |
| Escorpião | 359 | 362 | Atributos: con, ND, PV/dados, Nome; CA ilegível |
| Escorpião Gigante | 359 | 362 | Atributos: int,wis |
| Javali | 361 | 364 | Atributos: dex,con,cha, PV/dados; CA ilegível |
| Lagarto | 362 | 365 | PV/dados |
| Lagarto Gigante | 362 | 365 | Ações |
| Morcego | 366 | 369 | ND |
| Piranha | 367 | 370 | Ações |
| Plesiossauro | 367 | 370 | Estatísticas e/ou ações; CA ilegível |
| Polvo | 367 | 370 | Atributos: wis, ND |
| Rã | 368 | 371 | Atributos: int, ND |
| Tigre | 371 | 374 | Atributos: str, Iniciativa, PV/dados |
| Tiranossauro Rex | 371 | 374 | Atributos: con |
| Tubarão Gigante | 372 | 375 | Ações |
| Urso Pardo | 373 | 376 | Estatísticas e/ou ações; CA ilegível |
| Vespa Gigante | 373 | 376 | PV/dados |

**Referência completa dos três estados:** `docs/monsters-book-2024.json`. Todos os registros trazem fonte/página e identificação do estado de revisão.
