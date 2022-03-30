window.onload = (e) => {
    buttonOptions = document.querySelector(".add");
    buttonEdit = document.querySelector(".edit");
    buttonReset = document.querySelector(".reset");
    buttonCancelWt = document.querySelector(".cancel");
    buttonSaveWt = document.querySelector(".save");
    windowReset = document.querySelector(".windowReset");
    windowDelete = document.querySelector(".windowDelete");
    completedTasks = document.querySelectorAll(".completed");

    taskID = 0;
    
    buttonOptions.onclick = (e) => {
        buttonOptions.classList.toggle("rotate");
        buttonEdit.classList.toggle("showEdit");
        buttonReset.classList.toggle("showReset");
    }
    
    if (localStorage.getItem("id") == undefined) {
        id = 0;
        localStorage.setItem("id", id);
    } else {
        id = (localStorage.getItem("id")*1);
    }
    
    buttonEdit.onclick = () => {
        document.querySelector(".windowAddTask").classList.add("showWindow");
        buttonReset.style.pointerEvents = "none";
    }
    
    buttonSaveWt.onclick = () => {
        let isAnyActive = false;

        document.querySelectorAll('.checkbox').forEach(ch => {
            if (ch.checked)
                isAnyActive = true;            
        });

        if (document.getElementById("text").value.trim() != "" && isAnyActive) {
            addTask();
            document.querySelector(".windowAddTask").classList.remove("showWindow");
            buttonReset.style.pointerEvents = "auto";
            readTasks();
        }
    }
    
    buttonCancelWt.onclick = () => {
        document.querySelector(".windowAddTask").classList.remove("showWindow");
        buttonReset.style.pointerEvents = "auto";
    }

    buttonReset.onclick = () => {
        windowReset.classList.add("showWindow");
        buttonEdit.style.pointerEvents = "none";
    }

    windowReset.querySelector(".btnNo").onclick = () => {
        windowReset.classList.remove("showWindow");
        windowDelete.style.zIndex = "-1";
        buttonEdit.style.pointerEvents = "auto";
    }

    windowReset.querySelector(".btnYes").onclick = () => {
        windowReset.classList.remove("showWindow");
        windowDelete.style.zIndex = "-1";
        buttonEdit.style.pointerEvents = "auto";
        reset();
        readTasks();
    }

    readTasks();
    
    document.querySelectorAll(".task").forEach(task => {
        task.onclick = (e) => {

            if (e.target.classList[0] == "task" || e.target.classList[0] == "task-span") {

                document.querySelector(".viewAllTask").classList.add("showWindow");
                buttonReset.style.pointerEvents = "none";
                buttonEdit.style.pointerEvents = "none";
                
                document.querySelector('.task-text').value = task.firstChild.innerText;

                document.querySelector('.close').onclick = (e) => {

                    var taskInfo = {
                        id: task.dataset.id,
                        text: document.querySelector('.task-text').value,
                        completed: JSON.parse(localStorage.getItem(task.dataset.id)).completed,
                        day: JSON.parse(localStorage.getItem(task.dataset.id)).day
                    }
                    
                    buttonEdit.style.pointerEvents = "auto";
                    buttonReset.style.pointerEvents = "auto";
                    
                    localStorage.setItem(taskInfo.id, JSON.stringify(taskInfo));
                    document.querySelector('.viewAllTask').classList.remove('showWindow');
                    
                    task.firstChild.innerText = document.querySelector('.task-text').value;
                    
                }

                document.querySelector('.delTask').onclick = (e) => {
                    windowDelete.classList.add("showWindow");
                    windowDelete.style.zIndex = "3";
                    buttonEdit.style.pointerEvents = "none";
                    buttonReset.style.pointerEvents = "none";
                    taskID = task.dataset.id;
                }
            }
        }
    });
    
    isCompleted();
    

    windowDelete.querySelector(".btnNo").onclick = () => {
        windowDelete.classList.remove("showWindow");
        buttonEdit.style.pointerEvents = "auto";
        buttonReset.style.pointerEvents = "auto";
        windowDelete.style.zIndex = "-1";
    }

    windowDelete.querySelector(".btnYes").onclick = () => {
        windowDelete.classList.remove("showWindow");
        document.querySelector('.viewAllTask').classList.remove("showWindow");
        buttonEdit.style.pointerEvents = "auto";
        buttonReset.style.pointerEvents = "auto";
        windowDelete.style.zIndex = "-1";
        deleteTask(taskID);
        readTasks();
    }
    
}

