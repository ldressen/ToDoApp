const todoList = require('../modules/todo.models')
const express = require('express')
const router = express.Router()
const todos = new todoList()

// GET all todos
router.get('/todos', function (req, res) {
    res.type('application/json');
    res.status(201).json(todos.getAllTodos());
})

router.post('/todos', function (req, res) {
    res.type('text/plain')
    let newTodo = req.body
    let id = todos._counter
    todos.addTodo(newTodo)
    res.setHeader('Location', '/todos' + id)
    res.status(201).json(todos.getTodo(id))
})

router.get('/todos/:id', function (req, res) {
    let id = parseInt(req.params.id)
    if(todos.getTodo(id)){
        res.type('application/json');
        res.status(200).json(todos.getTodo(id));
    }
    else{
        res.type('text/plain')
        res.status(406).send("There is no ToDo with this ID!");
    }

})

router.delete('/todos/:id', function (req, res) {
    let id = parseInt(req.params.id)
    res.type('text/plain')
    if(todos.getTodo(id)){
        todos.removeTodo(id)
        res.status(200).send('Succesfully deleted!');
    }
    else{
        res.status(406).send('Couldnt\'t find the ToDo to delete!');
    }

})

router.delete('/todos?done=true', function (req, res) {
    console.log(todos.getAllTodos())
    todos.clearDone()
    // Aus irgendeinem Grund werden hier alle ToDos gelöscht, ich kann mir aber nicht erklären warum.
    res.type('application/json')
    res.status(200).json(todos.getAllTodos());
})

router.delete('/todos', function (req, res) {
    todos.clear()
    res.type('text/plain')
    res.status(200).send("Successfully deleted all ToDos!")
})

router.patch('/todos/:id', function (req, res) {

    let id = parseInt(req.params.id)
    let value = req.body[0].value
    if(req.body[0].op === 'replace' && req.body[0].path === '/done'){
        res.type('application/json')
        todos.setDone(id, value)
        res.send(todos.getTodo(id))
    }
    else{
        res.type('text/plain')
        res.status(406).send("There is no ToDo with that ID!")
    }



})
module.exports = router;