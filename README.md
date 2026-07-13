# Contrato de API - Servidor para Gerenciamento de Biblioteca

## BookSense

### Equipe
- [cite_start]Caio Augusto Faria Machado [cite: 18]
- [cite_start]Iury Gonçalves de Souza [cite: 19]
- [cite_start]Yan Gabardo Souza [cite: 19]

---

## 🛣️ Endpoints

| Método | Endpoint | Entrada | Resposta | Status |
|:-------:|:--------|:---------|:----------|:------:|
| GET | `/` | — | Página HTML | [cite_start]`200` [cite: 20] |
| GET | `/livros` | `tipo` (query URL) | Lista em JSON | [cite_start]`200` [cite: 20] |
| POST | `/login` | `usuario`, `senha` (body JSON) | OK / Erro | [cite_start]`200` / `401` [cite: 20] |
| POST | `/reserva` | `id`, `aluno` (body JSON) | Confirmação | [cite_start]`201` / `400` / `404` [cite: 20] |

---

## 🧠 Decisões de Projeto

- [cite_start]**Filtros Públicos:** O parâmetro `tipo` é enviado na query URL porque funciona como um filtro público de busca no acervo[cite: 22].
- [cite_start]**Dados Privados:** Os campos `usuario` e `senha` são enviados no corpo (body) da requisição em formato JSON por motivos de segurança e privacidade[cite: 24].
- **Respostas de Reserva (`/reserva`):**
  - [cite_start]**201:** Quando a reserva é realizada com sucesso (reduzindo o estoque do livro em 1 unidade)[cite: 25, 28].
  - [cite_start]**400:** Quando o livro existe, mas já está sem estoque/reservado, ou quando há erro de validação (como a ausência do nome do aluno)[cite: 25, 28].
  - [cite_start]**404:** Quando o identificador (`id`) do livro não corresponde a nenhum item existente no acervo[cite: 25, 28].
- **Segurança de Sessão e Volatilidade:** - O sistema usa uma variável lógica global de controle (`logado`) que inicia estritamente como `false`.
  - [cite_start]Todos os dados do acervo e estados de autenticação são guardados exclusivamente em um vetor na memória RAM do servidor[cite: 26]. **Sendo assim, toda vez que o servidor for reiniciado, os dados de estoque voltam ao padrão e o usuário precisará fazer login novamente.**

---

## 🧪 Casos de Teste

| # | Requisição | Resultado Esperado |
|:-:|:-----------|:-------------------|
| 1 | `GET /livros` | [cite_start]`200` — Lista completa (9 itens). [cite: 28] |
| 2 | `GET /livros?tipo=infantil` | [cite_start]`200` — Apenas os 3 livros infantis. [cite: 28] |
| 3 | `GET /livros?tipo=estrangeiro` | [cite_start]`200` — Lista vazia `[]`. [cite: 28] |
| 4 | `POST /login` com `adm / booksense123` | [cite_start]`200` — Login realizado com sucesso. [cite: 28] |
| 5 | `POST /login` com senha incorreta | [cite_start]`401` — Erro de autenticação. [cite: 28] |
| 6 | `POST /reserva` com `{ "id": 4, "aluno": "Mosca" }` | [cite_start]`201` — "Diário de um Banana" reduz o estoque em 1 unidade. [cite: 28] |
| 7 | `POST /reserva` sem o campo `aluno` | [cite_start]`400` — Erro de validação. [cite: 28] |
| 8 | `POST /reserva` com `{ "id": 99, ... }` | [cite_start]`404` — Livro não encontrado. [cite: 28] |
| 9 | `POST /reserva` com `{ "id": 6, ... }` | [cite_start]`400` — Estoque insuficiente. [cite: 28] |

---

## 📬 Homologação com Postman

O repositório inclui o arquivo `BookSense.postman_collection.json`. Ele contém a coleção completa mapeada exatamente com os 9 casos de teste listados acima (configurados com os métodos corretos de POST/GET, payloads e headers). Basta importá-lo no Postman para executar os testes locais.