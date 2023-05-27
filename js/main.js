const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem("tasks")){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((task) => renderTask(task));
}



checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", removeTask);
tasksList.addEventListener("click", checkTask);


function addTask (event) {
    event.preventDefault();//отменяет дефолтное поведение формы(страница не обновляется после нажатия ан кнопку)
    
    //текст задачи из поля ввода
    const taskText = taskInput.value;

    //объект задачи
    const newTask = {
        id: Date.now(),//в качестве id берём время в миллисекундах сейчас
        text: taskText,
        done: false,
    }

    tasks.push(newTask);

    //css class для того что бы в taskHTML > span был нужный класс
    renderTask(newTask);
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
    saveToLocalStorage();
}

function removeTask (event) {

    if(event.target.dataset.action !== "delete") return;

    const parentNode = event.target.closest(".list-group-item");
    parentNode.remove();

    //определяем id задачи
    const id = Number(parentNode.id);

    //находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);
    
    //удаляем задачу из массива по индексу
    tasks.splice(index, 1);
 
    //проверяем есть ли в списке задачи, если нет то показываем "Список пуст"
    // if(tasksList.children.length === 1){
    //     emptyList.classList.remove("none");
    // };
    checkEmptyList();
    saveToLocalStorage();
}

function checkTask (event) {
    if(event.target.dataset.action !== "done") return;

    const parentNode = event.target.closest(".list-group-item");

    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);

    task.done = !task.done;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");


}

function checkEmptyList (){

    if(tasks.length === 0){
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`
        tasksList.insertAdjacentHTML("afterbegin", emptyListElement);
    }

    else{
        const emptyListElement = document.querySelector("#emptyList");
        emptyListElement ? emptyListElement.remove() : null;
    }
}
function saveToLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(task){
    const cssClass = task.done ? "task-title task-title--done" : "task-title";


    const taskHTML = `
                    <li id = "${task.id}"class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>
                    `
    
    // tasksList.innerHTML += taskHTML;
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}