# 🧼 ISOAP – Sistema de Gerenciamento de Sabão

**ISOAP** é um sistema web de gerenciamento de pedidos, produtos, despesas e clientes voltado para empresas que comercializam sabão artesanal. Desenvolvido com a arquitetura MVC (Model-View-Controller), o projeto visa oferecer uma estrutura clara, organizada e escalável, utilizando tecnologias modernas do ecossistema Node.js.

---

## Arquitetura MVC

O sistema está dividido em três camadas principais:

### Model (Modelos – `models/`)

Responsável pela estrutura e manipulação dos dados da aplicação, cada modelo representa uma entidade do sistema, utilizando **Mongoose** para interagir com o banco de dados **MongoDB**.

- `ClienteModel`: Armazena informações dos clientes (nome, endereço, telefone, etc.).
- `ProdutoModel`: Gerencia dados dos produtos, como nome, preço e quantidade.
- `PedidoModel`: Registra pedidos com cliente, itens, frete, pagamento e total.
- `DespesaModel`: Representa despesas operacionais.
- `UsuarioModel`: Guarda informações de login e permissões de acesso dos usuários.

Cada modelo implementa métodos como `save`, `find`, `findOneAndUpdate`, e `deleteOne`.

---

### View (Interfaces de Usuário – `views/`)

As views são arquivos **EJS** responsáveis por renderizar páginas HTML dinâmicas com os dados recebidos dos controladores. Elas são organizadas por entidade e incluem formulários e listagens para:

- Cadastro, edição e listagem de **clientes**, **produtos**, **pedidos** e **despesas**.
- Interfaces de **login**, **registro** e **confirmação de exclusão de usuários**.
- Utilização de layout base para padronização visual e navegação fluida.

---

### Controller (Controladores – `controllers/`)

Controladores lidam com a lógica de negócios e as requisições HTTP. Cada entidade possui um controlador com métodos como:

- `list`: Exibe a lista de registros.
- `addPage`, `editPage`: Renderizam formulários.
- `add`, `edit`, `delete`: Realizam operações no banco de dados.

Controladores implementados:

- `Cliente`
- `Produto`
- `Pedido`
- `Despesa`
- `Usuario`

---

## Configurações e Middleware

- `app.js`: Ponto de entrada da aplicação, define middlewares, rotas, conexão com o banco de dados e inicialização do servidor Express.
- `auth.js`: Middleware de autenticação para proteger rotas.
- `admin.js`: Middleware para validar se o usuário é administrador.

---

## Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript no backend.
- **Express** – Framework web para criação das rotas e estrutura do servidor.
- **MongoDB** – Banco de dados NoSQL para persistência dos dados.
- **Mongoose** – ODM para modelagem dos dados em MongoDB.
- **EJS** – Motor de templates para renderização dinâmica de páginas HTML.
- **Passport.js** – Autenticação de usuários.
- **Express-session** – Gerenciamento de sessões do usuário.
- **Body-parser** – Interpretação de dados enviados via formulário.
- **dotenv** – Gerenciamento de variáveis de ambiente.
- **PDFKit** – Geração de PDFs de pedidos.

---

## Funcionalidades

- **CRUD completo para:**
  - Clientes
  - Produtos
  - Pedidos
  - Despesas
- **Login e cadastro de usuários** com verificação de administrador.
- **Geração de PDF** dos pedidos.
- Interface **amigável e responsiva** com feedback de ações.
- Estrutura **escalável** com base em padrões da engenharia de software.

---

## Acesso

- Cadastro de usuário disponível na página inicial.
- Usuários com `eAdmin = 1` possuem acesso a funcionalidades administrativas.

---

## Observações

- O sistema **não utiliza frontend moderno** (como React ou Vue), focando em simplicidade com EJS.
- O padrão **MVC facilita a manutenção**, reutilização de código e futuras expansões.
- Pode ser **facilmente adaptado** para outras áreas de comércio.

---

## Contribuidores

`Projeto Final do ano letivo de 2023 da matéria de Processo de Engenharia de Software I ministrada pelo professor Victor Francisco Araya Santander e desenvolvida pelos alunos Eduardo Cozer, Geandro Silva e Vinicius Messaggi de Lima Ribeiro na Instituição de ensino superior UNIOESTE (Universidade Estadual do Oeste do Paraná)`

<table>
  <tr>
    <td align="center"><a href="https://github.com/Eduardo-Cozer"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/129805691?v=4" width="100px;" alt=""/><br /><sub><b>Eduardo Cozer</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/GeandroRdS"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/140825373?v=4" width="100px;" alt=""/><br /><sub><b>Geandro Silva</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/Vmessaggi"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/109189195?v=4" width="100px;" alt=""/><br /><sub><b>Vinicius Messaggi de Lima Ribeiro</b></sub></a><br /></td>
  </tr>
</table>
