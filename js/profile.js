const calendar = document.getElementById("ramadanCalendar");
const dailyBox = document.getElementById("dailyPts");
const secondaryBox = document.getElementById("secondaryPts");
const totalBox = document.getElementById("totalPoints");

/* ===== حساب رمضان ===== */

function isRamadan(){
 const start = new Date(2026,1,19);
 const end = new Date(start);
 end.setDate(start.getDate()+30);
 const today = new Date();
 return today>=start && today<=end;
}

/* ===== جمع النقاط ===== */

let dailyTotal = 0;

for(let i=1;i<=30;i++){
 dailyTotal += Number(localStorage.getItem("ramadan-day-"+i)) || 0;
}

const secondary = Number(localStorage.getItem("secondaryPoints")) || 0;
const grandTotal = dailyTotal + secondary;

dailyBox.innerText = dailyTotal;
secondaryBox.innerText = secondary;
totalBox.innerText = grandTotal;

/* ===== التقويم ===== */

function loadRamadan(){

 calendar.innerHTML="";

 for(let i=1;i<=30;i++){

  const score = Number(localStorage.getItem("ramadan-day-"+i)) || 0;

  calendar.innerHTML += `
   <div class="day ${score>0?"done":""}">
    <span>اليوم ${i}</span>
    <strong>${score} نقطة</strong>
   </div>
  `;
 }
}

loadRamadan();
