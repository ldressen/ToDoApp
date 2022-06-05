document.addEventListener('DOMContentLoaded', async function() {

    const listNode = document.getElementById('list') // id der unordered list im HTML
    const inputEintrag = document.getElementById('inputEintrag')
    // Einfügen eines neuen Todos (POST /todos) &
    // Hinzufügen des Todos auf der Website (Aufruf Funktion: addTodo)
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
            console.log(data)

        }
    }

    function getDoneClickHandler(itemNode) {
        return async function(){
            // Ändern (done/undone) eines ToDos im Backend und auf der Website
            // Frontend
            itemNode.style.textDecoration = "line-through"
            itemNode.querySelector('.todo_check').disabled = true
            // Backend
            let requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {"op": "replace",
                            "path": "/done",
                            "value": true})

            }
            let response = await fetch('/todos/' + itemNode.id, requestOptions)
            let data = await response.json()
            console.log(data)
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
        listItem.querySelector('.todo_check').addEventListener('click', getDoneClickHandler(listItem))
        listItem.querySelector('.delete_links').addEventListener('click', getDeleteClickHandler(listItem))
    }

    // Alle ToDos laden (Route /todos sollte ein Array mit JSON-Objekten zurückgeben) &
    // auf der Website anzeigen (Iteriere über alle JSON-Objekte und rufe addTodo auf)
    async function loadAll() {

        let response = await fetch('/todos')
        //liefert keine JSON Objekte zurück, kann mir aber nicht erklären warum
        let data = await response
        for(const todo of data){
            await addTodo(data)
        }
    }


    // Alle erledigten ToDos löschen &
    // auf der Website entfernen
    document.getElementById('deleteChecked').addEventListener('click', async function (event) {
        let listItem = listNode.getElementsByTagName("li")
        for(let elem of listItem){
            if(elem.querySelector(".todo_check").checked){
                // getDeleteClickHandler direkt zu benutzen funktioniert irgendwie nicht
                elem.parentNode.removeChild(elem)
                let requestOptions = {
                    method: "DELETE",
                    headers: { 'Content-Type': 'text/plain'}

                }
                let response = await fetch('/todos/' + elem.id, requestOptions)
                let data = await response.text()
            }
        }
    })

    // Bei Beginn alle Einträge laden
    await loadAll();
})