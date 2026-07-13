const express = require('express')
const app = express()

app.use(express.json())

const livros = [
    { id: 1, nome: 'O Pequeno Príncipe', 
      autor: 'Antoine de Saint-Exupéry',  tipo: 'literario', quantidade: 5 },
    { id: 2, nome: 'Dom Casmurro', 
      autor: 'Machado de Assis',          tipo: 'literario', quantidade: 3 },
    { id: 3, nome: 'Harry Potter e a Pedra Filosofal',
      autor: 'J. K. Rowling',             tipo: 'literario', quantidade: 4 },
    { id: 4, nome: 'Diário de um Banana', 
      autor: 'Jeff Kinney',               tipo: 'infantil',  quantidade: 2 },
    { id: 5, nome: 'O Menino Maluquinho', 
      autor: 'Ziraldo',                   tipo: 'infantil',  quantidade: 3 },
    { id: 6, nome: 'Turma da Mônica - Coleção Gibis', 
      autor: 'Maurício de Sousa',         tipo: 'infantil',  quantidade: 0 },
    { id: 7, nome: 'Clean Code', 
      autor: 'Robert C. Martin',          tipo: 'tecnico',   quantidade: 2 },
    { id: 8, nome: 'Estruturas de Dados e Algoritmos em Java',
      autor: 'Robert Lafore',             tipo: 'tecnico',   quantidade: 4 },
    { id: 9, nome: 'Introdução à Programação com JavaScript',
      autor: 'Marijn Haverbeke',          tipo: 'tecnico',   quantidade: 1 },
]

var logado = false
const USUARIO_PADRAO = 'adm'
const SENHA_PADRAO = 'booksense123'

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/livros', (req, res) => {
    const tipo = req.query.tipo

    if (!logado) {
        return res.status(401).json({ erro: 'Usuário não autenticado.' })
    }

    if (!tipo) {
        return res.status(200).json(livros)
    }

    const filtrados = []
    for (var i = 0; i < livros.length; i++) {
        if (livros[i].tipo === tipo) {
            filtrados.push(livros[i])
        }
    }

    res.status(200).json(filtrados)
})

app.post('/login', (req, res) => {
    const usuario = req.body.usuario
    const senha = req.body.senha

    if (usuario === USUARIO_PADRAO && senha === SENHA_PADRAO) {
        logado = true;
        res.status(200).json({ mensagem: 'Login realizado com sucesso!' })
    } else {
        res.status(401).json({ erro: 'Usuário ou senha incorretos.' })
    }
})

app.post('/reserva', (req, res) => {
    const id = req.body.id
    const aluno = req.body.aluno

    if (!id || !aluno) {
        return res.status(400).json({ erro: 'Envie id e aluno.' })
    }

    var livro = null
    for (var i = 0; i < livros.length; i++) {
        if (livros[i].id === id) {
            livro = livros[i]
        }
    }

    if (livro === null) {
        return res.status(404).json({ erro: 'Livro não encontrado.' })
    }

    if (livro.quantidade <= 0) {
        return res.status(400).json({ erro: 'Não há exemplares disponíveis.' })
    }

    livro.quantidade -= 1

    const dataDevolucao = new Date()                                  // Vê a data atual
    dataDevolucao.setDate(dataDevolucao.getDate() + 15)               // Soma 15 dias
    const dataFormatada = dataDevolucao.toLocaleDateString('pt-BR')   // Formata em dd/mm/aaaa

    res.status(201).json({
        mensagem: 'Reserva registrada para ' + aluno,
        livro: livro.nome,
        restante: livro.quantidade,
        prazoDevolucao: dataFormatada,
    })
})

app.listen(3000, () => {
    console.log('BookSense rodando em http://localhost:3000')
})
