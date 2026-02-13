const list=document.getElementById("tasks");
const fill=document.getElementById("fill");
const total=document.getElementById("total");
const modal=document.getElementById("modal");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
 {id:"fajr",name:"صلاة الفجر في وقتها",points:30,required:true},
 {id:"azkar",name:"ورد الأذكار",points:40,required:true},
 {id:"quran",name:"قراءة الجزء اليومي",points:20,required:true},
 {id:"study",name:"المذاكرة",points:30,required:true},
 {id:"taraweeh",name:"صلاة التراويح",points:30,required:false},
];

function save(){
 localStorage.setItem("tasks",JSON.stringify(tasks));
}

function render(){

 let donePoints=0;
 let totalPoints=0;
 let doneRequired=true;

 list.innerHTML="";

 tasks.forEach(t=>{
  totalPoints+=t.points;

  if(t.done) donePoints+=t.points;
  if(t.required && !t.done) doneRequired=false;

  list.innerHTML+=`
   <div class="task ${t.done?"done":""}" onclick="toggle('${t.id}')">
    <span>${t.name}</span>
    <span class="points">${t.points?`(${t.points} نقطة)`:"إجباري"}</span>
   </div>
  `;
 });

 const percent = totalPoints? (donePoints/totalPoints)*100 : 100;
 fill.style.width=percent+"%";

 total.innerText=`مجموع نقاط اليوم: ${donePoints}`;

 if(doneRequired && percent===100){
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("score-"+today, donePoints);

  modal.classList.add("show");
 }
}

function toggle(id){
  tasks = tasks.map(t=>{
   if(String(t.id) === String(id)){
     t.done = !t.done;
   }
   return t;
  });
  save();
  render();
 }
 

function addTask(){
  const val=document.getElementById("newTask").value.trim();
  if(!val) return;
 
  tasks.push({
   id:Date.now(),
   name:val,
   points:0,
   required:true,
   done:false   
  });
 
  document.getElementById("newTask").value="";
  save();
  render();
 }
 

function closeModal(){
 modal.classList.remove("show");
}

render();
