const content = document.getElementById("content");
const stats = document.getElementById("stats");

let mode = "hadith";
let index = 0;
let secondaryPoints = Number(localStorage.getItem("secondaryPoints")) || 0;

/* ===== Safe Quran Cache ===== */
let loadedAyahs = JSON.parse(localStorage.getItem("loadedAyahs"));
if(!Array.isArray(loadedAyahs)) loadedAyahs = [];

let ayahPointer = Number(localStorage.getItem("ayahPointer")) || 1;

/* ===== Data ===== */
let fav = JSON.parse(localStorage.getItem("fav"));
if(!Array.isArray(fav)) fav = [];

let read = JSON.parse(localStorage.getItem("read"));
if(!Array.isArray(read)) read = [];


/* ================= SAVE ================= */

function save(){
 localStorage.setItem("fav", JSON.stringify(fav));
 localStorage.setItem("read", JSON.stringify(read));
 localStorage.setItem("loadedAyahs", JSON.stringify(loadedAyahs));
 localStorage.setItem("ayahPointer", ayahPointer);
 localStorage.setItem("secondaryPoints", secondaryPoints);

 stats.innerText = `📖 ${read.length} `;
}

/* ================= CARD ================= */

function createCard(id, text, more, source){

 const div = document.createElement("div");
 div.className="item";

 div.innerHTML=`
  <strong>${text}</strong>
  <div class="more" style="display:none;margin-top:8px;color:#0f5132">${more}</div>
  ${source?`<small>${source}</small>`:""}
 `;

 const actions=document.createElement("div");
 actions.className="actions";

 const moreBtn=document.createElement("button");
 moreBtn.textContent="📖 قراءة المزيد";
 moreBtn.onclick=()=>{
  const m=div.querySelector(".more");
  m.style.display=m.style.display==="block"?"none":"block";
 };
 const favBtn = document.createElement("button");
 favBtn.textContent = fav.includes(id) ? "💛" : "❤️";
 favBtn.onclick = () => {
 
  if(!fav.includes(id)) fav.push(id);
  else fav = fav.filter(x => x !== id);
 
  save();
 
  if(mode === "fav") showFav();
  if(mode === "read") showRead();
 };
 
 const readBtn = document.createElement("button");
 readBtn.textContent = read.includes(id) ? "✔ تم" : "✔ تمت القراءة";
 
 readBtn.onclick = () => {
 
  if(!read.includes(id)){
   read.push(id);
   secondaryPoints += 3;
   save();
  }
 
  readBtn.textContent = "✔ تم";
 
  if(mode === "read") showRead();
  if(mode === "fav") showFav();
 };
 

 actions.append(moreBtn,favBtn,readBtn);
 div.appendChild(actions);
 content.appendChild(div);
}
function getRamadanDay(){
  const start = new Date(2026, 1, 19); 
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}
/* ================= HADITH ================= */

function showHadith(){
 mode="hadith";
 content.innerHTML="";
 index=0;
 loadHadith();
}

function loadHadith(){
 HADITH_LIBRARY.slice(index,index+4).forEach(h=>{
  createCard(h.id,h.text,"📖 "+h.explanation,"📚 "+h.source);
 });
 index+=4;
}

/* ================= QURAN ================= */

let isLoading = false;

function showTafsir(){
 mode="tafsir";
 content.innerHTML="";

 loadedAyahs.forEach(a=>{
  createCard(a.id,a.text,a.tafsir,"");
 });
}

async function loadTafsir(){

 if(isLoading) return;   
 isLoading = true;

 const r = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahPointer}/editions/quran-uthmani,ar.muyassar`);
 if(!r.ok){
  isLoading=false;
  return;
 }

 const d = await r.json();

 const newId = "ayah-"+ayahPointer;

 if(!loadedAyahs.some(a=>a.id===newId)){

  const obj={
   id:newId,
   text:d.data[0].text,
   tafsir:d.data[1].text
  };

  loadedAyahs.push(obj);
  createCard(obj.id,obj.text,obj.tafsir,"");

  ayahPointer++;
  save();
 }

 isLoading=false;
}

/* ================= LOAD MORE ================= */

function loadMore(){
 if(mode==="hadith") loadHadith();
 if(mode==="tafsir") loadTafsir();
}

window.addEventListener("scroll",()=>{
 if(mode==="hadith"||mode==="tafsir"){
  if(window.innerHeight+window.scrollY>=document.body.offsetHeight-120){
   loadMore();
  }
 }
});

/* ================= FAVORITES ================= */

function showFav(){
 mode="fav";
 content.innerHTML="<h3>📜 الأحاديث المفضلة</h3>";

 HADITH_LIBRARY.filter(h=>fav.includes(h.id))
 .forEach(h=>createCard(h.id,h.text,"📖 "+h.explanation,"📚 "+h.source));

 content.innerHTML+="<h3>📖 آيات مفضلة</h3>";

 loadedAyahs.filter(a=>fav.includes(a.id))
 .forEach(a=>createCard(a.id,a.text,a.tafsir,""));
}
/* ========= SMART SEARCH ========= */


const inputSearch = document.getElementById("searchInput");

function normalizeArabic(text){
 return text
  .replace(/[ًٌٍَُِّْ]/g,"")
  .replace(/أ|إ|آ/g,"ا")
  .replace(/ى/g,"ي")
  .replace(/ؤ/g,"و")
  .replace(/ئ/g,"ي")
  .replace(/ة/g,"ه")
  .toLowerCase();
}

function smartMatch(text, query){
 return query.split(" ").every(w => text.includes(w));
}

inputSearch.addEventListener("input", smartSearch);

async function smartSearch(){

 const q = normalizeArabic(inputSearch.value.trim());

 if(q.length < 2){
  content.innerHTML="";
  showHadith();
  return;
 }

 content.innerHTML="";

 /* 📜 أحاديث */
 HADITH_LIBRARY.forEach(h=>{
  if(smartMatch(normalizeArabic(h.text), q)){
   createCard(
    "s-"+h.id,
    h.text,
    "📖 "+h.explanation,
    "📚 "+h.source
   );
  }
 });

 /* 📖 قرآن كامل عبر API */
 try{
  const res = await fetch(
   `https://api.alquran.cloud/v1/search/${q}/all/ar.muyassar`
  );
  const data = await res.json();

  data.data.matches.slice(0,8).forEach(a=>{
   createCard(
    "q-"+a.number,
    a.text,
    a.text,
    ""
   );
  });

 }catch(e){
  console.log("Quran search error",e);
 }
}

/* ================= READ ================= */

function showRead(){
 mode="read";
 content.innerHTML="<h3>📜 الأحاديث المقروءة</h3>";

 HADITH_LIBRARY.filter(h=>read.includes(h.id))
 .forEach(h=>createCard(h.id,h.text,"📖 "+h.explanation,"📚 "+h.source));

 content.innerHTML+="<h3>📖 آيات مقروءة</h3>";

 loadedAyahs.filter(a=>read.includes(a.id))
 .forEach(a=>createCard(a.id,a.text,a.tafsir,""));
}

save();
showHadith();
