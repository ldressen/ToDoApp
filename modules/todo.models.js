class TodoList {

    constructor() {
        this._data = new Map()
        this._counter = 0
    }

    getAllTodos() {
        let todos = []
        for (let [key, val] of this._data) {
            todos.push(val)
        }

        return todos
    }

    getTodo(id) {
        return this._data.get(id)
    }

    addTodo(todo) {
        let newTodo = {
            id: this._counter,
            title: todo,
            done: false
        }

        this._data.set(this._counter, newTodo)
        this._counter++
        return newTodo.id
    }

    removeTodo(id) {
        if (this._data.has(id)) {
            this._data.delete(id)
            return true
        }
        return false
    }

    setDone(id, done) {
        if (this._data.has(id)) {
            let todo = this._data.get(id)
            todo.done = done
        }
    }

    clearDone() {
        for (let [key, val] of this._data) {
            if (val.done === true) {
                this._data.delete(key)
            }
        }
    }

    clear() {
        this._counter = 0
        this._data.clear()
    }

}

module.exports = TodoList // Klasse auf Root-Ebene exportieren