let currentJuz = Number(localStorage.getItem("currentJuz")) || 1;
let savedAyah = localStorage.getItem("savedAyah");

const box = document.getElementById("ayahs");

const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

async function loadWird(){

 document.getElementById("juzNumber").innerText = `الجزء ${currentJuz}`;

 const res = await fetch(`https://api.alquran.cloud/v1/juz/${currentJuz}/quran-uthmani`);
 const data = await res.json();
 const ayahs = data.data.ayahs;

 box.innerHTML = "";

 let currentSurah = "";
 let ayahCount = 0;

 ayahs.forEach((a,index)=>{

  if(a.surah.name !== currentSurah){

    if(currentSurah !== ""){
      box.innerHTML += `</div><div class="separator">۞ ۞ ۞</div>`;
    }

    currentSurah = a.surah.name;

    box.innerHTML += `<div class="surah-title">${currentSurah}</div>`;

    if(
      currentSurah !== "سُورَةُ ٱلْفَاتِحَةِ" &&
      currentSurah !== "سُورَةُ ٱلتَّوْبَةِ"
    ){
      box.innerHTML += `<div class="basmala">﷽</div>`;
    }

    box.innerHTML += `<div class="quran-line">`;
  }
if(
    currentSurah !== "سُورَةُ ٱلْفَاتِحَةِ" &&
    a.text.trim().startsWith(BASMALA)
  ){
    const cleaned = a.text.replace(BASMALA,"").trim();
  
    if(cleaned){
      renderAyah(cleaned, a.numberInSurah, index);
    }
    return;
  }
  

  renderAyah(a.text,a.numberInSurah,index);
  ayahCount++;
 });

 box.innerHTML += `</div>`;

 updateProgress(ayahCount);

 if(savedAyah){
  setTimeout(()=>{
   document.getElementById(savedAyah)?.scrollIntoView({behavior:"smooth"});
  },300);
 }
}

function renderAyah(text,num,index){
 const id=`ayah-${index}`;
 box.innerHTML += `
  <span class="ayah" id="${id}" onclick="saveAyah('${id}')">
   ${text}
   <span class="ayah-num">${num}</span>
  </span>
 `;
}

function saveAyah(id){
 localStorage.setItem("savedAyah",id);
 savedAyah=id;
}

function updateProgress(total){
 const done = savedAyah ? parseInt(savedAyah.split("-")[1]) + 1 : 0;
 const percent = (done / total) * 100;

 document.getElementById("progressText").innerText =
  `الجزء ${currentJuz} — التقدم ${Math.floor(percent)}%`;

 document.getElementById("progressFill").style.width = percent + "%";
}
function getRamadanDay(){
  const start = new Date(2026, 1, 19); 
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}
function changeJuz(step){
 currentJuz+=step;
 if(currentJuz<1) currentJuz=1;
 if(currentJuz>30) currentJuz=30;

 localStorage.setItem("currentJuz",currentJuz);
 localStorage.removeItem("savedAyah");
 loadWird();
}
let currentFont = localStorage.getItem("fontSize") || 16;

document.documentElement.style.fontSize = currentFont + "px";

function changeFont(delta){
 currentFont = parseInt(currentFont) + delta;

 if(currentFont < 14) currentFont = 14;
 if(currentFont > 80) currentFont = 80;

 document.documentElement.style.fontSize = currentFont + "px";
 localStorage.setItem("fontSize", currentFont);
}
function markDone(){
    const today=new Date().toDateString();
    const last=localStorage.getItem("lastRead");
   
    if(last!==today){
     currentJuz++;
     if(currentJuz>30) currentJuz=1;
     localStorage.setItem("currentJuz",currentJuz);
     localStorage.setItem("lastRead",today);
     localStorage.removeItem("savedAyah");
    }
    localStorage.setItem("challenge-quran", "done");

    document.getElementById("finishModal").classList.add("show");
   }
   function closeModal(){
    document.getElementById("finishModal").classList.remove("show");
    loadWird();
   }
      

loadWird();
