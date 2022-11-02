import Sortable from 'sortablejs';

var taskInput = document.getElementById('taskInput');
var taskForm = document.getElementById('taskForm');
var taskCounter = document.getElementById('count');
var taskCount = 0;
var menuItems = document.querySelectorAll('.menu-item');
var taskList = document.getElementById('taskList');
var sortable = Sortable.create(taskList, {
  animation: 150,
  filter: ".delete-task, input",
});

let initTasks = function () {
  tasks = new Map(JSON.parse(localStorage.tasks));
  i = 0;
  for (let [key, value] of tasks.entries()) {
    i ++;
    if (value === 'incomplete') {
      var taskStatus = false;
    } else {
      var taskStatus = true;
    }
    document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="' + taskStatus + '"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check' + i + '"><label class="form-check-label" for="check' + i + '"></label>' + key + '</div><svg class="delete-task" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></li>';
  };
}

if(localStorage.getItem('tasks') == null){
  var tasks = new Map();
}else{
  initTasks();
}

let checkCompleted = function () {
  var getCheckboxes = document.querySelectorAll("[type=checkbox]");
  i = -1;
  for (let [key, value] of tasks.entries()) {
    i ++;
    if (value === 'completed') {
     getCheckboxes[i].checked = true;
    }
  };
}
checkCompleted();

let countIncompleteTasks = function () {
  i = 0;
  for (let value of tasks.values()) {
    if (value === 'incomplete') {
      i++;
    }
  };
  taskCount = i;
}
countIncompleteTasks();


let displayTaskCount = function () {
  taskCounter.innerHTML = taskCount;
}
displayTaskCount();


taskInput.onkeyup = function () {
  if (taskInput.value.length > 0) {
    document.getElementById('addTask').style.display="block";
  } else {
    document.getElementById('addTask').style.display="none";
  }
};

taskForm.onsubmit = function (e) {
  e.preventDefault();
  if (taskInput.value.length > 0) {
    tasks.set(taskInput.value, 'incomplete');
    console.log(tasks);
    localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
    taskInput.value = '';
    document.getElementById('addTask').style.display="none";
    newTask = Array.from(tasks.keys()).pop();
    console.log(newTask);
    document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="false"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check1"><label class="form-check-label" for="check1"></label>' + newTask + '</div><svg class="delete-task" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></li>'
    checkboxes();
    countIncompleteTasks();
    displayTaskCount();
    enableDelete();
  }
};

// COMPLETE TASKS

let checkboxes = function () {
  document.querySelectorAll("[type=checkbox]").forEach(checkbox =>{
    checkbox.addEventListener("click",function(e){
      taskToToggle = this.parentElement.textContent;
      if(this.checked){
        tasks.set(taskToToggle, 'completed');
        this.parentElement.parentElement.setAttribute("aria-checked", "true");
      }
      else{
        this.parentElement.parentElement.setAttribute("aria-checked", "false");
        tasks.set(taskToToggle, 'incomplete');
      }
      countIncompleteTasks();
      console.log(taskCount);
      displayTaskCount();
      localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
      e.stopPropagation();
    })
  })
}

checkboxes();

menuItems.forEach(item =>{ 
  item.addEventListener("click",function() {
      var activeItem = document.getElementsByClassName("active");
      activeItem[0].classList.remove('active');
      item.classList.add('active');
  });
});

// DELETE TASKS

let enableDelete = function () {
  var deleteTask = document.querySelectorAll('.delete-task');
  deleteTask.forEach(task =>{ 
    task.addEventListener("click",function(e) {
      e.stopPropagation();
      var taskToDelete = this.parentElement.children[0].textContent;
      if (confirm('Are you sure you want to delete "' + taskToDelete + '" from you todo list?' )) {
        tasks.delete(taskToDelete);
        localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
        document.getElementById('taskList').innerHTML = '';
        initTasks();
        checkboxes();
        countIncompleteTasks();
        displayTaskCount();
        enableDelete();
      }
    });
  });
}
enableDelete();