const cardsContainer = document.getElementById("azkarCards");
const listContainer  = document.getElementById("azkarList");

/* ===== STORAGE ===== */
let azkarDone = JSON.parse(localStorage.getItem("azkarDone")) || [];
let secondaryPoints = Number(localStorage.getItem("secondaryPoints")) || 0;

let lastDay = localStorage.getItem("zekrDay") || "";
let streak = Number(localStorage.getItem("zekrStreak")) || 0;

/* ===== SAME NAMES ===== */

const categories = [
 ["morning","🌅 أذكار الصباح"],
 ["evening","🌙 أذكار المساء"],
 ["wake","⏰ أذكار الاستيقاظ"],
 ["sleep","😴 أذكار النوم"],
 ["prayer","🕌 أذكار بعد الصلاة"],
 ["food","🍽 أذكار الطعام"],
 ["ramadan","🌙 أدعية رمضانية"],
 ["daily","📆 أذكار يومية"],
 ["quran_dua","📖 أدعية قرآنية"],
 ["general","🤲 جوامع الدعاء"],
 ["tasbeeh","📿 السبحة الإلكترونية"]
];

categories.forEach(c=>{
 const div=document.createElement("div");
 div.className="azkar-card";        // 👈 نفس الكلاس القديم
 div.textContent=c[1];
 div.onclick=()=>openCategory(c[0]);
 cardsContainer.appendChild(div);
});

/* ===== OPEN CATEGORY ===== */

function openCategory(type){

 listContainer.innerHTML="";

 if(type==="tasbeeh"){
  openTasbeeh();
  return;
 }

 const items = AZKAR_LIBRARY.filter(z=>z.category===type);

 let doneCount=0;

 items.forEach(z=>{

  const card=document.createElement("div");
  card.className="zekr-card";     
  let counter=0;

  card.innerHTML=`
   <h4>${z.title}</h4>
   <p>${z.text}</p>
   <strong>🔁 ${z.count}</strong>
   <div>العدد: <span class="cnt">0</span></div>
  `;

  const span=card.querySelector(".cnt");

  const countBtn=document.createElement("button");
  countBtn.textContent="📿";

  countBtn.onclick=()=>{
   if(counter<z.count){
    counter++;
    span.textContent=counter;
   }
  };

  const doneBtn=document.createElement("button");
  doneBtn.textContent=azkarDone.includes(z.id)?"✔ تم":"⭐ تم الذكر";

  doneBtn.onclick=()=>{
   if(counter>=z.count && !azkarDone.includes(z.id)){
    azkarDone.push(z.id);

    let reward = isRamadan()?4:2;
    secondaryPoints+=reward;

    saveAzkar();
    doneBtn.textContent="✔ تم";

    showReward(reward);
    updateStreak();
   }
  };

  card.append(countBtn,doneBtn);
  listContainer.appendChild(card);

  if(azkarDone.includes(z.id)) doneCount++;
 });

 renderProgress(doneCount,items.length);
 listContainer.scrollIntoView({behavior:"smooth"});

}
function getRamadanDay(){
  const start = new Date(2026, 1, 19); 
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}
/* ===== PROGRESS ===== */

function renderProgress(done,total){
 const percent = total?Math.round((done/total)*100):0;
 const p=document.createElement("h3");
 p.textContent="📊 إنجاز القسم: "+percent+"%";
 listContainer.prepend(p);

 if(percent===100){
  alert("🏆 أحسنت! أنهيت هذا القسم كاملًا");
 }
}

/* ===== TASBEEH ===== */

function openTasbeeh(){

    listContainer.innerHTML="";
   
    let count = Number(localStorage.getItem("tasbeehCount")) || 0;
   
    const card = document.createElement("div");
    card.className = "zekr-card";
   
    card.innerHTML = `
     <h3>📿 السبحة الإلكترونية</h3>
     <div id="tasCount" style="font-size:48px;margin:20px 0">${count}</div>
    `;
   
    const tasbeehBtn = document.createElement("button");
    tasbeehBtn.textContent = "سبّح";
   
    tasbeehBtn.onclick = () => {
     count++;
     document.getElementById("tasCount").textContent = count;
     localStorage.setItem("tasbeehCount", count);
    };
   
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "تصفير";
    resetBtn.style.background = "#caa74e";
   
    resetBtn.onclick = () => {
     count = 0;
     document.getElementById("tasCount").textContent = count;
     localStorage.setItem("tasbeehCount", count);
    };
   
    card.append(tasbeehBtn, resetBtn);
    listContainer.appendChild(card);
   }
   

/* ===== REWARD ===== */

function showReward(p){
 alert("⭐ مكافأة +" + p + " نقطة");
}

/* ===== STREAK ===== */

function updateStreak(){

 const today=new Date().toISOString().split("T")[0];

 if(today!==lastDay){

  const y=new Date();
  y.setDate(y.getDate()-1);
  const yd=y.toISOString().split("T")[0];

  streak = lastDay===yd ? streak+1 : 1;

  lastDay=today;

  localStorage.setItem("zekrDay",today);
  localStorage.setItem("zekrStreak",streak);
 }
}

/* ===== UTILS ===== */

function saveAzkar(){
 localStorage.setItem("azkarDone",JSON.stringify(azkarDone));
 localStorage.setItem("secondaryPoints",secondaryPoints);
}

function isRamadan(){
 const start = new Date(2026,1,19);
 const end = new Date(start);
 end.setDate(start.getDate()+30);
 const today = new Date();

 return today >= start && today <= end;
}
