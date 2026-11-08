# FICHA ARCANA — CONTINUIDADE DO PROJETO
**Versão-base atual obrigatória: 0.16 Beta (7 de novembro de 2026), derivada da 0.15 fornecida**  
**Objetivo deste arquivo:** permitir que outro chat continue o mesmo projeto com o mínimo de retrabalho.  
**Leia isto ANTES de sugerir correções ou recriar componentes.**

> **Mensagem ao próximo chat:** Este projeto NÃO deve ser refeito do zero. Extraia e analise este ZIP como fonte principal da versão 0.16. Preserve o conteúdo e a aparência que já existem. Faça alterações incrementais, entregue um ZIP completo atualizado e diga exatamente o que mudou, o que foi testado e o que ainda está incompleto. Não afirme que uma funcionalidade está totalmente automatizada se só existe como descrição, botão ou controle manual.


## 0. Atualização de continuidade — estado real da 0.16

**Esta seção atualiza as informações históricas da 0.15 abaixo.** A próxima atualização deve usar este ZIP 0.16; não voltar ao catálogo de nove blocos nem recriar o site.

- **Catálogo:** 503 nomes/páginas, **80 blocos conferidos**, **286 provisórios** e **137 incompletos bloqueados**. Só nome/página de índice não é estatística pronta. Os 80 incluem os nove anteriores e 71 conferidos visualmente nesta versão. O arquivo recebido diz 2024 no nome; o conteúdo editorial é o Livro dos Monstros 2025 da linha revisada 2024.
- Estados `pending` e `provisional`, fonte e página ficam no JSON. Provisórios têm aviso e confirmação para adicionar; incompletos não podem ser adicionados/rolados. Não eliminar essas distinções para simular cobertura integral.
- **Mestre:** editor das quatro listas de ações, parcelas de dano, d20 com vantagem/desvantagem, crítico, recarga d6, recursos por cópia, reserva lendária manual, PV temporários e notas, filtros/paginação, rolagem livre sem CD e animação 3D.
- **Compatibilidade:** chave `arcanaDM015`, backup `arcana-dm` versão 1 e caminho `docs/dm-manager015.js` continuam. Campos opcionais novos são normalizados. IDs dos nove monstros anteriores foram mantidos. Ações usam IDs estáveis para evitar trocar contadores após edição.
- **Backups:** confirmação; mesclar por padrão ou substituir; referências são exportadas e preservadas ao excluir personalizado usado; colisões de IDs são remapeadas. Não sobrescrever armazenamento inválido silenciosamente.
- **Testes finais:** **365 aprovados** (334 da base +31 novos); 42 cobrem a Área do Mestre. Testes complementares em `Ficha_Arcana_0.16_Testes.zip`, extraídos junto à raiz com `docs/`. Não assumir que passarão depois de novas edições.
- **Navegador:** verificados no desktop importação 0.15, mesclagem e restauração de backup exportado, cópias independentes, PV/usos, rolagens, animação, editor, ficha antiga de jogador, magia e macro. Celular físico/matriz de telas não homologados.
- **Arquivos:** mesmos 51 de execução em `docs/`; 58 no ZIP público. Foram alterados somente app.js, dm-manager015.js, index.html, monsters-book-2024.json e styles.css entre os arquivos de execução. Testes e dados auxiliares ficam no pacote separado.
- **Pendências:** conferir os 286 provisórios e preencher os 137 bloqueados. O relatório `ALTERACOES_0.16.md` lista os 80 conferidos e os 137 bloqueados. Magias não mapeadas, efeitos especiais e duração/alvos continuam manuais; Rolagem livre e cópia editável são apoios, não prova de automação completa.
- **Decisões anteriores continuam:** não alterar P04 sem especificar a decisão; não recriar redução de níveis; não automatizar movimento/turnos/duração; infusões e descansos dos jogadores não foram mexidos nesta entrega.

Leia `ALTERACOES_0.16.md` antes das seções históricas seguintes. As contagens de nove monstros e 334 testes abaixo descrevem a 0.15, não a 0.16.

## 1. O que o usuário quer construir

**Ficha Arcana** é um site estático de apoio a D&D 5e revisado (2024), em português, publicável pelo **GitHub Pages**. Ele tem duas áreas **separadas na tela inicial**:

1. **Fichas de jogadores:** criação e evolução de personagens, características de classes/subclasses/espécies/talentos, combate, ataques e macros, magias com rolagem e botão de uso, inventário, itens mágicos, infusões, companheiros, transformações, salvamento e dados 3D.
2. **Área do Mestre:** catálogo de monstros, criação de inimigos personalizados, encontros com várias cópias independentes de monstros, controle de PV e usos individuais, iniciativa e rolagens de seus próprios atributos e ações.

