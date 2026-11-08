# Ficha Arcana 0.21 Beta — alterações

## Correção: teclado do celular fechava ao digitar nas buscas
- A 0.18 devolvia o cursor ao campo, mas no celular o teclado fechava porque o campo era substituído por um novo a cada letra.
- Agora a tela é atualizada **sem substituir o campo em que você está digitando**: só a lista de resultados muda. Vale para todas as buscas (raças na criação, grimório, adicionar magia, talentos, Biblioteca e catálogo do Mestre) e para qualquer janela que se atualize enquanto você digita.
- Testado em emulação de iPhone: o campo permanece o mesmo e com foco a cada letra.

## Etiqueta de versão nos arquivos
- Todos os arquivos do site são carregados com `?v=0.21`. Ao publicar uma versão nova, o navegador baixa os arquivos novos em vez de usar os antigos guardados.
- Para a próxima versão, basta trocar o número (script `setversion.py` na sessão de desenvolvimento).

## Próximo foco: monstros bloqueados
- 137 monstros do catálogo estão bloqueados (só nome e página). Eles passam a ter prioridade na conferência pelo livro.