function isCompleted() {
    document.querySelectorAll(".completed").forEach(completedTask => {
        var obj = JSON.parse(localStorage.getItem(completedTask.dataset.id+""));
    
        if (obj.completed) {
            completedTask.style.backgroundSize = "0px";
            completedTask.style.backgroundColor = "#8dabff";
            setTimeout(() =>{
                completedTask.style.backgroundSize = "20px";
                completedTask.style.backgroundImage = "url(img/dash.svg)";
                completedTask.parentNode.style.backgroundColor = "#000000A3";
            
            }, 400);
        } else {
       
            completedTask.style.backgroundSize = "0px";
            completedTask.style.backgroundColor = "#8DFF95";
            setTimeout(() =>{
                completedTask.style.backgroundSize = "20px";
                completedTask.style.backgroundImage = "url(img/check.svg)";
                completedTask.parentNode.style.backgroundColor = "#111";
            }, 400);
            
        }
        completedTask.onclick = (e) => {
            completeTask(e.target, e.target.parentNode);
        
        }
    });
}


function readTasks() {

    var i = 1;
    
    document.querySelectorAll("* > .content").forEach(content => {
        content.innerHTML = "";
    });

    while (i <= localStorage.getItem("id")) {
        
        if (localStorage.getItem(i) != null) {
            var obj = JSON.parse(localStorage.getItem(i));
            
            div = document.createElement("div");
            div.dataset.id = obj.id;
            div.classList.add("task");

            let span = document.createElement("span");
            span.classList.add('task-span');
            span.innerText = obj.text;

            var completedDiv = document.createElement("div");
            completedDiv.dataset.id = obj.id;
            completedDiv.classList.add("completed");

            div.appendChild(span);
            div.appendChild(completedDiv); 

            document.querySelector("." + obj.day + " > .content").appendChild(div);
        }
        
        document.querySelectorAll(".completed").forEach(completedTask => {
            completedTask.onclick = (e) => {
                completeTask(e.target, e.target.parentNode);
            }
        });

        i++;
    }

    document.querySelectorAll(".task").forEach(task => {
        task.onclick = (e) => {
            if (e.target.classList[0] == "task" || e.target.classList[0] == "task-span") {
                document.querySelector(".viewAllTask").classList.add("showWindow");
                buttonReset.style.pointerEvents = "none";
                buttonEdit.style.pointerEvents = "none";

                document.querySelector('.task-text').value = task.firstChild.innerText;

                document.querySelector('.close').onclick = (e) => {
                    console.log(document.querySelector('.task-text').innerHTML);
                    console.log(JSON.parse(localStorage.getItem(task.dataset.id)));
                    var taskInfo = {
                        id: task.dataset.id,
                        text: document.querySelector('.task-text').value,
                        completed: JSON.parse(localStorage.getItem(task.dataset.id)).completed,
                        day: JSON.parse(localStorage.getItem(task.dataset.id)).day
                    }
                    
                    buttonEdit.style.pointerEvents = "auto";
                    buttonReset.style.pointerEvents = "auto";
                    task.firstChild.innerText = document.querySelector('.task-text').value;
                    
                    localStorage.setItem(taskInfo.id, JSON.stringify(taskInfo));
                    document.querySelector('.viewAllTask').classList.remove('showWindow');
                    
                }
                
                

                document.querySelector('.delTask').onclick = (e) => {
                    windowDelete.classList.add("showWindow");
                    windowDelete.style.zIndex = "3";
                    buttonEdit.style.pointerEvents = "none";
                    buttonReset.style.pointerEvents = "none";
                    taskID = task.dataset.id;
                }
            }
        }
    });

}

function addTask() {
    document.querySelectorAll(".checkbox").forEach(checkbox => {
        if (checkbox.checked) {
            id = (id*1) + 1;
            localStorage.setItem("id", id);

            var taskInfo = {
                id: id,
                text: document.getElementById("text").value,
                completed: false,
                day: checkbox.id
            
            }
            localStorage.setItem(taskInfo.id, JSON.stringify(taskInfo));
            checkbox.checked = false;
        }
    });

    document.getElementById("text").value = "";
}

function deleteTask(id) {
    localStorage.removeItem("" + id);
}

function completeTask(task, taskParent) {
    var obj = JSON.parse(localStorage.getItem(task.dataset.id+""));
    
   if (!obj.completed) {
        task.style.backgroundSize = "0px";
        task.style.backgroundColor = "#8dabff";
        setTimeout(() =>{
            task.style.backgroundSize = "20px";
            task.style.backgroundImage = "url(img/dash.svg)";
            taskParent.style.backgroundColor = "#000000A3";
            
        }, 400);
        
        obj.completed = true;
        
   } else {
       
       task.style.backgroundSize = "0px";
        task.style.backgroundColor = "#8DFF95";
        setTimeout(() =>{
            task.style.backgroundSize = "20px";
            task.style.backgroundImage = "url(img/check.svg)";
            taskParent.style.backgroundColor = "#111";
        }, 400);
        
        obj.completed = false;
        
   }
   
   localStorage.setItem(task.dataset.id, JSON.stringify(obj));
}

function reset() {
    id = 0;
    localStorage.clear();
    localStorage.setItem("id", 0);
}
