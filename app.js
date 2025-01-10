const express = require('express');
const app = express(); // nosso servidor 
app.use(express.json()) // informando que por padrão, o express irá utilizar JSON ao trocar dados
const port = 3000; // nossa porta para acessar o servidor / mais port 3000 a diante

const { v4: uuidv4 } = require('uuid');

const users = []

// Rotas da aplicação - endpoints - (envio/edit de dados)

app.get('/users', (req, res) => {
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
        res.status(404).json({ message: "User not found" })
    }

    return res.json(updateUser)
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params
    const index = users.findIndex((e) => {
        return e.id === id
    })

    if (index >= 0) {
        users.splice(index, 1)
        res.status(204).json()
    } else {
        res.status(404).json({ message: "User Not Found" })
    }


})








// associando nosso Servidor à porta, e assim que rodar essa linha de código, server vai upar na porta criada e assim que upar uma msg aparecerá no Console
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
