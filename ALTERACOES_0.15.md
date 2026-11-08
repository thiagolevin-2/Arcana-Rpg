# Ficha Arcana 0.15 Beta — Área do Mestre

Base: `Ficha_Arcana_0.14_GitHub.zip`. A Área do Mestre é independente dos dados de personagens e não muda o formato da exportação das fichas.

## P03 — redução de níveis removida

- A edição de personagem conserva o nível da classe inicial; não permite diminuir nem elevar níveis pelo editor.
- Classes e níveis permite revisar subclasses e ordens já existentes, sem remover classes, reduzir níveis nem redistribuir níveis.
- O validador também bloqueia alterações artificiais enviadas pela interface. A progressão por XP continua sendo a única forma de adicionar níveis.

## P04 — esclarecimento (não alterado)

- Quando a mesma magia é concedida pela classe, espécie, talento ou subclasse, os recursos e atributos de conjuração podem ser diferentes.
- Exemplo: magia aprendida pela classe e uso gratuito concedido por talento. Uma conjuração não deve consumir ambos os recursos e um descanso não deve reabastecer o uso da outra fonte.
- Permanece pendente de solução aprovada; a 0.15 não introduziu uma alteração nova nesse fluxo.

## Nova Área do Mestre

- Botão **Área do Mestre** no menu inicial, antes de abrir fichas de personagens.
- Catálogo inicial com **9 blocos de estatísticas conferidos** no Livro dos Monstros 2024 enviado pelo usuário, com páginas: Aarakocra Aeromante e Escaramuçador (p. 10), Abocanhador Matraqueante (p. 11), Abolete (p. 13), Ankheg (p. 14), Aparição (p. 15), Aquanômalo (p. 16), Aracnoide (p. 17), Aranha Planar (p. 18).
- Os blocos têm atributos FOR/DES/CON/INT/SAB/CAR, CA, PV, iniciativa, desafio, deslocamento, proficiências e ações com bônus e fórmulas. Traços de natureza situacional aparecem em descrições.
- Catálogo de monstros, filtro e busca. Permite **adicionar de 1 a 50 cópias** por comando ao encontro, com PV e iniciativa independentes para cada criatura.
- Encontros nomeados e salvos: criar, renomear, excluir, restaurar os PV, rolar iniciativa individual/de todos, ordenar iniciativas e retirar inimigos.
- **Rolagens:** testes de atributo, salvaguardas, perícias, iniciativa, acerto de ataque e dano/cura. As CD e fórmulas de magias e poderes ficam visíveis. Rolagem de ataque não aplica dano automaticamente; cada ação com dano tem botão próprio.
- Criador de monstros próprios: nome, tipo, tamanho, ND, atributos, CA, PV, iniciativa, deslocamento, perícias, salvaguardas, descrição, traços e ações configuráveis com bônus, CD, dados e usos. Possibilidade de duplicar um monstro do catálogo como personalizado.
- Histórico de rolagens, exportação e importação JSON próprios da Área do Mestre (`arcanaDM015` em `localStorage`), **separados** de `arcana2024` das fichas.

## Limites e decisões de projeto

- **O catálogo pré-carregado é uma amostra de nove monstros, não o Livro dos Monstros inteiro.** O PDF é predominantemente digitalização, e números não conferidos não foram preenchidos por aproximação. Outros blocos podem ser cadastrados manualmente pelo Mestre; o editor mantém origem própria.
- O arquivo original do livro não acompanha o ZIP publicado. Os registros incluem números e resumos curtos conferidos, não imagens ou páginas integrais.
- As rolagens não acompanham alvos, condições impostas, turnos, duração ou posicionamento. O Mestre decide os efeitos em mesa. Regras de recarga 5–6 ficam na descrição; usos limitados das instâncias podem ser registrados ao ativar a ação.
- A recuperação de PV e usos do encontro é manual e não simula descanso, tempo nem regras de iniciativa em rodadas.
- Salvamento local não sincroniza dispositivos. Use **Exportar mestre** e **Importar JSON** para backups.
- A nova seção foi testada por código e simulações de eventos, mas o Chromium não conseguiu abrir a interface neste ambiente; falta homologação visual completa.

## Arquivos alterados

- `docs/app.js`: entrada do Mestre, navegação, bloqueio da redução de nível.
- `docs/styles.css`: layout e responsividade da Área do Mestre.
- `docs/index.html`: versão e descrição.
- `docs/dm-manager015.js`: motor de criaturas e interface.
- `docs/monsters-book-2024.json`: catálogo inicial com proveniência.

## Verificação

**334 testes aprovados, zero falhas, zero ignorados**, incluindo os 323 herdados da versão 0.14 e os 11 testes da Área do Mestre. Verificação de sintaxe dos 29 módulos JavaScript e JSON de monstros.
