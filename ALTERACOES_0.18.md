# Ficha Arcana 0.18 Beta — alterações

Atualização incremental da 0.17. Entregue somente por ZIP (sem GitHub).

## Correção: campos de busca perdiam o cursor

Ao digitar nas buscas (raças na criação de personagem, magias, talentos, grimório), o cursor saía do campo a cada letra.

- Causa 1: a janela era redesenhada a cada letra e o site mandava o foco para o botão "Fechar". Agora isso só acontece quando a janela abre pela primeira vez.
- Causa 2: ao redesenhar, o navegador disparava o evento "change" no campo antigo, que redesenhava a janela de novo no meio da primeira vez e gerava um erro. Os campos de busca agora são tratados só no evento de digitação.
- Testado: busca de raças, de magias (adicionar e grimório), de talentos (Estilo de Luta), da Biblioteca (talentos, catálogo, fontes) e do catálogo do Mestre.

## Monstros conferidos no livro em português (lote 1)

Reescritos a partir das páginas do PDF e marcados como conferidos: Arcanaloth, Artista, Assassino, Azer Piromante, Azer Sentinela, Balor, Bandido Ludibriador, Bandido Rei do Crime, Banshee e Barlgura.

Total: **93 conferidos**, 273 provisórios, 137 bloqueados.