**Prioridade de regras:** Livro do Jogador **2024** para personagens e Livro dos Monstros **2024** para estatísticas de criaturas. Suplementos antigos podem existir quando compatíveis, com origem indicada; não acumular versões conflitantes da mesma regra. Material UA deve continuar marcado como experimental.

**Filosofia central:** o site calcula números conhecidos, rola dados e registra gastos confirmados; **jogador/Mestre** decide consequências, gatilhos situacionais e o que aconteceu na cena. Evitar criar simulador de tabuleiro ou de rodadas.

## 2. REGRA NOVA E EXPRESSA: DESLOCAMENTO — SIMPLIFICAR AO MÁXIMO

**Não investir tempo corrigindo/automatizando mecânicas de deslocamento.** Mostrar, no máximo, **uma ou duas caixas simples com valores numéricos**. Sugestão: **Deslocamento** e **Outros deslocamentos** (quando existirem). As caixas devem ser somente informativas; não é necessário construir um sistema de movimentação.

- Não criar controle de caminhada por rodada, voo, escalada, natação, distância percorrida, posição, mapas, velocidade temporária, teleporte ou terreno difícil.
- Se uma característica alterar movimento, pode ser explicada na descrição da habilidade; **não é prioridade calcular ou controlar suas consequências**.
- Na Área do Mestre, apenas mostrar a velocidade do monstro indicada na ficha/referência. Não simular movimentos de inimigos.
- Não criar dezenas de subcampos. Se houver vários tipos de velocidade, apresentá-los compactamente, com seus números; efeitos condicionais ficam na descrição e na mesa.
- **Não apagar funcionalidades estáveis de outros sistemas** para simplificar deslocamento. Quando mexer especificamente nessa interface, priorizar o formato mínimo acima.

Outras decisões deliberadamente **manuais**: turnos, rodadas, duração de magias, concentração/condições de alvos externos, áreas, alcance e linha de visão, posicionamento, alvos, gatilhos narrativos, uso de reação na mesa e resolução de salvaguardas de outras criaturas. **Não reintroduzir relógio de combate.**

## 3. O que está implementado na 0.15 (não refazer)

### Personagens — evolução acumulada
- Versão 0.9–0.9.6: motor de ficha, combate, magias, recursos, itens e infusões, criaturas companheiras, transformações, espécies e benefícios situacionais; macros no Combate; correção do seletor inválido de IDs que começam com número.
- Versão 0.11: painéis separados de poderes de espécie, linhagem, talentos e subclasses, criação organizada e interface das magias; funcionalidades mantidas nas versões seguintes.
- Versão 0.12: integração de **83 decisões de talentos**, com **66 ajustes** e 17 mantidos conforme planilha; escolhas, bônus, fontes e recursos; controles manuais quando a regra depende de cena.
- Versão 0.13: **88 subclasses, 457 características estruturadas**, escolhas e benefícios por nível; armas, magias e recursos de subclasses; companheiros escalonáveis. Isso **NÃO significa** que todas as ações especiais estejam automatizadas individualmente.
- Versão 0.14: correções de usos de Arcanos Místicos, 0 PV na progressão, compatibilidade da infusão Disparo Recorrente, importação de magias especiais, atualização do grimório e impressão de magias concedidas por outras fontes.
- Versão **0.15**: **RETIRADA a funcionalidade de baixar níveis**. Não voltar a implementá-la. Progressão para **subir níveis por XP** continua; não criar redução/redistribuição de níveis na tela.
- Manter criação, edição, macros, rolagem de dados 3D, retratos, recursos, subclasse, inventário, personagens salvos, exportação/importação e armazenamento existentes.

### Área do Mestre — novidade da 0.15
- Botão **Área do Mestre** na tela anterior à escolha/abertura das fichas; dados do Mestre separados dos personagens.
- Catálogo inicial com **9 blocos verificados** do Livro dos Monstros 2024: Aarakocra Aeromante, Aarakocra Escaramuçador, Abocanhador Matraqueante, Abolete, Ankheg, Aparição, Aquanômalo, Aracnoide e Aranha Planar. Cada registro tem fonte e página.
- Busca de monstros e adição de **1 a 50 cópias por operação**; instâncias com **PV, iniciativa e usos independentes**. Gerenciar encontros (nome, salvar, excluir, restaurar PV, iniciativa, retirar criaturas).
- Criador/editor de monstros próprios e duplicação de monstro existente para customização; atributos, CA, PV, ND, perícias, salvaguardas, ações, dano, CD e usos.
- Botões para rolar atributos, perícias, salvaguardas, iniciativa, acerto, dano/cura; registro de resultados. Dano **não** é aplicado a alvos automaticamente.
- JSON de backup/importação do Mestre separado do JSON dos jogadores. Armazenamento no navegador em `localStorage`, sem conta e sem sincronização.
- **Não** afirmar que o catálogo tem o livro inteiro: são **somente 9 monstros revisados**. O PDF completo de 2024 foi fornecido na conversa anterior, mas **não está incluso neste ZIP**. Para ampliar, usar fonte disponível/conferível; nunca inventar atributos, ações ou números por aproximação, nem copiar ilustrações/páginas inteiras do livro para a publicação.

