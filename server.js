const express = require('express');
const app = express();
swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.json());

const todos = [];

// localhost:3000/todos
app.get('/todos', (req, res) => {
    res.json(todos);
})


app.get('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) {
        res.status(404).json("ID not found")
        //res.status(404).send({message: "ID not found"})
    } else {
        res.json(todo);
    }
})

app.post('/todos', (req, res) => {
    let maxId = 0;

    todos.forEach(todo => {
        if(todo.id > maxId){
            maxId = todo.id;
        }
    })

    const newTodo = {
        id: maxId + 1,
        task: req.body.task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
})

app.delete('/todos/:id', (req, res) => {
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (index !== -1) { // wenn index nicht gefunden wird mit findIndex
        todos.splice(index, 1);
        res.status(204).send()
        //res.json(todos);
    } else {
        res.status(404).send({ message: 'Task not found!' })
    }

})

// ändern & aktualisieren
app.put('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));

    if (!todo) {
        res.status(404).send({ message: 'Task not found!' })
    } else {
        todo.task = req.body.task
        res.json(todo);
    }

})


app.listen(3000, () => {
    console.log("server running on http://localhost:3000")
    console.log("Swagger docs available at http://localhost:3000/api-docs")
})