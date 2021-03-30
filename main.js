const data = {
    todoList: [{
        id: 0,
        title: "thisCardIsTheDefaultCard",
        color: "yellow",
        priority: "high",
        state: "undone",
        isPinned: true
    }]
}
const priorityValues = {high: 2, medium: 1, low: 1}
let todoListCopy = data.todoList
let dependencies = []

Object.defineProperty(data, 'todoList', {
    get() {
        trackItem()
        return todoListCopy
    },
    set(value) {
        todoListCopy = value
        triggerItem()
    }
})

function trackItem() {
    if (currDependency) {
        dependencies.push(currDependency)
    }
}

function triggerItem() {
    dependencies.forEach(fn => fn())
}

let currDependency = null

function observe(fn) {
    currDependency = fn
    fn()
    currDependency = null
}

function dep() {
    // console.log(data.todoList)
    return data.todoList
}

observe(dep);

function getArrayCopy() {
    data.todoList = [...todoListCopy]
}

function createRandomId(num) {
    let rand = ''
    for (let i = 0; i < num; i++) {
        rand += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))
    }
    return rand
}

// console.log(createRandomId(10))

function addTodo(cardName, cardColor, cardPriority) {
    const todo = {
        id: createRandomId(10),
        title: cardName,
        color: cardColor,
        priority: cardPriority,
        state: "undone",
        isPinned: false
    }
    data.todoList = [...todoListCopy, todo]
}

// console.log("add to do test;")
addTodo("yasmin", "green", "high")
addTodo("rosa", "green", "medium")
addTodo("sahar", "green", "low")
addTodo("farid", "green", "high")
addTodo("goli", "green", "medium")
addTodo("ahmadReza", "red", "low")
addTodo("ehsan", "yellow", "high")

// console.log(data.todoList)

function removeTodo(id) {
    for (let i = 0; i < data.todoList.length; i++) {
        if (data.todoList[i].id === id) {
            todoListCopy.splice(i, 1)
            getArrayCopy()
            break
        }
    }
}

// console.log("remove test")
removeTodo(data.todoList[1])

function changeState(id) {
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            if (todoListElement.state === "done") {
                todoListElement.state = "undone"
                getArrayCopy()
                let temp
                temp = todoListElement
                removeTodo(id)
                data.todoList = [temp, ...todoListCopy]
                // console.log("changed to undone " + `${temp.id}`)
                break
            }
            if (todoListElement.state === "undone") {
                todoListElement.state = "done"
                getArrayCopy()
                let temp
                temp = todoListElement
                removeTodo(id)
                data.todoList = [...todoListCopy, temp]
                // console.log("changed to done " +  `${todoListElement.id}`)
                break
            }
            break
        }
    }
}

// console.log("change state test")
// changeState(data.todoList[2].id)

function pin(id) {
    for (const todoListElement of data.todoList) {
        // console.log(todoListElement.id, id)
        if (todoListElement.id === id) {
            if (todoListElement.isPinned === false) {
                todoListElement.isPinned = true
                removeTodo(id)
                data.todoList = [todoListElement, ...todoListCopy]
                break
            }
            if (todoListElement.isPinned === true) {
                todoListElement.isPinned = false
                removeTodo(id)
                addTodo(todoListElement.name, todoListElement.color, todoListElement.priority)
                break
            }
        }
    }
}

// console.log("pin test")
// console.log(data.todoList)
pin(data.todoList[1].id)

function sort() {
    const {pinned, notPinned, done} = data.todoList.reduce((prev, curr) => {
        if (curr.isPinned) {
            return {...prev, pinned: [...prev.pinned, curr]}
        } else if (curr.state === "done") {
            return {...prev, done: [...prev.done, curr]}
        } else {
            return {...prev, notPinned: [...prev.notPinned, curr]}
        }
    }, {pinned: [], notPinned: [], done: []})
    const sortedList = notPinned.sort((first, second) => {
            if (priorityValues[first.priority] > priorityValues[second.priority]) {
                // console.log("return 1")
                return -1
            }
            if (priorityValues[first.priority] < priorityValues[second.priority]) {
                // console.log("return -1")
                return 1
            } else {
                // console.log("return 0")
                return 0
            }
        }
    )
    todoListCopy = [...pinned, ...sortedList, ...done]
    // console.log(data.todoList)
    // console.log("sorted successfully")
}

sort();

function renderDom() {
    const container = document.querySelector(".to-do-container")
    container.innerHTML = " "
    data.todoList.forEach(e => {
        const todoCard = document.createElement("div")
        todoCard.innerText = `${e.title} ${e.priority} ${e.color} ${e.state} ${e.isPinned} ${e.id}`
        todoCard.id = e.id

        const pinButton = document.createElement("button")
        pinButton.innerHTML = '<i class="fas fa-thumbtack"></i>'
        pinButton.classList.add("pin-button")
        todoCard.appendChild(pinButton)
        pinButton.onclick = () => pin(e.id)

        const checkButton = document.createElement("button")
        checkButton.innerHTML = '<i class="fas fa-check"></i>'
        checkButton.classList.add("check-button")
        todoCard.appendChild(checkButton)
        checkButton.onclick = () => changeState(e.id)

        const deleteButton = document.createElement("button")
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
        deleteButton.classList.add("delete-button")
        todoCard.appendChild(deleteButton)
        deleteButton.onclick = () => removeTodo(e.id)

        if (e.color === "yellow") {
            todoCard.style.backgroundColor = "orange";
            todoCard.classList.add("bg-is-yellow")
        }

        if (e.color === "red") {
            todoCard.style.backgroundColor = "#ED553B";
            todoCard.classList.add("bg-is-red")
        }

        if (e.color === "green") {
            todoCard.style.backgroundColor = "forestgreen";
            todoCard.classList.add("bg-is-green")
        }

        if (e.state === "done") {
            checkButton.innerHTML = '<i class="fas fa-times"></i>'
        }

        if (e.state === "undone") {
            checkButton.innerHTML = '<i class="fas fa-check"></i>'
        }

        if (e.isPinned === true) {
            pinButton.style.color = "black"
        }

        if (e.isPinned === false) {
            pinButton.style.color = "white"
        }

        container.appendChild(todoCard)
        todoCard.classList.add("todo-card-style")
    })
}

observe(sort)
observe(renderDom)

const sortGreenButton = document.querySelector(".green-button")
sortGreenButton.addEventListener('click', showGreenCards)

function showGreenCards() {
    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-green").forEach( e =>(e.style.display = 'block'))
}

const sortRedButton = document.querySelector(".red-button")
sortRedButton.addEventListener('click', showRedCards)

function showRedCards() {
    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-red").forEach( e =>(e.style.display = 'block'))
}

const sortYellowButton = document.querySelector(".yellow-button")
sortYellowButton.addEventListener('click', showYellowCards)

function showYellowCards() {
    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-yellow").forEach( e =>(e.style.display = 'block'))
}