## 4. Pendências reais ou a conferir (em ordem útil)

| Prioridade | Tema | Situação e critério para próxima revisão |
|---|---|---|
| Alta | **P04: mesma magia por múltiplas fontes** | **AINDA SEM DECISÃO APROVADA.** Ex.: classe e talento concedem a mesma magia, mas com atributos, espaços/usos gratuitos e recuperação distintos. Proposta a discutir: identificar cada concessão por **ID de fonte**, escolher a fonte ao conjurar, descontar somente aquela reserva, impedir gastos duplos e testar descanso/importação. Não modificar sem especificar o comportamento. |
| Alta | **Ampliar Área do Mestre** | Catálogo inicial é pequeno. Acrescentar monstros do MM 2024 em lotes conferidos; pesquisa por nome, ND/tipo; garantir ações, salvaguardas e rolagens corretas. O objetivo maior é **selecionar uma quantidade de inimigos e gerenciá-los em encontros**. |
| Alta | **Verificar no navegador real** | A 0.15 passou por testes automatizados, mas **não foi homologada visualmente em Chromium** neste ambiente. Testar entrada na Área do Mestre, criação, seleção, PV, rolagens, modo móvel e atualização do site após publicação. |
| Média | **Infusões e itens mágicos** | Validar vínculos ao trocar equipamento, restrições de alvo, cargas, sintonização e estado após exportar/importar. `Disparo Recorrente` já teve uma regra de compatibilidade corrigida na 0.14; não repetir essa correção. |
| Média | **Macros e gastos** | Conferir que prévia/rolagem não consuma recurso; confirmar gastos uma única vez, sem custo parcial quando houver recurso indisponível; manter cálculos com mudança de nível e equipamento. |
| Média | **Subclasses, talentos e espécies** | Completar somente ações úteis que ainda careçam de rolagem, uso, custo ou bônus fixo. Se o efeito depender de cena, mostrar descrição em vez de automatizar. Evitar duplo bônus com ajustes manuais antigos. |
| Média | **Magias e descrições** | Conferir fórmulas de ataque, dano/cura e CDs, origem dos usos, magias especiais importadas, rótulos e descrição de monstros/magias; o alvo e a duração ficam manuais. |
| Média | **Criação e inventário 2024** | Revisar equipamentos iniciais A/B, proficiências, custos e cálculos antes de ampliar fluxos; não regredir importação/exportação. |
| Baixa | **Compatibilidade de navegação** | Verificar responsividade, teclado, foco, contraste, impressão e cache do GitHub Pages, em mudanças específicas. |
| Fora de escopo | **Redução de nível (P03)** | **Encerrado por decisão do usuário:** não manter/recriar esse recurso; não gastar tempo desenvolvendo reversão de talentos por redução de nível. |
| Fora de escopo | **Deslocamento e relógio de combate** | Só mostrar 1–2 caixas numéricas para deslocamento; outros aspectos de movimento, turnos/rodadas e duração sob controle da mesa. |

A planilha `Ficha_Arcana_0.13_Erros_e_Solucoes.xlsx` anterior listou **92 itens**, mas **não são 92 erros confirmados na 0.15**: inclui fatos históricos corrigidos, suspeitas, limitações deliberadamente manuais e casos que ainda exigem reprodução. Peça a planilha ao usuário quando for tratar muitos IDs; **não reabra todos os itens indiscriminadamente**.

## 5. Como desenvolver SEM perder tempo com testes repetidos

**Não eliminar testes importantes; executá-los na hora certa.** A 0.15 tinha **334 testes automatizados aprovados** antes da inclusão deste documento. O código de testes está em `Ficha_Arcana_0.15_Testes.zip`, separado do ZIP de publicação para manter o GitHub leve.

1. **Antes de editar:** leia `ALTERACOES_0.15.md` (e 0.14/0.13 se necessário), localize exatamente o módulo afetado, identifique o fluxo e a origem dos dados. Não faça auditoria geral da ficha a cada pedido pequeno.
2. **Mudança pequena/localizada:** execute verificação de sintaxe do(s) JS alterado(s) (`node --check docs/arquivo.js`), e **apenas o teste específico** (`node --test tests/master-area015.test.js` para Mestre, por exemplo). Adicione um teste de regressão curto para o erro reproduzido.
3. **Mudança entre módulos / dados persistentes:** execute testes das áreas tocadas **e os caminhos de importação/exportação envolvidos**. Inclua um cenário com fichas antigas para evitar perda de dados.
4. **Antes de publicar uma nova versão:** execute a suíte completa **uma vez**, após os ajustes ficarem estáveis: `npm test`. Se houver novos consertos depois disso, repita o conjunto afetado e, antes da entrega final, a suíte completa novamente. Não rodar centenas de testes a cada linha editada.
5. **Smoke test manual curto:** abrir tela inicial → criar/abrir ficha → usar um botão principal de magia/macro → entrar na Área do Mestre → adicionar 2 cópias do mesmo monstro → modificar PV de uma sem alterar a outra → rolar ataque/dano → exportar/importar JSON. Verificar celular quando mexer no CSS.
6. **Comunicar o que realmente foi verificado.** Teste de código não equivale a homologação visual; se navegador indisponível, explicar a limitação em vez de afirmar sucesso visual.

