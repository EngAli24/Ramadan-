const calendar = document.getElementById("ramadanCalendar");
const dailyBox = document.getElementById("dailyPts");
const secondaryBox = document.getElementById("secondaryPts");
const totalBox = document.getElementById("totalPoints");

/* ===== DAILY POINTS ===== */

let dailyTotal = 0;

Object.keys(localStorage).forEach(k=>{
 if(k.startsWith("score-")){
  dailyTotal += Number(localStorage.getItem(k));
 }
});

/* ===== SECONDARY ===== */

const secondary = Number(localStorage.getItem("secondaryPoints")) || 0;

/* ===== TOTAL ===== */

const grandTotal = dailyTotal + secondary;

dailyBox.innerText = dailyTotal;
secondaryBox.innerText = secondary;
totalBox.innerText = grandTotal;

/* ===== RAMADAN CALENDAR ===== */

async function loadRamadan(){

 const city = localStorage.getItem("city") || "Assiut";
 let country="Egypt";

 if(["Mecca","Medina"].includes(city)) country="Saudi Arabia";
 if(city==="Kuwait") country="Kuwait";

 const year = new Date().getFullYear();

 const res = await fetch(
  `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=5&month=9&year=${year}`
 );

 const data = await res.json();

 calendar.innerHTML="";

 data.data.forEach((day,i)=>{
  const greg = day.date.gregorian.date.split("-").reverse().join("-");
  const score = Number(localStorage.getItem("score-"+greg)) || 0;

  calendar.innerHTML += `
   <div class="day ${score>0?"done":""}">
    <span>اليوم ${i+1}</span>
    <strong>${score} نقطة</strong>
   </div>
  `;
 });
}

loadRamadan();
