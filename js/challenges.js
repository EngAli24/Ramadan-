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

/* ===== رمضان ===== */

function getRamadanDay(){
 const start = new Date(2026,1,19);
 const today = new Date();
 const diff = Math.floor((today - start)/(1000*60*60*24));
 return diff+1;
}

function isRamadan(){
 const start = new Date(2026,1,19);
 const end = new Date(start);
 end.setDate(start.getDate()+30);
 const today = new Date();
 return today>=start && today<=end;
}

/* ===== RENDER ===== */

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
    <span class="points">(${t.points} نقطة)</span>
   </div>
  `;
 });

 const percent = totalPoints? (donePoints/totalPoints)*100 : 100;
 fill.style.width=percent+"%";

 total.innerText=`مجموع نقاط اليوم: ${donePoints}`;

 if(doneRequired && percent===100){

  const day = getRamadanDay();
  localStorage.setItem("ramadan-day-"+day, donePoints);

  modal.classList.add("show");
}


 save();
}

/* ===== TOGGLE ===== */

function toggle(id){
 tasks = tasks.map(t=>{
  if(String(t.id)===String(id)){
   t.done=!t.done;
  }
  return t;
 });
 render();
}

/* ===== ADD ===== */

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
 render();
}

function closeModal(){
 modal.classList.remove("show");
}

render();