**Preparação do ambiente de testes:** extraia o ZIP de testes **na mesma raiz do projeto**, ao lado de `docs/`; ele contém `package.json` e a pasta `tests/`. Requer **Node.js 20+** e bibliotecas nativas; `npm test` executa `node --test tests/*.test.js`. A versão de publicação não leva `tests/` para o GitHub.

## 6. Organização do repositório e arquivos importantes

Este ZIP é o **pacote de publicação**, com `docs/` na raiz. GitHub Pages aponta para `main` → `/docs`; **não publicar o ZIP fechado** ou mover `docs/` para uma subpasta extra.

- `docs/index.html`, `docs/styles.css`, `docs/app.js`: interface principal/entrada, estilos, navegação, ficha.
- `docs/dm-manager015.js`: Área do Mestre, catálogo, encontros, ações e armazenamento.
- `docs/monsters-book-2024.json`: monstros conferidos (amostra inicial com fonte/página).
- `docs/subclass-rules013.js`, `docs/subclass-ui013.js`: integração de subclasses.
- `docs/feat-rules012.js`, `docs/feat-ui012.js`: integração de talentos.
- `docs/macros094.js`, `docs/macros094-data.js`: macros de combate.
- `docs/spells.json`, `docs/references.json`, demais JSONs: catálogos e referências usadas pela ficha.
- `docs/dice3d.js`, `docs/dice-geometry.js`: rolagens e visualização de dados.
- `ALTERACOES_0.13.md`, `ALTERACOES_0.14.md`, `ALTERACOES_0.15.md`: histórico de mudanças; `README.md`, `VERSAO.txt`: publicação e versão.

**Não duplicar `docs/` em `dist/` sem necessidade**; manter estrutura enxuta e pastas separadas, conforme a preferência do usuário. Arquivos de teste e fontes de desenvolvimento podem ficar em ZIP complementar, como na 0.15. Preservar o estilo visual e os dados existentes.

## 7. Contratos de compatibilidade

- O site é estático e guarda dados em `localStorage`: personagens na chave `arcana2024`; Área do Mestre em `arcanaDM015` (verifique no código antes de mexer no formato).
- **Não trocar IDs ou formato de dados arbitrariamente**; incluir migração quando adicionar campos. Exportar backup JSON antes de atualizar; não sobrescrever personagens ou encontros quando a migração falhar.
- Duplicar criaturas cria **instâncias distintas**. Reduzir PV/gastar uso em uma não afeta outras cópias.
- Preservar dados de classe, raça, talento, macro, item, companheiro e monstro durante importação/exportação.
- Priorizar correções locais e componentes existentes em vez de novos módulos excessivos. Não copiar o livro inteiro ou imagens digitalizadas para dentro do repositório.

## 8. Instruções para o próximo chat e formato de entrega

**Pedido inicial sugerido:**

> Use este arquivo como instrução de continuidade e use o ZIP da **Ficha Arcana 0.16** como código-fonte. Continue o mesmo site a partir da versão mais recente, sem refazer a interface. Respeite que **deslocamento deve ser só 1 ou 2 caixas com números**, sem automação. Primeiro confira se a correção pedida já existe. Faça a menor alteração útil possível, verifique com testes direcionados e somente rode a suíte completa ao fechar a versão. Entregue ZIP do GitHub Pages com `docs/`, relatório de alterações, resultado real de testes e pendências atualizadas. **Não altere P04 nem mecanismos deliberadamente manuais sem decisão minha.**

**Toda nova entrega deve informar:** base usada; arquivos alterados; problemas realmente corrigidos; decisões mantidas; testes específicos e completos executados; limitações ainda abertas; compatibilidade do backup; como publicar no GitHub. A próxima versão, caso solicitada, deve ser numerada em sequência à 0.16.

---
**Resumo em uma frase:** aperfeiçoar a ficha de D&D 2024 e a Área do Mestre para executar **rolagens e controles numéricos**, não simular a mesa; manter movimentação mínima (até duas caixas de valores), preservar tudo que já funciona e testar de forma direcionada.
