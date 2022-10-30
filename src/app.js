var taskInput = document.getElementById('taskInput');
var taskForm = document.getElementById('taskForm');
var taskCounter = document.getElementById('count');
var taskCount = 0;
var menuItems = document.querySelectorAll('.menu-item');

if(localStorage.getItem('tasks') == null){
  var tasks = new Map();
}else{
  tasks = new Map(JSON.parse(localStorage.tasks));
  i = 0;
  for (let [key, value] of tasks.entries()) {
    i ++;
    if (value === 'incomplete') {
      var taskStatus = false;
    } else {
      var taskStatus = true;
    }
    document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="' + taskStatus + '"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check' + i + '"><label class="form-check-label" for="check' + i + '"></label>' + key + '</div></li>';
  };
}

var getCheckboxes = document.querySelectorAll("[type=checkbox]");
i = -1;
for (let [key, value] of tasks.entries()) {
  i ++;
  if (value === 'completed') {
   getCheckboxes[i].checked = true;
  }
};

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
    document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="false"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check1"><label class="form-check-label" for="check1"></label>' + newTask + '</div></li>'
    count.innerHTML = tasks.size;
    checkboxes();
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