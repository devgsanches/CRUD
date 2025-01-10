const express = require('express');
const app = express(); // nosso servidor 
app.use(express.json()) // informando que por padrão, toda nossa aplicação irá utilizar JSON ao trocar dados
const port = 3000; // nossa porta para acessar o servidor / mais port 3000 a diante

const { v4: uuidv4 } = require('uuid');

const users = []

// const myFirstMiddleware = (request, response, next) => {
//     console.log('Fui chamado');

// } // parou minha requisição, para que o fluxo ocorra normalmente..:

// MIDDLEWARE
const myFirstMiddleware = (request, response, next) => {
    console.log('Fui chamado.'); // sempre executa primeiro

    next() // continua o fluxo da aplicação, no caso, executar o endpoint que foi requisitado

    console.log('Fluxo da aplicação finalizado!'); // depois que o fluxo da aplicação finaliza, ele volta ao middleware e continua a execução após o next

}

app.use(myFirstMiddleware)


// Rotas da aplicação - endpoints - (envio/edit de dados)

app.get('/users', (req, res) => {
    console.log('next() - A rota foi chamada.');

    return res.json(users)
    // users por definição já é um array, então não precisamos indicar nada ao JSON, pois o mesmo aceita {} and [].
})

app.post('/users', (req, res) => {
    const { name, login, pass } = req.body
    const user = { id: uuidv4(), name, login, pass }

    users.push(user)
    return res.status(201).json(user)
})

app.put('/users/:id', (req, res) => {
    const { id } = req.params // capturando ID específico passado pela URL -> Route params
    const { name, login, pass } = req.body

    const updateUser = { id, name, login, pass }

    const index = users.findIndex((user) => {
        return user.id === id
    }
    )
    // retorna o usuário de ID igual ao que passei pelas Route params, retornando, findIndex pega a posição desse usuário perante ao array

    users[index] = updateUser
    // atualiza o user capturado pelo ID, pelo mesmo user, porém atualizado. Essas atualizações são enviadas pelo Body

    if (index < 0) {
        res.status(404).json({ error: "User not found" })
    }

    return res.json(updateUser)
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params

    const index = users.findIndex((e) => {
        return e.id === id
    })

    if (index < 0) {
        return res.status(404).json({ error: "User not found" })
    }


    users.splice(index, 1)
    return res.status(204).json()
})


// associando nosso Servidor à porta, e assim que rodar essa linha de código, server vai upar na porta criada e assim que upar uma msg aparecerá no Console
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
