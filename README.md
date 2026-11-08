# Ficha Arcana 0.17 Beta

Atualização incremental da **0.15 fornecida**, preservando `docs/`, a identidade visual e as fichas existentes. A ampliação desta versão está na **Área do Mestre**.

## Conteúdo e cobertura

- **503 nomes e páginas** do índice do PDF fornecido.
- **80 blocos conferidos**: 9 preservados e 71 revisados nesta versão.
- **286 extrações provisórias**, identificadas e com confirmação antes de adicionar.
- **137 referências incompletas**, bloqueadas para uso até revisão/preenchimento.

**Não é o livro inteiro conferido/automatizado.** Selecione **Conferidos / personalizados** no catálogo para usar apenas o lote revisado. Consulte [ALTERACOES_0.16.md](ALTERACOES_0.16.md) para a lista dos 80 e das 137 pendências, regras manuais e limites da verificação.

## Área do Mestre

Na tela inicial, abra **Área do Mestre**. Pesquise por nome e filtre origem, tipo, tamanho, ND e conferência. Adicione 1–50 cópias, com PV, iniciativa, notas e usos independentes.

O editor permite ações comuns, bônus, reações e lendárias; fórmulas, parcelas de dano, CDs, usos, recarga e recursos. Ataque, dano e crítico usam botões separados. Recarga e recuperação são confirmadas pela mesa.

**Rolagem livre** aceita fórmulas sem CD, sem gastar recursos. **Dados 3D** liga/desliga a animação das rolagens do Mestre. Alvos, rodadas, duração, movimento e consequências continuam manuais.

## Publicação no GitHub Pages

Extraia o ZIP e envie o conteúdo à raiz do repositório; mantenha `docs/`. Configure Pages para `main` → `/docs`. O pacote público tem 58 arquivos, sem testes, dependências ou pasta `dist/` duplicada. Não envie apenas o ZIP fechado.

Personagens e Mestre ficam salvos neste navegador, em áreas separadas. **Exporte os dois backups JSON antes da atualização.** O backup do Mestre importa com confirmação, mesclando por padrão; a substituição é uma escolha explícita. Não limpe os dados do navegador para atualizar o site.

## Desenvolvimento e testes

Extraia `Ficha_Arcana_0.16_Testes.zip` ao lado de `docs/`. Requer Node.js 20+ e não precisa instalar dependências. Execute `npm test`.

**365 testes aprovados, zero falhas e zero ignorados.** Houve verificação em navegador desktop de encontros, rolagens, edição, backup, importação de ficha antiga, magia e macro. Celular físico, matriz completa de navegadores e a publicação real no Pages não foram homologados.

## Continuidade

Leia [LEIA_PRIMEIRO_CONTINUIDADE.md](LEIA_PRIMEIRO_CONTINUIDADE.md). P04 continua sem alteração; redução de nível não foi reintroduzida; infusões e descansos/curas dos personagens não foram alterados nesta versão.
