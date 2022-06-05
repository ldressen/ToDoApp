document.addEventListener('DOMContentLoaded', async function() {

    const listNode = document.getElementById('list') // id der unordered list im HTML
    const inputEintrag = document.getElementById('inputEintrag')

    document.getElementById('button_save').addEventListener('click', async function (event) {

        let requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'text/plain' },
            body: inputEintrag.value
        }
        let response = await fetch('/todos', requestOptions)
        let toDo = await response.json()
        await addTodo(toDo)
    })

    function getDeleteClickHandler(itemNode) {
        return async function(){
            // Löschen im Frontend
            itemNode.parentNode.removeChild(itemNode)
            // Löschen im Backend
            let requestOptions = {
                method: "DELETE",
                headers: { 'Content-Type': 'text/plain'}

            }
            let response = await fetch('/todos/' + itemNode.id, requestOptions)
            let data = await response.text()


        }
    }

    function getDoneClickHandler(itemNode) {
        return async function(){
            itemNode.style.textDecoration = "line-through"
            itemNode.querySelector('.todo_check').disabled = true

            let requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    {"op": "replace",
                            "path": "/done",
                            "value": true}])

            }
            let response = await fetch('/todos/' + itemNode.id, requestOptions)


        }
    }

    // Fügt ein ToDo dem DOM hinzu
    // Erwartet ein Objekt, wie z.B.:
    // { title : "Einkaufen gehen", done : false, id : 10 }
    // hier muss die Template-Engine genutzt werden
    // und die Click-Handler an die Klassen aus dem Template gebunden werden
    async function addTodo(item) {
        let response = await fetch('templates/list_tpl.html')
        let template = await response.text()

        let rendered = Mustache.render(template, item)
        listNode.insertAdjacentHTML('beforeend', rendered)

        let listItem = document.getElementById(item.id)
        if(item.done){
            listItem.style.textDecoration = "line-through"
            listItem.querySelector('.todo_check').disabled = true
            listItem.querySelector('.todo_check').checked = true
        }
        listItem.querySelector('.todo_check').addEventListener('click', getDoneClickHandler(listItem))
        listItem.querySelector('.delete_links').addEventListener('click', getDeleteClickHandler(listItem))
    }

    // Alle ToDos laden (Route /todos sollte ein Array mit JSON-Objekten zurückgeben) &
    // auf der Website anzeigen (Iteriere über alle JSON-Objekte und rufe addTodo auf)
    async function loadAll() {

        let response = await fetch('/todos')
        let data = await response.json()
        for(let todo of data){
            await addTodo(todo)
        }
    }


    // Alle erledigten ToDos löschen &
    // auf der Website entfernen
    document.getElementById('deleteChecked').addEventListener('click', async function (event) {
        let requestOptions = {
            method: "DELETE"
        }
        let data = await fetch("/todos?done=true", requestOptions)
        while (listNode.firstChild){
            listNode.removeChild(listNode.firstChild)
        }
        await loadAll()
    })

    // Bei Beginn alle Einträge laden
    await loadAll();
})