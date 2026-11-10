# Template — Toda página nova de artigo longo

LEIA ESTE ARQUIVO PRIMEIRO, antes de criar qualquer página nova de artigo longo. Aplique os 2 itens abaixo em TODA página nova, sem precisar que eu peça de novo.

## 1. Caixa da newsletter — no final do artigo

Copie EXATAMENTE o componente que já existe em /pombagira-sem-vestido-vermelho/ e em /pombagira-dignidade-mulher-negra/. Não redesenhe, não mude texto, cor ou tamanho.

- Posição: no final do texto do artigo, ANTES do box da autora ("Pesquisa e ensaio cultural independente / Pombagiras.com / Por Alexia Melusine") e ANTES do rodapé.
- Título: "Receber a Carta das Pombagiras"
- Texto: "Um comunicado discreto e mensal com ensaios inéditos, estudos antropológicos e atualizações do acervo. Sem spam, sem venda de dados e sem mensagens comerciais."
- Campo: placeholder "Digite seu melhor e-mail com discrição..."
- Botão: "Inscrever-se →"
- Abaixo: "Seus dados nunca serão compartilhados nem vendidos. Cancele com um clique quando desejar."
- O campo source_page no Supabase tem que ser o caminho da página nova (ex: /minha-nova-pagina/), e NÃO o caminho copiado do exemplo.
- Sem pop-up, sem anúncio. O boas-vindas automático via Resend já existe e não deve ser tocado.

## 2. Rodapé — com o link Apoio

O rodapé de TODA página nova tem 4 links, nesta ordem exata:
1. Política de Privacidade
2. Termos de Uso
3. Metodologia
4. Apoio → https://pombagiras.com/apoio/

"Apoio", e NÃO "Donativo": o link é o hub de apoio https://pombagiras.com/apoio/. "Donativo" confundiria com a página /donativos/, que é só doação pontual.

Layout do rodapé:
- DESKTOP / WEB (acima de 768px): os 4 links em UMA ÚNICA LINHA HORIZONTAL, centralizados, sem quebrar, sem estourar, sem rolagem horizontal.
- CELULAR (max-width: 768px): os 4 links em 2 LINHAS, 2 em cada linha, em grade 2 colunas, centralizado:
  - Linha de cima: Política de Privacidade | Termos de Uso
  - Linha de baixo: Metodologia | Apoio
  - Nenhum link cortado, nenhum link sozinho numa 3ª linha, nenhuma rolagem horizontal.
- O link Apoio tem destaque: dourado do site, em negrito. Os outros 3 mantêm a cor atual.
- Não mude o resto do rodapé: © 2026 POMBAGIRAS.COM, contato@pombagiras.com e o resto ficam como estão.

## 3. Teste da página nova

Antes de abrir o Pull Request da página nova, teste em desktop 1280px (rodapé em 1 linha) e em celular 360px, 390px e 430px (rodapé em 2+2, sem rolagem horizontal, caixa da newsletter com campo em largura total e botão em largura total abaixo, sem corte).
