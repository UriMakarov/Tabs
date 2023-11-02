export const sortByDoneButton = document.querySelector(".todo__sort-button.done");
export const sortByTimeButton = document.querySelector(".todo__sort-button.time");
export const todoTextInput = document.querySelector(".todo__text-input");
export const todoTimeInput = document.querySelector(".todo__time-input");
export const todoList = document.querySelector(".todo__list");
export const todoForm = document.querySelector(".todo__form");
export const timeValue = document.querySelector(".todo__time-value");

const SORT_TYPES = {
    asc: "asc",
    desc: "desc",
};

let sortType = null;

export class LStorage {
    // constructor(todos) {
    //     this.todos = todos;
    // }

    getTodos() {
        const todos = localStorage.getItem("todos");
        const parsedTodos = JSON.parse(todos);
        return parsedTodos;
    }

    setTodos(todos) {
        const todosString = JSON.stringify(todos);
        localStorage.setItem("todos", todosString);
    }
}

export class TodoList {
    constructor(storage) {
        this.storage = storage;
        this.todos = this.storage.getTodos() || [];
    
    }
    sortByKey = (key) => {
        if (!sortType || sortType === SORT_TYPES.desc) {
            this.todos.sort(function (a, b) {
                return Number(a[key]) - Number(b[key]);
            });
            sortType = SORT_TYPES.asc;
        } else {
            this.todos.sort(function (a, b) {
                return Number(b[key]) - Number(a[key]);
            });
            sortType = SORT_TYPES.desc;
        }
        this.render();
    }

    init = () => {
        this.render();

        todoForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const todoText = todoTextInput.value;
            const todoTime = todoTimeInput.value;
            const trimmedText = todoText.trim();

            const todo = {
                id: Date.now(),
                text: trimmedText,
                done: false,
                time: todoTime,
            };

            if (trimmedText) {
                this.todos.push(todo);

                todoTextInput.value = "";
                todoTimeInput.value = "";
                todoTextInput.focus();
            }

            this.render();
        });
    };

    render = () => {
        const todosNodes = this.todos.map(this.createTodo);

        todoList.innerHTML = "";

        todosNodes.forEach(function (todoNode) {
            todoList.appendChild(todoNode);
        });

        const timeSumNonCompletedTodos = this.todos.reduce(function (acc, curr, idx) {
            if (!curr.done) {
                acc += Number(curr.time);
            }

            return acc;
        }, 0);

        this.storage.setTodos(this.todos);

        timeValue.textContent = timeSumNonCompletedTodos;
    };

    todoItemListener = (event) => {
        const current = event.target;
        const parentNode = current.closest("li");
        const isDeleteButton = event.target.closest(".todo__remove-button");
        const isDoneButton = event.target.closest(".todo__done-button");
        const parentNodeId = parentNode.id;

        if (isDeleteButton) {
            this.todos = this.todos.filter((todo) => {
                return todo.id !== Number(parentNodeId);
            });

            this.render();
        } else if (isDoneButton) {
            this.todos.forEach((todo) => {
                if (todo.id === Number(parentNodeId)) {
                    todo.done = !todo.done;
                }
            });

            this.render();
        }
    };

    createTodo = (todo) => {
        const liElement = document.createElement("li");

        liElement.id = todo.id;
        liElement.classList.add("todo__item");

        if (todo.done) {
            liElement.classList.add("done");
        }

        const todoTemplate = `
      <span class="todo__item-text">${todo.text}</span>
      ${todo.time ? `<span class="todo__item-time">${todo.time}</span>` : ""}
      <div class="todo__controls">
        <button class="todo__done-button">Выполнено</button>
        <button class="todo__remove-button">Удалить</button>
      </div>
    `;

        liElement.innerHTML = todoTemplate;

        liElement.addEventListener("click", this.todoItemListener);

        return liElement;
    };
}

