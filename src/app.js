import Sortable from 'sortablejs';

var taskInput = document.getElementById('taskInput');
var taskForm = document.getElementById('taskForm');
var taskCounter = document.getElementById('count');
var taskCount = 0;
var menuItems = document.querySelectorAll('.menu-item');
var taskList = document.getElementById('taskList');
var toggleIcon = document.getElementById('toggleIcon');
Sortable.create(taskList, {
  animation: 150,
  filter: ".delete-task, input",
});
var statuses = ['incomplete', 'completed'];

let initTasks = function () {
  tasks = new Map(JSON.parse(localStorage.tasks));
  i = 0;
  for (let [key, value] of tasks.entries()) {
    if (statuses.includes(value)) {
      i ++;
      if (value === 'incomplete') {
        var taskStatus = false;
      } else {
        var taskStatus = true;
      }
      document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="' + taskStatus + '"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check' + i + '"><label class="form-check-label" for="check' + i + '"></label>' + key + '</div><svg class="delete-task" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></li>';
    }
  };
}

if(localStorage.getItem('tasks') == null){
  var tasks = new Map();
}else{
  initTasks();
}

let checkCompleted = function () {
  var getCheckboxes = document.querySelectorAll("[type=checkbox]");
  let i = -1;
  for (let [key, value] of tasks.entries()) {
    if (statuses.includes(value)) {
      i ++;
      if (value === 'completed') {
       getCheckboxes[i].checked = true;
      }
    }
  };
}
checkCompleted();

let countIncompleteTasks = function () {
  let i = 0;
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

//ADD TASKS

taskForm.onsubmit = function (e) {
  e.preventDefault();
  if (taskInput.value.length > 0) {
    tasks.set(taskInput.value, 'incomplete');
    console.log(tasks);
    localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
    taskInput.value = '';
    document.getElementById('addTask').style.display="none";
    let newTask = Array.from(tasks.keys()).pop();
    console.log(newTask);
    document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="false"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check1"><label class="form-check-label" for="check1"></label>' + newTask + '</div><svg class="delete-task" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></li>'
    checkboxes();
    countIncompleteTasks();
    displayTaskCount();
    enableDelete();
    checkLength();
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
      rebuildList();
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
      if (confirm('Are you sure you want to delete "' + taskToDelete + '" from your todo list?' )) {
        tasks.delete(taskToDelete);
        localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
        document.getElementById('taskList').innerHTML = '';
        initTasks();
        checkboxes();
        countIncompleteTasks();
        displayTaskCount();
        enableDelete();
        checkCompleted();
        checkLength();
      }
    });
  });
}
enableDelete();

var rebuildList = function() {
  document.getElementById('taskList').innerHTML = '';
  initTasks();
  checkboxes();
  countIncompleteTasks();
  displayTaskCount();
  enableDelete();
  checkCompleted();
  checkLength();
}

document.getElementById('active').addEventListener("click",function() {
  if (statuses != ['incomplete']) {
    statuses = ['incomplete'];
    document.getElementById('taskList').innerHTML = '';
    rebuildList();
  }
});

document.getElementById('completed').addEventListener("click",function() {
  if (statuses != ['completed']) {
    statuses = ['completed'];
    rebuildList();
  }
});

document.getElementById('all').addEventListener("click",function() {
  if (statuses != ['incomplete', 'completed']) {
    statuses = ['incomplete', 'completed'];
    rebuildList();
  }
});

document.getElementById('clear').addEventListener("click",function() {
  if (confirm('Are you sure you want to delete all completed tasks?')) {
    for (let [key, value] of tasks.entries()) { 
      if (value == 'completed') {
        tasks.delete(key);
      }
    }
    localStorage.tasks = JSON.stringify(Array.from(tasks.entries()));
    rebuildList();
  }
});

let checkLength = function() {
  if (taskList.children.length > 0) {
    document.getElementsByClassName("card-to-do")[0].classList.remove('empty');
  } else document.getElementsByClassName("card-to-do")[0].classList.add('empty');
}
checkLength();

if (localStorage.getItem("theme") == null) {
  var currentTheme = "dark";
} else {
  var currentTheme = localStorage.getItem("theme");
}

if (currentTheme == "light") {
  document.body.classList.add("light");
}

toggleIcon.addEventListener("click",function() { 
  document.querySelectorAll(".icon").forEach(icon =>{
    icon.classList.toggle('current');
  });
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')){
    currentTheme = "light";
  } else {
    currentTheme = "dark";
  };
  localStorage.setItem("theme", currentTheme);
});