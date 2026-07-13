# Contrato de API - Servidor para Gerenciamento de Biblioteca

## BookSense

O **BookSense** é uma aplicação completa (Full Stack) voltada para o gerenciamento de acervos literários e reservas de livros escolares. O projeto conta com um servidor robusto desenvolvido em Node.js com Express e uma interface web moderna.

### Equipe
- Caio Augusto Faria Machado
- Iury Gonçalves de Souza
- Yan Gabardo Souza

---

# 🚀 Como Executar o Projeto Localmente

## Pré-requisitos

Certifique-se de ter o Node.js instalado.

## Passo a Passo

1. Clone ou baixe os arquivos do repositório.

2. Abra o terminal na pasta do projeto e instale as dependências:

```bash
npm install express
```

3. Inicie o servidor:

```bash
node app.js
```

4. Abra o navegador e acesse:

```text
http://localhost:3000
```

---

# 🛣️ Endpoints (Especificação da API)

| Método | Endpoint | Entrada | Resposta | Status | Descrição |
|--------|----------|----------|-----------|---------|-----------|
| **GET** | `/` | — | Página HTML | `200` | Renderiza a tela inicial/Login. |
| **GET** | `/livros` | `tipo` (query URL) | Lista em JSON ou HTML | `200` / `401` | Retorna o acervo ou barra o acesso se deslogado. |
| **POST** | `/login` | `usuario`, `senha` (Body JSON) | OK / Erro | `200` / `401` | Autentica o usuário administrador. |
| **POST** | `/reserva` | `id`, `aluno` (Body JSON) | Confirmação | `201` / `400` / `404` | Reduz uma unidade do acervo e agenda o prazo. |

---

# 🧠 Decisões de Projeto e Regras de Negócio

- **Filtros Públicos:** O parâmetro `tipo` é enviado pela Query String da URL, pois representa um filtro público de consulta ao acervo.

- **Dados Privados:** Os campos `usuario` e `senha` são enviados exclusivamente pelo corpo da requisição (Body) em formato JSON, evitando exposição na URL.

### Respostas da rota `/reserva`

- **201 Created:** Reserva realizada com sucesso e o estoque do livro é reduzido em 1 unidade.
- **400 Bad Request:** Livro sem estoque ou erro de validação (como ausência do nome do aluno).
- **404 Not Found:** O ID informado não corresponde a nenhum livro cadastrado.

### Segurança e Persistência

- O acesso direto à rota `/livros` é protegido por uma variável global `logado`, iniciada como `false`. Caso não exista autenticação prévia, o servidor retorna erro de acesso.

- Todos os dados da aplicação permanecem apenas na memória RAM do processo Node.js. Portanto, sempre que o servidor for reiniciado:
  - o estoque dos livros volta ao estado inicial;
  - o usuário deverá realizar login novamente.

---

# 🧪 Casos de Teste Homologados

Os testes abaixo cobrem todas as respostas previstas pelo contrato da API e estão disponíveis na coleção **BookSense.postman_collection.json**.

| # | Requisição | Método / Rota | Payload | Resultado Esperado |
|---|------------|---------------|---------|--------------------|
| **1** | Listar livros | `GET /livros` | — | `200` — Lista completa com 9 livros. |
| **2** | Filtrar por tipo | `GET /livros?tipo=infantil` | `?tipo=infantil` | `200` — Retorna apenas os livros infantis. |
| **3** | Filtro inexistente | `GET /livros?tipo=estrangeiro` | `?tipo=estrangeiro` | `200` — Retorna lista vazia `[]`. |
| **4** | Login válido | `POST /login` | `{ "usuario": "adm", "senha": "booksense123" }` | `200` — Login realizado com sucesso. |
| **5** | Login inválido | `POST /login` | `{ "usuario": "adm", "senha": "errada" }` | `401` — Credenciais inválidas. |
| **6** | Reserva com sucesso | `POST /reserva` | `{ "id": 4, "aluno": "Mosca" }` | `201` — Estoque reduzido em 1 unidade. |
| **7** | Reserva sem aluno | `POST /reserva` | `{ "id": 4 }` | `400` — Erro de validação. |
| **8** | Livro inexistente | `POST /reserva` | `{ "id": 99, "aluno": "Caio" }` | `404` — Livro não encontrado. |
| **9** | Livro esgotado | `POST /reserva` | `{ "id": 6, "aluno": "Yan" }` | `400` — Estoque insuficiente. |

---

# 📬 Homologação com Postman

A coleção de testes está disponível no diretório raiz do projeto.

## Como importar

1. Abra o **Postman**.
2. Clique em **Import**.
3. Selecione o arquivo:

```text
BookSense.postman_collection.json
```

4. Todos os nove cenários de teste estarão prontos para execução, incluindo:
   - métodos GET e POST;
   - cabeçalhos (Headers);
   - corpos (Body) em formato JSON.
