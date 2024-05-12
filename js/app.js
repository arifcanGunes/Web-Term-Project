"use strict"

let gorevListesi = [];

if (localStorage.getItem("taskList") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("taskList"));
}


let editTaskId;
let isEditTask = false;
 //take document object 
let input = document.getElementById("taskInput");
let addBtn = document.getElementById("add-task-button");
let btnClear = document.getElementById("clearAll");
let spans = document.querySelectorAll(".status span");

function updateSpanStatus() {
    for (let span of spans) {
        span.addEventListener("click", () => {
            document.querySelector("span.active").classList.remove("active");
            span.classList.add("active");
            let spanId = span.id;
            showTask(spanId);
        });
    }
}
showTask("all");
updateSpanStatus();

//list task fır filter
function showTask(filter) {
    let tasks = document.querySelector(".tasks");
    tasks.innerHTML = "";
    if (gorevListesi.length == 0) {
        tasks.innerHTML = "<p class='empty'>Görev listeniz boş</p>";
    }
    else {
        for (let gorev of gorevListesi) {
            let completed = gorev.status == "completed" ? "checked" : "";
            if (gorev.status == filter || filter == "all") {
                let task = `
                    <div class="task">
                        <div class="left-side">
                            <input type="checkbox" onclick="updateStatus(this)" class="task-check" ${completed} id="${gorev.id}">
                            <label for="${gorev.id}" class="gorevName">${gorev.name}</label>
                        </div>
                        <div class="date">
                            <span class="date">${gorev.dateTime}</span>
                            <span class="hour">${gorev.hour}</span>
                        </div>
                        <div class="icons">
                            <a onclick="deleteTask(${gorev.id})"><i class="fa-solid fa-trash deleteIcon"></i></a>
                            <a onclick="editTask(${gorev.id},'${gorev.name}')"><i class="fa-solid fa-pen editIcon"></i></a>
                        </div>
                    </div>
                `;
                tasks.insertAdjacentHTML("beforeend", task);
            }
        }
    }
}

// add new task button
addBtn.addEventListener("click", newTask);
input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        addBtn.click();
    }
});

//delete task by id
function deleteTask(id) {
    let deletedIndex;
    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deletedIndex = index;
        }
    }
    gorevListesi.splice(deletedIndex, 1);
    localStorage.setItem("taskList", JSON.stringify(gorevListesi));
    showTask("all");
}


//add or edit the task
function newTask() {
    document.querySelector("span.active").classList.remove("active");
    for (let span of spans) {
        if (span.id == "all") {
            span.classList.add("active");
        }
    }
    let inputValue = input.value;
    if (inputValue.trim() == "") {
        alert("Lütfen bir görev ismi giriniz!");
    }
    else {
        var currentDate = new Date().toLocaleDateString();
        var currentHour = new Date().toLocaleTimeString();
        if (!isEditTask) {
            if (gorevListesi.length > 0) {
                let lastId = gorevListesi[gorevListesi.length - 1].id;
                gorevListesi.push({ id: lastId + 1, "name": inputValue, "status": "pending", "dateTime": currentDate, "hour": currentHour });
            }
            else {
                gorevListesi.push({ id: gorevListesi.length + 1, "name": inputValue, "status": "pending", "dateTime": currentDate, "hour": currentHour });
            }
        }
        else {
            for (let gorev of gorevListesi) {
                if (gorev.id == editTaskId) {
                    gorev.name = input.value;
                    gorev.dateTime = currentDate;
                    gorev.hour = currentHour;
                }
                isEditTask = false;
            }
        }
        input.value = "";
        localStorage.setItem("taskList", JSON.stringify(gorevListesi));
        showTask("all");
    }
}


//delete all tasks on the list 
btnClear.addEventListener("click", () => {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("taskList", JSON.stringify(gorevListesi));
    showTask("all");
});


//edit task by id
function editTask(id, taskName) {
    editTaskId = id;
    isEditTask = true;
    input.value = taskName;
    input.focus();

    console.log(id);
    console.log(taskName);
}

//change task status with checkbox
function updateStatus(task) {
    let label = task.parentElement.lastElementChild;
    let durum;
    if (task.checked) {
        durum = "completed";
    }
    else {
        durum = "pending";
    }
    for (let gorev of gorevListesi) {
        if (gorev.id == task.id) {
            gorev.status = durum;
        }
    }

    showTask(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(gorevListesi));
}