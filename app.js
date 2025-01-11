const express = require('express');
const app = express(); // nosso servidor 
app.use(express.json()) // informando que por padrão, toda nossa aplicação irá utilizar JSON ao trocar dados
const port = 3000; // nossa porta para acessar o servidor / mais port 3000 a diante

const { v4: uuidv4 } = require('uuid');

const users = []

// MIDDLEWARE
// const myFirstMiddleware = (request, response, next) => {
//     console.log('Fui chamado.'); // sempre executa primeiro

//     next() // continua o fluxo da aplicação, no caso, executar o endpoint que foi requisitado

//     console.log('Fluxo da aplicação finalizado!'); // depois que o fluxo da aplicação finaliza, ele volta ao middleware e continua a execução após o next

// }

const checkUserId = (req, res, next) => {
    // (( verificação )) se o id é válido 
    const { id } = req.params // capturando ID específico passado pela URL -> Route params
    const index = users.findIndex((user) => {
        return user.id === id
    })


    if (index < 0) {
        return res.status(404).json({ error: "User not found" })
    }

    req.indexUser = index;
    req.idUser = id; // PRIMEIRO

    next() // CONTINUA FLUXO -> VAI PRA ROTA QUE FOI CHAMADA

    console.log('Finalizei o fluxo.'); // ACABANDO DE EXECUTAR A ROTA CHAMADA, VOLTA E EXIBE A MSG NO CONSOLE

}



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

app.put('/users/:id', checkUserId, (req, res) => {

    const { name, login, pass } = req.body
    const { indexUser, idUser } = req

    const updateUser = { id: idUser, name, login, pass }


    // retorna o usuário de ID igual ao que passei pelas Route params, retornando, findIndex pega a posição desse usuário perante ao array

    users[indexUser] = updateUser
    // atualiza o user capturado pelo ID, pelo mesmo user, porém atualizado. Essas atualizações são enviadas pelo Body


    return res.json(updateUser)
})

app.delete('/users/:id', checkUserId, (req, res) => {
    const { indexUser } = req

    console.log(indexUser)
    users.splice(indexUser, 1)
    return res.status(204).json()
})


// associando nosso Servidor à porta, e assim que rodar essa linha de código, server vai upar na porta criada e assim que upar uma msg aparecerá no Console
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
