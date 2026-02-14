/* ================== SERVICE WORKER ================== */

if ("serviceWorker" in navigator) {
 navigator.serviceWorker.register("js/sw.js");
}

if ("Notification" in window) {
 Notification.requestPermission();
}
document.addEventListener("click", () => {
  adhanAudio.play().then(()=>adhanAudio.pause());
}, { once:true });

/* ================== DATA ================== */

const cities = [
 "Cairo","Giza","Alexandria","Dakahlia","Sharqia","Gharbia","Monufia",
 "Qalyubia","Beheira","Kafr El Sheikh","Damietta","Port Said","Ismailia",
 "Suez","Faiyum","Beni Suef","Minya","Assiut","New Assiut City","Dayrout",
 "Sohag","New Sohag City","Qena","Luxor","Aswan","Red Sea","New Valley",
 "Matrouh","North Sinai","South Sinai",
 "Mecca","Medina","Kuwait"
];

const input = document.getElementById("citySearch");
const listBox = document.getElementById("cityList");
const prayersBox = document.getElementById("prayers");
const timerBox = document.getElementById("timer");
const nextTitle = document.getElementById("nextPrayer");

let interval;
const adhanAudio = new Audio("js/adhan.mp3");

/* ================== UI ================== */

function showCities(arr){
 listBox.innerHTML="";
 if(!arr.length){ listBox.style.display="none"; return; }
 listBox.style.display="block";
 arr.forEach(c=>{
  listBox.innerHTML+=`<div class="city-item">${c}</div>`;
 });
}

input.onclick = ()=> showCities(cities);
input.oninput = ()=>{
 const v=input.value.toLowerCase();
 showCities(cities.filter(c=>c.toLowerCase().includes(v)));
};

listBox.onclick=e=>{
 if(e.target.classList.contains("city-item")){
  input.value=e.target.innerText;
  listBox.style.display="none";
  localStorage.setItem("city",input.value);
  loadPrayers();
 }
};

document.onclick=e=>{
 if(!e.target.closest(".city-wrapper")) listBox.style.display="none";
};

/* ================== LOAD PRAYERS ================== */

async function loadPrayers(){
 clearInterval(interval);

 const city=input.value || "Assiut";

 let country="Egypt";
 if(["Mecca","Medina"].includes(city)) country="Saudi Arabia";
 if(city==="Kuwait") country="Kuwait";

 const res=await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
 const data=await res.json();
 const t=data.data.timings;

 const prayers = [
  ["الإمساك", t.Imsak],
  ["الفجر", t.Fajr],
  ["الشروق", t.Sunrise],
  ["الظهر", t.Dhuhr],
  ["العصر", t.Asr],
  ["المغرب", t.Maghrib],
  ["العشاء", t.Isha]
 ];

 prayersBox.innerHTML="";

 prayers.forEach(p=>{
  prayersBox.innerHTML+=`
   <div class="row" id="${p[0]}">
    <span>${p[0]}</span>
    <span>${p[1]}</span>
   </div>`;
 });

 startTimer(prayers);
 schedulePrayerNotify(prayers);
}

/* ================== TIMER ================== */

function startTimer(prayers){

 function tick(){
  const now=new Date();
  let next,time;

  prayers.forEach(p=>{
   const [h,m]=p[1].split(":");
   const d=new Date();
   d.setHours(h,m,0,0);
   if(d>now && (!time||d<time)){ time=d; next=p[0]; }
  });

  if(!time){
   const [h,m]=prayers[0][1].split(":");
   time=new Date();
   time.setDate(time.getDate()+1);
   time.setHours(h,m,0,0);
   next=prayers[0][0];
  }

  const diff=Math.floor((time-now)/1000);
  const hh=String(Math.floor(diff/3600)).padStart(2,"0");
  const mm=String(Math.floor(diff%3600/60)).padStart(2,"0");
  const ss=String(diff%60).padStart(2,"0");

  timerBox.innerText=`${hh}:${mm}:${ss}`;
  nextTitle.innerText=`متبقي على ${next}`;

  document.querySelectorAll(".row").forEach(r=>r.classList.remove("next"));
  document.getElementById(next)?.classList.add("next");
 }

 tick();
 interval=setInterval(tick,1000);
}

/* ================== BACKGROUND NOTIFY + ADHAN ================== */

function schedulePrayerNotify(prayers){

 prayers.forEach(p=>{

  const [h,m]=p[1].split(":");

  const now=new Date();
  const target=new Date();
  target.setHours(h,m,0,0);

  if(target < now) target.setDate(target.getDate()+1);

  const delay = target - now;

  setTimeout(()=>{
   navigator.serviceWorker.ready.then(reg=>{
    reg.showNotification("🕌 وقت الصلاة",{
     body: "حان الآن وقت " + p[0],
     vibrate:[200,100,200]
    });
   });

   adhanAudio.play();

  }, delay);

 });
}

/* ================== INIT ================== */

input.value=localStorage.getItem("city") || "Assiut";
loadPrayers();



