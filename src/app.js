document.querySelectorAll("[type=checkbox]").forEach(checkbox =>{
  checkbox.addEventListener("click",function(e){
    if(this.checked){
          this.parentElement.parentElement.setAttribute("aria-checked", "true");
    }
    else{
        this.parentElement.parentElement.setAttribute("aria-checked", "false");
    }
    e.stopPropagation();
  })
})

var taskInput = document.getElementById('taskInput');
var taskForm = document.getElementById('taskForm');
if(localStorage.getItem('tasks') == null){
  var tasks =[];
}else{
  tasks = JSON.parse(localStorage.getItem('tasks'));
}
tasks.forEach(element => {
  document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="false"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check1"><label class="form-check-label" for="check1">' + element + '</label></div></li>'
});

taskInput.onkeyup = function () {
  if (taskInput.value.length > 0) {
    document.getElementById('addTask').style.display="block";
  } else {
    document.getElementById('addTask').style.display="none";
  }
};

taskForm.onsubmit = function (e) {
  e.preventDefault();
  tasks.push(taskInput.value);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = '';
  document.getElementById('addTask').style.display="none";
  tasks = JSON.parse(localStorage.getItem("tasks"));
  newTask = tasks.slice(-1);
  document.getElementById('taskList').innerHTML += '<li tabindex="-1" role="option" aria-checked="false"><div class="form-check mb-0"><input class="form-check-input" type="checkbox" value="" id="check1"><label class="form-check-label" for="check1">' + newTask + '</label></div></li>'
  console.log(localStorage);
};
