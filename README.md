# BookSense — Sistema de Gerenciamento de Biblioteca

O **BookSense** é uma aplicação completa (Full Stack) voltada para o gerenciamento de acervos literários e reservas de livros escolares. O projeto conta com um servidor robusto desenvolvido em Node.js com Express e uma interface web moderna baseada em Glassmorphic Design.

## 👥 Equipe
- Caio Augusto Faria Machado
- Iury Gonçalves de Souza
- Yan Gabardo Souza

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### Passo a Passo
1. Baixe os arquivos do repositório (`app.js`, `index.html` e `BookSense.postman_collection.json`) para uma mesma pasta no seu computador.
2. Abra o terminal nessa pasta e instale o framework Express rodando:
   ```bash
   npm install express

```

3. Inicie o servidor com o comando:
```bash
node app.js

```

4. Abra o seu navegador e acesse a aplicação pelo endereço:
```
http://localhost:3000

```

---

## 🛣️ Especificação da API (Endpoints)

| Método | Endpoint | Entrada | Resposta | Status | Descrição |
| --- | --- | --- | --- | --- | --- |
| **GET** | `/` | — | Página HTML | `200` | Renderiza a tela inicial/Login. |
| **GET** | `/livros` | `tipo` (Query URL) | Lista em JSON ou HTML | `200` / `401` | Retorna o acervo ou barra o acesso se deslogado. |
| **POST** | `/login` | `usuario`, `senha` (Body JSON) | Objeto de Sucesso / Erro | `200` / `401` | Autentica o usuário administrador. |
| **POST** | `/reserva` | `id`, `aluno` (Body JSON) | Confirmação de Reserva | `201` / `400` / `404` | Deduz uma unidade do acervo e agenda o prazo. |

---

## 🧠 Decisões de Projeto e Regras de Negócio

* **Segurança de Rotas:** O acesso direto à rota `/livros` pelo navegador é restrito. É utilizada uma variável booleana global (`logado`) no servidor que inicia estritamente como `false`. Se uma tentativa de acesso for detectada sem login prévio, o servidor bloqueia e exibe uma página de "Acesso Negado".
* **Estado de Sessão:** O estado `logado` reside unicamente na memória RAM do processo Node.js. Sendo assim, **toda vez que o servidor for reiniciado, será obrigatório realizar o login novamente**, garantindo a segurança contínua do acervo.
* **Filtros e Visibilidade:** O parâmetro `tipo` é enviado via Query String por se tratar de um filtro público de busca. Foi adicionado o filtro experimental `estrangeiro` na interface, simulando cenários reais de busca sem correspondência.
* **Privacidade de Dados:** Credenciais de acesso (`usuario` e `senha`) são transmitidas exclusivamente de forma privada através do corpo (Body) no formato JSON.
* **Persistência Temporária:** Os dados de estoque e reservas são alocados em um array volátil na memória, resetando aos valores padrões de fábrica a cada reinicialização da API.

---

## 🧪 Casos de Teste Homologados

Abaixo estão listados os 9 cenários estruturados que cobrem 100% das respostas do contrato, todos configurados e prontos no arquivo `BookSense.postman_collection.json`.

| # | Caso de Teste | Método / Rota | Payload (Body / Query) | Resultado Esperado (Status) |
| --- | --- | --- | --- | --- |
| **1** | Lista Completa | `GET /livros` | — | `200 OK` — Array JSON com os 9 itens. |
| **2** | Filtro Categoria Infantil | `GET /livros` | `?tipo=infantil` | `200 OK` — Apenas os 3 livros correspondentes. |
| **3** | Categoria Inexistente | `GET /livros` | `?tipo=estrangeiro` | `200 OK` — Retorna um array vazio `[]`. |
| **4** | Login com Sucesso | `POST /login` | `{ "usuario": "adm", "senha": "booksense123" }` | `200 OK` — Altera estado para logado. |
| **5** | Login com Senha Incorreta | `POST /login` | `{ "usuario": "adm", "senha": "errada" }` | `401 Unauthorized` — Acesso negado. |
| **6** | Reserva Executada | `POST /reserva` | `{ "id": 4, "aluno": "Mosca" }` | `201 Created` — Deduz estoque e exibe prazo. |
| **7** | Falha de Validação | `POST /reserva` | `{ "id": 4 }` | `400 Bad Request` — Erro: Aluno obrigatório. |
| **8** | Livro Não Encontrado | `POST /reserva` | `{ "id": 99, "aluno": "Caio" }` | `404 Not Found` — ID inexistente no acervo. |
| **9** | Estoque Insuficiente | `POST /reserva` | `{ "id": 6, "aluno": "Yan" }` | `400 Bad Request` — Item esgotado (Qtd: 0). |

---

## 📬 Testando os Endpoints com o Postman

Para facilitar a avaliação técnica das rotas, foi disponibilizado o arquivo de coleção no diretório raiz:

1. Abra o **Postman**.
2. Clique no botão **Import** (Importar) localizado no canto superior esquerdo.
3. Selecione e carregue o arquivo `BookSense.postman_collection.json`.
4. Todos os 9 cenários listados acima estarão organizados com métodos, cabeçalhos (`Headers`) e corpos em formato JSON prontos para envio.

```

```