# Ficha Arcana 1.0

Ficha de personagem de **D&D 2024** com **Área do Mestre** e **Mesa online**, tudo num site estático (pasta `docs/`, publicada pelo GitHub Pages). Suplementos de 2014 são aceitos; quando há conflito, valem as regras de 2024.

## Para os jogadores
- Criação de personagem guiada, 13 classes com subclasses, espécies do Livro do Jogador 2024, do Mordenkainen (2022, adaptado a 2024) e de Eberron (2025).
- Ficha completa: atributos, perícias, vida (com vida máxima ajustável), combate, armas personalizadas, macros (dado extra + número fixo), magias, equipamentos, economia, companheiros (incluindo o Eco do Cavaleiro Eco), talentos e anotações.
- Rolagens com vantagem/desvantagem, condições e dados 3D.
- Tudo fica salvo no navegador; use **Exportar** para guardar uma cópia.

## Para o mestre (Área do Mestre)
- **Catálogo com 503 monstros**, todos utilizáveis (243 do SRD 5.2 e os demais conferidos página por página no Livro dos Monstros em português).
- **Meus monstros**: criar do zero ou adaptar um do livro. **NPCs**: importar fichas do próprio site ou de arquivo JSON.
- **Imagem da aparência** de cada monstro, com a opção de mostrar aos jogadores.
- **Encontros com combate**: lista na ordem de iniciativa, painel alto por criatura (vida, estatísticas, ataques), turnos e rodadas. O encontro só aparece para os jogadores quando o mestre clica em **Iniciar encontro**.
- Ao rolar dano, uma janela pergunta **em quem foi** (um ou vários alvos, com opção de metade).
- **Feed de dados** na lateral, com todas as rolagens ao vivo.
- **Backup da mesa** (encontros, monstros, NPCs, imagens, jogadores e registro) e **Restaurar mesa**.

## Mesa online
O mestre cria uma sala (Área do Mestre › Mesa online) e passa o código. Cada jogador abre a ficha, toca em **Mesa online** e entra. A barra lateral mostra as rolagens de todos ao vivo, a iniciativa, os pedidos de teste do mestre e as imagens que ele mostrar. Ataques e danos rolados durante um encontro perguntam qual monstro foi o alvo. **Encerrar sala** desconecta todos os jogadores.

Conexão direta entre os aparelhos (sem conta e sem servidor próprio). Precisa de internet. A sala existe enquanto a página do mestre estiver aberta.

## Publicação no GitHub Pages
Envie **todo o conteúdo da pasta `docs/`** (incluindo `assets/` e `vendor/`) para a pasta `docs` do repositório e configure o Pages para `main` → `/docs`. A pasta `ferramentas-dev/` e os arquivos `.md` não são necessários para o site.

Fichas e dados do mestre ficam salvos em cada navegador. **Faça backup (Exportar fichas / Backup da mesa) antes de atualizar ou trocar de computador.**

## Histórico e continuidade
As mudanças de cada versão estão em `ALTERACOES_*.md` (a mais recente: `ALTERACOES_1.0.md`). Para continuar o desenvolvimento, leia `LEIA_PRIMEIRO_CONTINUIDADE.md` e `CONTINUIDADE_0.22.md`. Os testes automáticos (Playwright) estão em `ferramentas-dev/testes/`.

## Licença do SRD 5.2
Este trabalho inclui material do System Reference Document 5.2 ("SRD 5.2") da Wizards of the Coast LLC, disponível em https://www.dndbeyond.com/srd. O SRD 5.2 está licenciado sob a Creative Commons Attribution 4.0 International License, disponível em https://creativecommons.org/licenses/by/4.0/legalcode. Os dados foram obtidos por meio da API da Open5e (https://open5e.com) e traduzidos/resumidos para o português.

## PeerJS
A Mesa online usa a biblioteca PeerJS 1.5.4 (licença MIT, https://peerjs.com), incluída em `docs/vendor/` com o arquivo de licença, e o servidor público gratuito de salas do PeerJS (0.peerjs.com) para os aparelhos se encontrarem.
