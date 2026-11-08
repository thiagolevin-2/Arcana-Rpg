# Ficha Arcana 0.14 Beta — correções verificadas

**Base:** Ficha Arcana 0.13 Beta, sem recriação do site. A pasta `docs/` continua sendo o ponto de publicação no GitHub Pages. **Esquema de exportação/importação não mudou**, para preservar compatibilidade com as fichas existentes.

## Critério de seleção

A planilha `Ficha_Arcana_0.13_Erros_e_Solucoes.xlsx` possui 92 registros. Na cópia analisada, **as 92 decisões estavam como “A definir”** e os campos “Nossa decisão”, “Solução aprovada” e “Critério de aceite final” não continham soluções aprovadas. Por isso, as sugestões da planilha foram tratadas apenas como **propostas de trabalho**. Foram aplicadas as correções de menor ambiguidade que puderam ser verificadas por teste. **Não se declara que as 92 pendências foram resolvidas**.

## Correções realizadas

| ID da planilha | Alteração técnica | O que foi testado |
| --- | --- | --- |
| **P01 — Arcanos Místicos** | Trocar ou reselecionar o Arcano Místico do mesmo círculo preserva o estado de uso gasto; não concede um novo uso antes do descanso. | Escolha → gasto → mesma escolha → escolha diferente → permanece indisponível. |
| **P02 — Nível e 0 PV** | Avançar ou redistribuir níveis não restaura PV se o personagem estiver em 0 PV. O estado de vida e as salvaguardas contra morte permanecem registrados. Edição de nível também respeita 0 PV. | Nível com personagem morrendo e revisão de nível com personagem estabilizado. |
| **P06 — Disparo Recorrente** | A infusão requer arma compatível com a propriedade Munição. Não basta selecionar qualquer arma, arma de arremesso ou dardo. | Espada Longa e Dardo rejeitados; Arco Curto aceito; importação mantém vínculo válido. |
| **P11 — Magia especial importada** | A normalização de backup reconstrói o índice auxiliar `knownSpellsByClass.special` a partir de concessões especiais válidas em `spellAccess`; usos previamente gastos permanecem. | Backup com índice incompleto, fonte válida e contador; concessão inválida é descartada. |
| **P12 — Atualização do grimório** | Depois de adicionar uma magia no seletor, a ficha subjacente é renderizada imediatamente antes de reabrir o navegador de magias. | Simulação da interface adicionando um truque de Mago. |
| **U02 — Impressão de magias** | O painel impresso mostra magias disponíveis mesmo quando o personagem não tem níveis em classe conjuradora (por exemplo, uma magia de item). | Simulação da interface de Guerreiro com magia concedida por item. |

**Validação:** 323 testes automatizados aprovados, incluindo 8 testes novos; verificações de sintaxe dos módulos alterados. Os testes usam Node.js 20 ou superior e bibliotecas nativas, sem instalação de pacotes. Não houve homologação visual de todos os fluxos em navegador real.

## Pendências que continuam abertas

- **P03:** redução de níveis com reversão de todos os benefícios de progressão. Não basta apagar o nível: origem dos talentos/aumentos antigos deve ser reconciliada com o histórico.
- **P04:** fontes múltiplas da mesma magia com reservas e atributos independentes para todos os casos.
- **P05 e P10:** sobreposição de ajustes manuais/automáticos e auras ou efeitos situacionais.
- **P07–P08:** vínculo estável de infusões em equipamentos equipados, cargas e sintonização; **P06** não representa auditoria integral das infusões.
- **P13–P15:** pacotes de equipamento 2024, cobertura de fórmulas e revisão textual de magias.
- **P16–P31:** revisão individual de subclasses, espécies, talentos, itens e companheiros; os painéis de 0.13 foram preservados.
- **P32–P38:** testes adicionais de macros, responsividade, acessibilidade, impressão completa, GitHub e migração entre navegadores.
- **M/D/I/U/F históricos:** continuam registrados na planilha como correção relatada, risco ou pendência a revalidar. O êxito dos testes não equivale a certificação de todas as combinações.

## Decisões de funcionamento preservadas

- O **Livro do Jogador 2024** prevalece em conflito com regras antigas equivalentes. Material UA continua identificado.
- Não há administração automática obrigatória de turnos, rodadas, duração, áreas, alvos, posicionamento ou voo.
- Magias, poderes e macros ficam responsáveis por rolagens, custos e usos que o jogador confirmar; consequências no ambiente ficam sob controle do jogador/Mestre.
- Classes, talentos, subclasses, dados 3D, retratos, macros, companheiros, inventário, histórico, importação e exportação da 0.13 foram preservados.

## Instalação no GitHub Pages

Extraia o ZIP de publicação na **raiz** do repositório, preservando `docs/` e seus caminhos internos. Em Settings → Pages, mantenha a branch configurada e a origem `/docs`. Substitua os arquivos antigos correspondentes e apague arquivos obsoletos somente depois de confirmar que não são referenciados. Exporte um backup JSON das fichas antes de atualizar. Se a página continuar mostrando a versão antiga, recarregue ignorando o cache.

Para executar os testes em uma cópia local, extraia o ZIP complementar de testes na mesma pasta do ZIP de publicação e execute `npm test`.
