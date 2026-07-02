# topai

## 📋 Sobre este clone
- **Site original:** https://dev-hot-cp-megalinks.pantheonsite.io/acess/
- **Data do clone:** 02/07/2026, 18:55:46
- **Link Telegram configurado:** https://t.me/promo_folder13

## 🔗 COMO MUDAR O LINK DO TELEGRAM

### ⭐ MÉTODO FÁCIL (sem editar arquivos):
Abra o arquivo **`painel.html`** no navegador, cole o novo usuário/link e clique em **Gerar novo DM.js**.
O arquivo será baixado automaticamente — substitua o `DM.js` na pasta do site.

### Método manual:
Abra **`DM.js`** e altere só as duas primeiras linhas:
```js
var TELEGRAM_USER = 'seu_usuario';   // só o @ sem o @
var PRODUCT_NAME  = 'topai';  // nome de fallback
```

## 🎯 Como funciona a mensagem personalizada

Cada botão/link do site gera uma mensagem diferente no Telegram:

| Botão clicado | Link gerado |
|---|---|
| "Highschool Ebook" | `t.me/USER?text=Hello, I'm interested in purchasing Highschool Ebook` |
| "Premium Pack" | `t.me/USER?text=Hello, I'm interested in purchasing Premium Pack` |
| Botão sem texto | `t.me/USER?text=Hello, I'm interested in purchasing topai` |

O **DM.js** detecta o nome do produto pelo (em ordem de prioridade):
1. Atributo `data-product="Nome"` no elemento
2. Atributo `title` ou `aria-label`
3. Texto visível do botão/link
4. Alt da imagem dentro do botão
5. Fallback: nome da pasta (`PRODUCT_NAME`)

## 📁 Estrutura do projeto
```
topai/
├── index.html
├── DM.js                      ← ⭐ configuração aqui (user + produto)
├── painel.html                ← troque o link facilmente
├── tracking-dashboard.html    ← veja os cliques
└── README.md
```
