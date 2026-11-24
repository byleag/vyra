"use strict";
{
/* ================= PROGRAMME ================= */
const LAUNCH_MON = new Date(2026, 10, 23);
const END = [20,25,30,25,35,40,45,30,45,50,55,30];
const CARDIO = ["25 min faciles","6 × 30 s","8 × 30 s","25 min faciles","6 × 1 min","8 × 1 min","6 × 1 min 30","30 min faciles","6 × 2 min","5 × 3 min","6 × 3 min","Bilan facile 30–55 min"];
const DELOAD = [4,8,12];
const DOW = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DOWL = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const MONTHS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const MONTHL = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const FORCE = [
 {id:"squat",n:"Goblet squat",r:"12",alt:"Squat avec sac à dos",cues:["Genoux dans l'axe des pieds","Poitrine haute, charge contre le sternum","Amplitude confortable, talons au sol"],anim:["stand","mid","squat","mid"],ph:["Debout","Descente","Position basse"],key:"squat"},
 {id:"rdl",n:"Soulevé de terre roumain",r:"10",alt:"Sac à dos tenu à deux mains",cues:["Hanches vers l'arrière","Dos neutre, regard au sol devant","Charge proche des jambes"],anim:["standdb","rdl"],ph:["Debout","Charnière de hanche"],key:"rdl"},
 {id:"fentes",n:"Fentes arrière",r:"10 / jambe",alt:"Poids du corps",cues:["Grand pas en arrière","Genou avant dans l'axe du pied","Buste droit, descente contrôlée"],anim:["standfree","lunge"],ph:["Debout","Fente basse"],key:"lunge"},
 {id:"tirage",n:"Tirage horizontal",r:"12",alt:"Élastique ou sac à dos",cues:["Buste penché, dos neutre","Coude qui recule le long du corps","Épaules basses"],anim:["rowstart","row"],ph:["Bras tendu","Coude en arrière"],key:"row"},
 {id:"pompes",n:"Pompes",r:"8–12",alt:"Sur support stable ou genoux",cues:["Corps gainé de la tête aux pieds","Mains sous les épaules","Descente contrôlée"],anim:["pushup","push"],ph:["Bras tendus","Poitrine basse"],key:"push"},
 {id:"farmer",n:"Farmer carry",r:"40 m",alt:"Deux sacs équilibrés",cues:["Posture droite, épaules basses","Pas courts et contrôlés","Charges équilibrées"],anim:["farmerA","farmerB"],ph:["Pas gauche","Pas droit"],key:"farmerA"},
 {id:"gainage",n:"Gainage",r:"30–45 s",alt:"Au sol",cues:["Respirer calmement","Ne pas creuser le dos","Coudes sous les épaules"],anim:["plank","plank2"],ph:["Tenir la position"],key:"plank"}];
const HY = {
 1:["400 m course","250 m rameur","400 m course","10 burpees adaptés","400 m course","20 fentes alternées","400 m course","40 m Farmer carry","15 squats ou Wall Balls"],
 2:["600 m course","400 m SkiErg","600 m course","20 m Sled Push","600 m course","400 m rameur","600 m course","20 burpees adaptés","600 m course","80 m Farmer carry","30 fentes alternées","20 Wall Balls"],
 3:["800 m course","500 m SkiErg","800 m course","25 m Sled Push","800 m course","25 m Sled Pull","800 m course","20 m Burpee Broad Jumps","800 m course","500 m rameur","800 m course","100 m Farmer carry","40 m fentes lestées","30 Wall Balls"]};
const HYDUR = {1:"30–40 min",2:"40–55 min",3:"45–60 min"};
const SUBS = [[/SkiErg|rameur/,"Mountain climbers contrôlés / marche rapide"],[/Sled Push/,"Step-ups et squats"],[/Sled Pull/,"Tirage élastique"],[/Wall Balls/,"Squats avec extension des bras"],[/Farmer/,"Sacs équilibrés"],[/fentes lestées/,"Fentes avec sac à dos"]];
const HABITS = ["Tenue préparée la veille","Pas de réseaux au réveil ni avant le sport","Créneau respecté (ou règle des 10 min)","Marche dans la journée","Bien mangé et bien bu","Repos et récupération respectés","Progrès et ressenti notés"];
const EFFORT = ["","Récupération","Récupération","Endurance","Endurance","Soutenu","Soutenu","Fractionné maîtrisé","Fractionné maîtrisé","Maximal, à éviter","Maximal, à éviter"];
const ST = {prevu:"Prévu",realise:"Réalisé",adapte:"Adapté",reporte:"Reporté",repos:"Repos"};

const addD = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const ymd = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const pd = s => { const [a,b,c] = s.split("-").map(Number); return new Date(a,b-1,c); };
const fmt = d => d.getDate()+" "+MONTHS[d.getMonth()];
const dow = s => (pd(s).getDay()+6)%7;
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num = v => { const n = parseFloat(String(v ?? "").replace(",",".")); return isFinite(n) ? n : 0; };
const nf = (n,d=1) => (+n.toFixed(d)).toString().replace(".",",");
const today = () => ymd(new Date());
const weekOf = s => Math.floor((pd(s)-LAUNCH_MON)/864e5/7+1e-9);
const wStart = w => addD(LAUNCH_MON,7*w);
const wLabel = w => w===0 ? "Lanc." : "S"+w;
const phaseOf = w => w<=4 ? 1 : w<=8 ? 2 : 3;
const setsFor = w => (w<=2 || DELOAD.includes(w)) ? 2 : 3;
const weekDays = w => [...Array(7)].map((_,i) => ymd(addD(wStart(w),i)));
const curWeek = () => Math.max(0, Math.min(12, weekOf(today())));

function plan(s){
 const w = weekOf(s), dw = dow(s);
 if (w<0 || w>12) return null;
 if (w===0) return [null,
  {type:"run",kind:"test",title:"Test de niveau",cat:"Running",slot:"18h30",dur:30,short:"Test facile 20 min",counts:1,eff:"3–4"},
  {type:"mobi",title:"Marche & mobilité",cat:"Récupération active",slot:"Libre",dur:40,short:"Marche 30 min + mobilité 10 min",counts:1},
  {type:"run",kind:"easy",title:"Footing facile",cat:"Running",slot:"17h15",dur:25,short:"25 min faciles",counts:1,eff:"3–4"},
  {type:"rest",title:"Repos",slot:"",short:"Récupération"},
  {type:"hyrox",title:"Découverte HYROX",cat:"HYROX",slot:"9h00",dur:30,short:"30 min · moitié du circuit",counts:1,eff:"5–6"},
  {type:"sun",title:"Repos & bilan",slot:"Soir",short:"Premier bilan de la semaine"}][dw];
 const c = CARDIO[w-1], easy = /facile/i.test(c);
 return [
  {type:"run",kind:"end",title:"Endurance",cat:"Running",slot:"7h00",dur:END[w-1],short:END[w-1]+" min · effort 3–4",counts:1,eff:"3–4"},
  {type:"force",title:"Renforcement",cat:"Renforcement complet",slot:"18h30",dur:60,short:setsFor(w)+" séries · 7 exercices",counts:1,eff:"6–7"},
  {type:"mobi",title:"Repos / mobilité",cat:"Récupération active",slot:"Libre",dur:15,short:"Mobilité douce facultative",opt:1},
  {type:"run",kind:easy?"easy":"int",title:easy?"Cardio facile":"Fractionné",cat:"Running",slot:"17h15",dur:easy?(parseInt(c.replace(/\D+/,""))||30):40,short:c,counts:1,eff:easy?"3–4":"7–8"},
  {type:"rest",title:"Repos",slot:"",short:"Récupération"},
  {type:"hyrox",title:"Circuit HYROX",cat:"HYROX · Phase "+phaseOf(w),slot:"9h00",dur:parseInt(HYDUR[phaseOf(w)].split("–")[1]),short:"Phase "+phaseOf(w)+" · "+HYDUR[phaseOf(w)]+(DELOAD.includes(w)?" · allégé":""),counts:1,eff:"5–7"},
  {type:"sun",title:"Repos ou match & bilan",slot:"Soir",short:"Bilan hebdomadaire"}][dw];
}
function segs(p){
 if (p.kind==="test") return [{n:"Marche active",d:300,e:"Effort 2"},{n:"Course facile",d:1200,e:"Effort 3–4 · ou 2 min course / 1 min marche"},{n:"Marche",d:300,e:"Retour au calme"}];
 if (p.kind==="end" || p.kind==="easy") return [{n:"Course facile",d:p.dur*60,e:"Effort 3–4 · conversation possible"}];
 const m = p.short.match(/(\d+) × (\d+) (s|min)(?: (\d+))?/);
 if (!m) return [{n:"Course",d:p.dur*60,e:"Effort 3–4"}];
 const reps = +m[1], sec = m[3]==="s" ? +m[2] : +m[2]*60 + (+m[4]||0);
 const out = [{n:"Échauffement",d:720,e:"Effort 3–4"}];
 for (let i=0;i<reps;i++){ out.push({n:"Rapide",d:sec,e:"Effort 7–8 · contrôlé",rep:i+1,reps}); if (i<reps-1) out.push({n:"Récupération",d:90,e:"Marche ou trot",rec:1}); }
 out.push({n:"Retour au calme",d:600,e:"Effort 2–3"});
 return out;
}

/* ================= ÉTAT ================= */
const KEY = "vyra-v1";
const blank = () => ({sessions:{},habits:{},reviews:{},challenge:{},updatedAt:0});
let S = blank();
try { const r = JSON.parse(localStorage.getItem(KEY)||"null"); if (r && typeof r==="object") S = Object.assign(blank(), r); } catch(e){}
const ses = s => S.sessions[s] || (S.sessions[s] = {log:{}});
const logOf = s => (S.sessions[s] && S.sessions[s].log) || {};
const statusOf = s => { const p = plan(s); const st = S.sessions[s] && S.sessions[s].status; if (st) return st; return p && p.counts ? "prevu" : "repos"; };
const isDone = s => ["realise","adapte"].includes(statusOf(s));
let saveT = null;
function save(){ S.updatedAt = Date.now(); clearTimeout(saveT); saveT = setTimeout(()=>{ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){ toast("Mémoire pleine : exporte ta sauvegarde"); } }, 150); }
addEventListener("pagehide", ()=>{ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} });
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch(e){}

/* ================= STATS ================= */
function weekStats(w){
 let pl=0,done=0,km=0,min=0,longest=0,runMin=0,runKm=0,eff=[];
 for (const s of weekDays(w)){ const p = plan(s); if (!p) continue; const l = logOf(s);
  if (p.counts) pl++;
  if (isDone(s)){ if (p.counts) done++;
   min += num(l.dur) || (p.counts ? p.dur : 0); km += num(l.dist)+num(l.km);
   if (p.type==="run"){ runMin += num(l.dur); runKm += num(l.dist); longest = Math.max(longest, num(l.dur)); }
   if (num(l.effort)) eff.push(num(l.effort)); } }
 const hs = weekDays(w).map(d=>S.habits[d]).filter(Boolean);
 const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0;
 return {plan:pl,done,km,min,longest,runMin,runKm,sleep:avg(hs.map(h=>num(h.sleep)).filter(Boolean)),energy:avg(hs.map(h=>num(h.energy)).filter(Boolean)),effort:avg(eff)};
}
function assiduite(){ let p=0,d=0; const t = today();
 for (let w=0;w<=12;w++) for (const s of weekDays(w)){ if (s>t) break; const pl = plan(s); if (!pl || !pl.counts) continue; if (s===t && statusOf(s)==="prevu") continue; p++; if (isDone(s)) d++; }
 return p ? {pct:Math.round(d/p*100),d,p} : null; }
const plur = (n,w) => n+" "+w+(n>1?"s":"");
const pace = (dur,dist) => { if (!dur || !dist) return "—"; let t = Math.round(dur/dist*60); return Math.floor(t/60)+":"+String(t%60).padStart(2,"0"); };
const CH0 = new Date(2026,10,24); const chDays = [...Array(30)].map((_,i)=>ymd(addD(CH0,i)));
const chCount = () => chDays.filter(d=>S.challenge[d]).length;
const chSessions = () => chDays.filter(x=>x<=today()).reduce((n,x)=>{ const p = plan(x); return n + (p && p.counts && isDone(x) ? 1 : 0); },0);
function nextSession(){ const t = today(); const end = ymd(addD(wStart(12),6)); for (let i=0;i<120;i++){ const s = ymd(addD(pd(t),i)); if (s>end) return null; const p = plan(s); if (p && p.counts && statusOf(s)==="prevu") return s; } return null; }

/* ================= UI HELPERS ================= */
const $ = id => document.getElementById(id);
const IC = {
 home:"M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z", cal:"M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 10h18M8 3v4M16 3v4",
 check:"M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M4 18.5l1.5 1.5L8 17.5M12 7h8M12 13h8M12 19h8", chart:"M4 20V11M10 20V5M16 20v-6M2 20h20",
 clip:"M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 3h6v3H9zM9 11h6M9 15h4", back:"M15 5l-7 7 7 7", fwd:"M9 5l7 7-7 7", x:"M6 6l12 12M18 6L6 18",
 play:"M8 5l11 7-11 7z", pause:"M8 5v14M16 5v14", dumb:"M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12", shoe:"M3 16h14a4 4 0 0 0 4-3l-6-2-2-4-4 1-1 3-5 1zM3 16v2h18",
 fire:"M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-5 1-9z", moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z", bolt:"M13 2L4 14h7l-1 8 9-12h-7z",
 timer:"M12 8v5l3 2M9 2h6M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", home2:"M4 10l8-6 8 6M6 9v10h12V9", swap:"M7 7h13l-3-3M17 17H4l3 3", info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v6M12 7.5v.5",
 book:"M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-5a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h5z", plus:"M12 5v14M5 12h14", minus:"M5 12h14", tick:"M5 12.5l4.5 4.5L19 7",
 heart:"M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z", skip:"M6 5l9 7-9 7zM18 5v14", stop:"M6 6h12v12H6z", flag:"M5 21V4M5 4h11l-2 4 2 4H5"
};
const ic = (n,extra="") => `<svg class="i" viewBox="0 0 24 24" ${extra}><path d="${IC[n]}"/></svg>`;
const icFill = n => `<svg class="i" viewBox="0 0 24 24" style="fill:currentColor"><path d="${IC[n]}"/></svg>`;
const MARK = `<svg class="logo" viewBox="0 0 894.51 512.62"><use href="#mark"/></svg>`;
const ring = (pct,size,stroke,col,bg,label) => { const r = (size-stroke)/2, c = 2*Math.PI*r;
 return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c*Math.min(1,pct)).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><b>${label}</b></div>`; };
const typeIcon = p => p.type==="run" ? (p.kind==="int" ? "bolt" : "shoe") : p.type==="force" ? "dumb" : p.type==="hyrox" ? "fire" : p.type==="sun" ? "clip" : "moon";
function structHTML(p,h=34,dark=true){
 if (p.type!=="run") return "";
 const sg = segs(p); const wts = sg.map(x => x.rep ? 16 : x.rec ? 10 : (sg.length<=3 ? x.d/60*4 : 80*(x.d/720)));
 const tot = wts.reduce((a,b)=>a+b,0);
 return `<div class="struct" style="height:${h}px">`+sg.map((x,i)=>{ const hh = x.rep ? 1 : x.rec ? .35 : (x.n==="Course facile" ? .62 : .28);
  const col = x.rep ? (dark ? "var(--oat)" : "var(--esp)") : x.rec ? "var(--moc)" : "var(--oli)";
  return `<i style="width:${(wts[i]/tot*100).toFixed(2)}%;height:${hh*100}%;background:${col}"></i>`; }).join("")+`</div>`;
}
let toastT;
function toast(t){ const e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(()=>e.classList.remove("on"),2200); }

/* ================= FIGURES ================= */
const POSES = {
 stand:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[12,-112],a:[18,-124],o:"kb"},
 mid:{h:[10,-134],n:[5,-116],p:[-12,-62],k:[14,-42],f:[0,0],e:[18,-96],a:[23,-106],o:"kb"},
 squat:{h:[16,-114],n:[9,-97],p:[-24,-42],k:[24,-44],f:[0,0],e:[22,-78],a:[27,-89],o:"kb"},
 standdb:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[4,-108],a:[6,-84],o:"db"},
 rdl:{h:[52,-98],n:[36,-92],p:[-8,-82],k:[4,-42],f:[0,0],e:[36,-68],a:[36,-46],o:"db"},
 standfree:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],k2:[-2,-42],f2:[-4,0],e:[10,-104],a:[2,-84],o:""},
 lunge:{h:[4,-128],n:[2,-110],p:[0,-58],k:[28,-36],f:[28,0],k2:[-22,-10],f2:[-52,0],e:[10,-82],a:[2,-62],o:""},
 rowstart:{h:[50,-94],n:[34,-88],p:[-8,-74],k:[6,-38],f:[0,0],e:[38,-66],a:[40,-44],o:"db"},
 row:{h:[50,-94],n:[34,-88],p:[-8,-74],k:[6,-38],f:[0,0],e:[20,-70],a:[30,-60],o:"db"},
 pushup:{h:[82,-64],n:[66,-58],p:[10,-36],k:[-24,-21],f:[-56,-6],e:[66,-30],a:[66,0],o:""},
 push:{h:[82,-44],n:[66,-38],p:[10,-26],k:[-24,-16],f:[-56,-6],e:[50,-20],a:[66,0],o:""},
 farmerA:{h:[3,-153],n:[0,-134],p:[0,-82],k:[8,-42],f:[14,0],k2:[-6,-42],f2:[-14,0],e:[2,-106],a:[4,-80],o:"bag"},
 farmerB:{h:[3,-153],n:[0,-134],p:[0,-82],k:[-6,-42],f:[-14,0],k2:[8,-42],f2:[14,0],e:[2,-106],a:[4,-80],o:"bag"},
 plank:{h:[84,-40],n:[68,-34],p:[10,-24],k:[-24,-15],f:[-58,-6],e:[66,-4],a:[84,-2],o:""},
 plank2:{h:[84,-41],n:[68,-35],p:[10,-27],k:[-24,-16],f:[-58,-6],e:[66,-4],a:[84,-2],o:""}
};
const HORIZ = ["pushup","push","plank","plank2"];
function figSVG(P,sc=1){
 const g = k => P[k] || (k==="k2" ? P.k : P.f);
 const L = (a,b,w,c) => `<line x1="${g(a)[0].toFixed(1)}" y1="${g(a)[1].toFixed(1)}" x2="${g(b)[0].toFixed(1)}" y2="${g(b)[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 const M = "#8C796B", E = "#302621";
 let s = "";
 if (P.k2) s += L("p","k2",12,"#a8978a") + L("k2","f2",10,"#a8978a") + `<line x1="${g("f2")[0]}" y1="${g("f2")[1]}" x2="${g("f2")[0]+12}" y2="${g("f2")[1]}" stroke="#a8978a" stroke-width="7" stroke-linecap="round"/>`;
 s += L("n","p",17,M) + L("p","k",13,M) + L("k","f",11,M);
 s += `<line x1="${g("f")[0]}" y1="${g("f")[1]}" x2="${g("f")[0]+12}" y2="${g("f")[1]}" stroke="${M}" stroke-width="7" stroke-linecap="round"/>`;
 s += L("n","e",8,E) + L("e","a",7,E) + `<circle cx="${g("h")[0]}" cy="${g("h")[1]}" r="10" fill="${M}"/>`;
 const [ax,ay] = g("a");
 if (P.o==="kb") s += `<circle cx="${ax+6}" cy="${ay+7}" r="8" fill="${E}"/><path d="M${ax} ${ay+2}q6 -10 12 0" stroke="${E}" stroke-width="3" fill="none"/>`;
 if (P.o==="db") s += `<rect x="${ax-9}" y="${ay-3}" width="18" height="6" rx="2" fill="${E}"/><rect x="${ax-11}" y="${ay-6}" width="5" height="12" rx="1.5" fill="${E}"/><rect x="${ax+6}" y="${ay-6}" width="5" height="12" rx="1.5" fill="${E}"/>`;
 if (P.o==="bag") s += `<rect x="${ax-8}" y="${ay}" width="16" height="20" rx="4" fill="${E}"/>`;
 return s;
}
const lerpP = (A,B,t) => { const o = {o:A.o}; for (const k of ["h","n","p","k","f","k2","f2","e","a"]){ const a = A[k] || (k==="k2"?A.k:k==="f2"?A.f:null), b = B[k] || (k==="k2"?B.k:k==="f2"?B.f:null); if (!a) continue; o[k] = [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; } return o; };
const thumbSVG = ex => { const hz = HORIZ.includes(ex.key); return `<svg viewBox="${hz ? "-72 -80 172 95" : "-62 -168 150 180"}" preserveAspectRatio="xMidYMax meet"><line x1="-80" y1="0" x2="120" y2="0" stroke="#d6cbbd" stroke-width="2"/>${figSVG(POSES[ex.key])}</svg>`; };
let animRAF = null;
function animate(el, ex){
 cancelAnimationFrame(animRAF);
 const seq = ex.anim, hold = 650, move = 900, step = hold+move; let t0 = null;
 const phEls = () => document.querySelectorAll("[data-ph]");
 const frame = ts => {
  if (!el.isConnected) return;
  if (t0===null) t0 = ts;
  const t = (ts-t0) % (step*seq.length), i = Math.floor(t/step), r = t - i*step;
  const A = POSES[seq[i]], B = POSES[seq[(i+1)%seq.length]];
  let k = r<hold ? 0 : (r-hold)/move; k = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
  el.innerHTML = `<line x1="-140" y1="0" x2="160" y2="0" stroke="#d6cbbd" stroke-width="2.5" stroke-linecap="round"/>` + figSVG(lerpP(A,B,k));
  const pose = k>.5 ? seq[(i+1)%seq.length] : seq[i];
  const cur = Math.max(0, Math.min(ex.ph.length-1, ex.anim.indexOf(pose)));
  phEls().forEach((p,j)=>p.style.color = j===cur ? "var(--esp)" : "var(--moc)");
  animRAF = requestAnimationFrame(frame);
 };
 if (matchMedia("(prefers-reduced-motion: reduce)").matches){ el.innerHTML = `<line x1="-140" y1="0" x2="160" y2="0" stroke="#d6cbbd" stroke-width="2.5"/>`+figSVG(POSES[ex.key]); return; }
 animRAF = requestAnimationFrame(frame);
}

/* ================= NAVIGATION ================= */
let view = "home", planW = curWeek(), hDay = today(), bW = null, exSel = "squat";
const stack = [];
function go(v){ view = v; document.querySelectorAll(".view").forEach(e=>e.classList.toggle("on", e.id==="v-"+v)); document.querySelectorAll("nav.tabs button").forEach(b=>b.classList.toggle("on", b.dataset.v===v)); render(); scrollTo(0,0); }
function render(){ ({home:rHome,plan:rPlan,habits:rHabits,perf:rPerf,bilan:rBilan})[view](); }
function push(fn, args, cls=""){
 const el = document.createElement("div"); el.className = "scr "+cls; document.body.appendChild(el);
 const item = {el, fn, args}; stack.push(item); paint(item);
 requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("open")));
 document.body.style.overflow = "hidden";
}
function paint(item, keep){ const y = item.el.scrollTop; item.el.innerHTML = item.fn(...item.args); if (keep) item.el.scrollTop = y; if (item.after) item.after(); }
function refresh(){ const t = stack[stack.length-1]; if (t) paint(t, true); else render(); }
function replaceTop(fn,args){ const t = stack[stack.length-1]; t.fn = fn; t.args = args; t.after = null; paint(t); t.el.scrollTop = 0; }
function pop(n=1){
 for (let i=0;i<n && stack.length;i++){ const t = stack.pop(); t.el.classList.remove("open"); if (t.cleanup) t.cleanup(); setTimeout(()=>t.el.remove(), 320); }
 if (!stack.length || top_().fn!==sDemo){ clearInterval(restI); $("rest").classList.remove("on"); }
 if (!stack.length){ document.body.style.overflow = ""; render(); } else refresh();
}
const top_ = () => stack[stack.length-1];
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => go(b.dataset.v));

/* ================= ACCUEIL ================= */
function rHome(){
 const t = today(), w = curWeek(), ws = weekStats(w), n = nextSession(), d = new Date();
 let hero;
 if (n){ const p = plan(n), lbl = n===t ? "Aujourd'hui" : DOWL[dow(n)]+" "+fmt(pd(n));
  hero = `<div class="hero tap" data-a="open" data-d="${n}" role="button" tabindex="0"><span class="pill d">${lbl}${p.slot ? " · "+p.slot : ""}</span><div class="t">${p.title}</div><div class="s">${esc(p.short)}${p.eff ? " · effort "+p.eff : ""}</div>${structHTML(p) || '<div style="height:16px"></div>'}<button class="btn o sm" data-a="start" data-d="${n}">${icFill("play")}Démarrer la séance</button></div>`; }
 else hero = `<div class="hero"><span class="pill d">Programme terminé</span><div class="t">12 semaines bouclées</div><div class="s">Fais ton bilan final et fixe ton prochain cap.</div></div>`;
 const strip = weekDays(w).map(s=>{ const p = plan(s), dd = pd(s); let c = "rest", mark = "";
  if (p && p.counts) c = isDone(s) ? "done" : "plan";
  if (s===t) c = "today";
  if (p && p.counts && isDone(s)) mark = `<span class="dot">✓</span>`; else if (p && p.counts && s!==t) mark = `<span class="dot">•</span>`; else mark = `<span class="dot"></span>`;
  return `<button class="wd ${c}" ${p ? `data-a="open" data-d="${s}"` : ""}><small>${DOW[dow(s)][0]}</small><b>${dd.getDate()}</b>${mark}</button>`; }).join("");
 const hd = S.habits[t] || {}, hn = HABITS.filter((_,i)=>hd["h"+i]).length;
 $("v-home").innerHTML = `
 <div class="row"><svg class="logo" viewBox="0 0 894.51 512.62" aria-label="VYRA"><use href="#mark"/></svg><span class="sp"></span><button class="ib" data-a="guide" aria-label="Guide">${ic("book")}</button></div>
 <p class="k" style="margin-top:22px">${DOWL[(d.getDay()+6)%7]} ${d.getDate()} ${MONTHL[d.getMonth()]}</p>
 <h1>${d.getHours()<18 ? "Bonjour" : "Bonsoir"} Léa</h1>
 ${hero}
 <div class="row" style="margin-top:24px"><h2 style="margin:0">${w===0 ? "Semaine de lancement" : "Semaine "+w+" sur 12"}</h2><span class="sp"></span><button class="k" style="background:none;border:0;padding:6px 0" data-a="tab" data-v="plan">Voir le plan</button></div>
 <div class="week">${strip}</div>
 <div class="g3" style="margin-top:12px">
  <div class="card stat">${ic("dumb")}<div class="v">${ws.done} / ${ws.plan}</div><div class="l">Séances</div></div>
  <div class="card stat">${ic("shoe")}<div class="v">${nf(ws.km)} km</div><div class="l">Distance</div></div>
  <div class="card stat">${ic("fire")}<div class="v">${chCount()} / 30</div><div class="l">Challenge</div></div></div>
 <button class="card tap row" data-a="tab" data-v="habits" style="background:var(--oll);border-color:var(--oll);margin-top:12px;width:100%;text-align:left">
  ${ring(hn/7,58,7,"#5F634C","#cfd1c1",hn+"/7")}<div class="sp"><b style="font-size:16px;font-weight:600">Habitudes du jour</b><div class="sub" style="color:var(--old)">${hn===7 ? "Tout est coché, bravo" : "Plus que "+(7-hn)+" engagement"+(7-hn>1?"s":"")+" à cocher"}</div></div><span class="ib" style="background:var(--esp);border:0;color:var(--oat)">${ic("fwd")}</span></button>`;
}

/* ================= PLAN ================= */
function rPlan(){
 const t = today(), cw = curWeek(), ws = weekStats(planW);
 const chips = [...Array(13)].map((_,w)=>`<button class="chip${w===planW?" on":""}${w<cw && w!==planW?" ok":""}" data-a="pw" data-w="${w}">${wLabel(w)}</button>`).join("");
 const rows = weekDays(planW).map(s=>{ const p = plan(s), dd = pd(s);
  if (!p) return `<div class="day rest"><div class="dd">${DOW[dow(s)]}<b>${dd.getDate()}</b></div><div class="dc"></div><div><div class="dt">Avant lancement</div></div><span></span></div>`;
  const st = statusOf(s), done = isDone(s), rest = !p.counts && !p.opt, l = logOf(s);
  let cls = rest || (p.opt && !done) ? "rest" : done ? "done" : ""; if (s===t && p.counts) cls = "today";
  let sub = esc((p.slot ? p.slot+" · " : "")+p.short);
  if (done && p.type==="run" && num(l.dist)) sub = nf(num(l.dist))+" km · "+pace(num(l.dur),num(l.dist))+" /km";
  else if (done && num(l.dur)) sub = Math.round(num(l.dur))+" min"+(num(l.effort) ? " · effort "+num(l.effort) : "");
  let right = "";
  if (done) right = `<span class="ok-dot">${ic("tick")}</span>`;
  else if (s===t && p.counts) right = `<span class="go">Go</span>`;
  else if (st==="reporte") right = `<span class="st-tag st-reporte">Reporté</span>`;
  else if (p.counts) right = `<span style="color:var(--moc)">${ic("fwd")}</span>`;
  return `<button class="day ${cls}" data-a="open" data-d="${s}"><div class="dd">${DOW[dow(s)]}<b>${dd.getDate()}</b></div><div class="dc">${ic(typeIcon(p))}</div><div><div class="dt">${p.title}</div><div class="ds">${sub}</div></div>${right}</button>`; }).join("");
 $("v-plan").innerHTML = `<p class="k">Mon plan${planW ? " · Phase "+phaseOf(planW) : " · Découverte"}</p><h1>${planW===0 ? "Lancement" : "Semaine "+planW}</h1>
 <p class="sub">${fmt(wStart(planW))} – ${fmt(addD(wStart(planW),6))} · ${ws.plan} séances · ${ws.done} réalisée${ws.done>1?"s":""}${DELOAD.includes(planW) ? " · semaine allégée" : ""}</p>
 <div class="chips" id="pchips">${chips}</div><div class="prog"><i style="width:${(cw+1)/13*100}%"></i></div>${rows}
 <div class="tip">${ic("info")}Séance ratée ? On ne la double jamais : reprise au prochain créneau.</div>`;
 const on = document.querySelector("#pchips .on"); if (on) $("pchips").scrollLeft = on.offsetLeft - $("pchips").clientWidth/2 + on.clientWidth/2;
}

/* ================= DÉTAIL SÉANCE ================= */
function stChips(s){ const p = plan(s); const st = statusOf(s); const opts = p.counts || p.opt ? ["prevu","realise","adapte","reporte"] : [];
 return opts.length ? `<div class="stc">${opts.map(o=>`<button class="${o===st?"on":""}" data-a="st" data-d="${s}" data-st="${o}">${ST[o]}</button>`).join("")}</div>` : ""; }
const stepsHTML = a => `<ol class="steps">${a.map((x,i)=>`<li><span class="n ${x[2]||""}">${i+1}</span><div><b>${x[0]}</b><span>${x[1]}</span></div></li>`).join("")}</ol>`;
const backBtn = (d) => `<button class="ib${d?" d":""}" data-a="back" aria-label="Retour">${ic("back")}</button>`;
function sDetail(s){
 const p = plan(s), w = weekOf(s), dd = pd(s), when = DOWL[dow(s)]+" "+fmt(dd)+(p.slot ? " · "+p.slot : "");
 if (p.type==="run"){
  let st;
  if (p.kind==="test") st = [["5 min de marche active","Effort 2"],["20 min de course facile","Ou 2 min course / 1 min marche","e"],["5 min de marche","Relève distance, allure, FC et ressenti"]];
  else if (p.kind==="int") st = [["Échauffement","10–15 min faciles · effort 3–4"],[p.short+" rapides","Contrôlés · effort 7–8","e"],["Récupération 1′30","Marche ou trot entre chaque","m"],["Retour au calme","10 min faciles"]];
  else st = [[p.short.split(" · ")[0]+" de course facile","Effort 3–4 : tu peux parler"],["Si c'est trop dur","Alterne 2 min course / 1 min marche","m"]];
  const kv = p.kind==="int" ? [[p.dur+" min","Durée"],[p.short,"Fractionné"],[p.eff+" / 10","Effort"]] : [[p.dur+" min","Durée"],[p.kind==="test" ? "20 min" : (END.includes(p.dur) ? "Endurance" : "Facile"),"Course"],[p.eff+" / 10","Effort"]];
  const struct = structHTML(p,92,false);
  return `<div class="dhead"><div class="pg">${backBtn(1)}<div style="margin-top:22px"><span class="pill d">${when}</span></div><h1>${p.title}</h1><p class="sub" style="color:var(--sub)">${wLabel(w)==="Lanc." ? "Semaine de lancement" : "Semaine "+w} · ${p.cat}</p>
  <div class="kv">${kv.map(k=>`<div><b>${esc(k[0])}</b><span>${k[1]}</span></div>`).join("")}</div></div></div>
  <div class="pg" style="padding-top:4px">${stChips(s)}<h2>Structure</h2><div class="card" style="padding:14px 14px 10px">${struct}<div class="row" style="font-size:11px;color:var(--moc);font-weight:500"><span>Échauffement</span><span class="sp" style="text-align:center;color:var(--esp);font-weight:600">${p.kind==="int" ? esc(p.short)+" · 1′30 récup" : ""}</span><span>Retour au calme</span></div></div>
  <h2>Déroulé</h2>${stepsHTML(st)}
  ${p.kind==="int" ? `<div class="tip">${ic("info")}Trop dur ? Passe en course / marche. On ne progresse que si la semaine passée a été bien tolérée.</div>` : ""}
  ${p.kind==="test" ? `<div class="tip">${ic("info")}C'est ta référence : note bien ta distance et ton ressenti à la fin.</div>` : ""}
  <div class="tip w">${ic("heart")}Douleur thoracique, malaise ou gros essoufflement : stop et appelle le 15.</div></div>
  <div class="foot"><div><button class="btn l" style="width:auto;padding:0 18px" data-a="journal" data-d="${s}">Saisir</button><button class="btn" data-a="live" data-d="${s}">${icFill("play")}Démarrer</button></div></div>`;
 }
 if (p.type==="force") return sForce(s);
 if (p.type==="hyrox") return sHyrox(s);
 const l = logOf(s);
 const st = p.type==="mobi" ? (w===0 ? [["Marche 30 min","Bonne allure, sans forcer"],["Mobilité 10 min","Hanches, chevilles, épaules, dos"]] : [["Mobilité douce 10–15 min","Ou marche tranquille"],["Le repos fait partie du programme","Rien n'est obligatoire aujourd'hui","m"]])
  : p.type==="sun" ? [["Repos, ou match si tu joues","Un match compte comme une séance intense"],["Fais ton bilan de la semaine","5 minutes, ce soir"],["Réserve tes créneaux","Pour la semaine prochaine","m"]] : [["Repos complet ou marche légère","Récupérer, c'est progresser"],["Mange, bois, dors 7 à 9 h","Pas de régime restrictif","m"]];
 return `<div class="pg">${backBtn()}<p class="k" style="margin-top:22px">${when}</p><h1>${p.title}</h1><p class="sub">${esc(p.short)}</p>${stChips(s)}<h2>Aujourd'hui</h2>${stepsHTML(st)}
 ${p.type==="sun" ? `<button class="btn l sm" data-a="match" data-d="${s}" style="margin-top:6px">${l.match ? "✓ Match joué" : "J'ai joué un match"}</button>` : ""}
 <label class="f" for="nt">Note</label><textarea class="in" id="nt" data-k="feel" data-d="${s}" placeholder="Comment tu te sens ?">${esc(l.feel)}</textarea></div>
 <div class="foot"><div>${p.type==="sun" ? `<button class="btn" data-a="tobilan" data-d="${s}">Faire mon bilan</button>` : p.type==="mobi" ? `<button class="btn" data-a="journal" data-d="${s}">C'est fait</button>` : `<button class="btn l" data-a="back">Fermer</button>`}</div></div>`;
}

/* ---------- RENFORCEMENT ---------- */
function exState(s,id){ const l = ses(s).log; l.ex = l.ex || {}; return l.ex[id] || (l.ex[id] = {log:[]}); }
function sForce(s){
 const p = plan(s), w = weekOf(s), l = logOf(s), sets = setsFor(w), home = !!l.home, when = DOWL[dow(s)]+" "+fmt(pd(s))+" · "+p.slot;
 const next = FORCE.findIndex(e => ((l.ex||{})[e.id]?.log||[]).length < sets);
 const rows = FORCE.map((e,i)=>{ const x = (l.ex||{})[e.id] || {}, n = (x.log||[]).length, done = n>=sets;
  const ch = x.kg ? nf(num(x.kg))+" kg" : (home ? "Maison" : "Charge à noter");
  return `<button class="exr tap" data-a="demo" data-d="${s}" data-i="${i}"><div class="thumb">${thumbSVG(e)}</div><div><b>${home ? e.alt : e.n}</b><span>${sets} × ${e.r} · ${n && !done ? n+"/"+sets+" séries" : ch}</span></div>${done ? `<span class="ok-dot">${ic("tick")}</span>` : `<span class="circ"></span>`}</button>`; }).join("");
 return `<div class="pg">${backBtn()}<p class="k" style="margin-top:22px">${when}</p><h1>Renforcement</h1><p class="sub">${sets} séries · repos 60–90 s · 7 exercices${DELOAD.includes(w) ? " · semaine allégée" : ""}</p>${stChips(s)}
 <div class="seg2"><button class="${home?"":"on"}" data-a="home" data-d="${s}" data-v="0">Salle</button><button class="${home?"on":""}" data-a="home" data-d="${s}" data-v="1">Maison</button></div>
 <h2>Échauffement · 8 min</h2><div class="card" style="font-size:15px">5 min de vélo, rameur ou marche rapide, puis 3 min de mobilité, squats et fentes sans charge.</div>
 <h2>Circuit</h2>${rows}
 <div class="tip">${ic("info")}Garde 2–3 répétitions en réserve. Charge en hausse seulement si la technique reste propre.</div></div>
 <div class="foot"><div>${next>=0 ? `<button class="btn l" style="width:auto;padding:0 18px" data-a="journal" data-d="${s}">Terminer</button><button class="btn" data-a="demo" data-d="${s}" data-i="${next}">${next===0 && !(l.ex) ? "Commencer" : "Continuer"} · ${esc((home?FORCE[next].alt:FORCE[next].n).split(" ").slice(0,2).join(" "))}</button>` : `<button class="btn" data-a="journal" data-d="${s}">Terminer la séance</button>`}</div></div>`;
}
function sDemo(s,i){
 const e = FORCE[i], w = weekOf(s), sets = setsFor(w), l = logOf(s), home = !!l.home, x = exState(s,e.id), n = x.log.length;
 const last = x.log[n-1] || {};
 const hz = HORIZ.includes(e.key);
 return `<div class="pg" style="padding-top:0"><div class="demo"><div class="row"><button class="ib" data-a="back" aria-label="Fermer">${ic("x")}</button><span class="sp"></span><span class="pill" style="background:var(--esp);color:var(--oat)">Exercice ${i+1} / 7</span></div>
 <div class="stage"><svg id="stage" viewBox="${hz ? "-95 -105 210 125" : "-120 -172 250 190"}" preserveAspectRatio="xMidYMax meet"></svg></div>
 <div class="row" style="justify-content:center;gap:18px;font-size:13px;font-weight:600">${e.ph.map((p,j)=>`<span data-ph="${j}">${p}</span>`).join("")}</div></div>
 <div class="row" style="margin-top:18px"><div class="sp"><h1 style="font-size:27px;margin:0">${home ? e.alt : e.n}</h1><p class="sub">${sets} × ${e.r}</p></div><span class="pill" style="background:var(--esp);color:var(--oat)">Série ${Math.min(n+1,sets)} / ${sets}</span></div>
 <div class="card" style="margin-top:12px;padding:10px 14px">${e.cues.map(c=>`<div class="cue"><i>${ic("tick")}</i>${c}</div>`).join("")}</div>
 <div class="tip" style="margin-top:8px">${ic(home ? "dumb" : "home2")}${home ? "En salle : "+e.n : "Maison : "+e.alt}</div>
 <div class="lg"><label><small>Charge</small><input inputmode="decimal" id="lkg" value="${esc(last.kg ?? x.kg ?? "")}" placeholder="kg"></label><label><small>Reps</small><input inputmode="numeric" id="lrep" value="${esc(last.reps ?? "")}" placeholder="${esc(e.r.split(" ")[0])}"></label><label><small>Effort /10</small><input inputmode="numeric" id="leff" value="${esc(last.eff ?? "")}" placeholder="–"></label></div>
 ${n ? `<div class="sets">${x.log.map((z,j)=>`<span>Série ${j+1} · ${z.kg ? nf(num(z.kg))+" kg × " : ""}${esc(z.reps || "–")}</span>`).join("")}</div>` : ""}
 </div>
 <div class="foot"><div><button class="btn l" style="width:auto;padding:0 18px" data-a="rest">${ic("timer")}1:30</button><button class="btn" data-a="setok" data-d="${s}" data-i="${i}">${n>=sets ? "Exercice suivant" : "Valider la série"}</button></div></div>`;
}

/* ---------- HYROX ---------- */
function sHyrox(s){
 const p = plan(s), w = weekOf(s), ph = w===0 ? 1 : phaseOf(w), l = ses(s).log; l.st = l.st || [];
 const list = HY[ph], home = !!l.home, done = list.filter((_,i)=>l.st[i]).length, cur = list.findIndex((_,i)=>!l.st[i]);
 const nm = x => { if (!home) return x; for (const [r,a] of SUBS) if (r.test(x)) return a+" · "+x.match(/^\d+ ?m?/)?.[0]; return x; };
 const icn = x => /course/.test(x) ? "shoe" : /rameur|SkiErg|burpee|Burpee/i.test(x) ? "bolt" : "dumb";
 const note = (w<=1 ? "Première fois : la moitié du circuit suffit. " : "")+(DELOAD.includes(w) ? "Semaine allégée : retire un tiers du circuit. " : "")+(ph===3 ? "Simulation partielle seulement si les phases 1 et 2 sont maîtrisées. " : "")+"Si jeudi a été dur, reste modérée.";
 return `<div class="pg">${backBtn()}<p class="k" style="margin-top:22px">${DOWL[dow(s)]} ${fmt(pd(s))} · ${p.slot}</p><h1>${p.title}</h1><p class="sub">Phase ${ph} · ${HYDUR[ph]} · effort contrôlé</p>${stChips(s)}
 <div class="card dark row" style="margin-top:14px">${ring(done/list.length,56,6,"#A4A78E","#4a3d36",done+"/"+list.length)}<div class="sp"><b style="font-size:16px;font-weight:600">${cur<0 ? "Circuit terminé" : "Station "+(cur+1)+" · "+esc(nm(list[cur]))}</b><div class="sub">Pauses autorisées, pas de chrono max</div></div></div>
 <div class="seg2"><button class="${home?"":"on"}" data-a="home" data-d="${s}" data-v="0">Salle</button><button class="${home?"on":""}" data-a="home" data-d="${s}" data-v="1">Sans salle</button></div>
 <h2>Échauffement 10 min, puis</h2>
 ${list.map((x,i)=>`<button class="sta ${l.st[i]?"d":""} ${i===cur?"c":""}" data-a="sta" data-d="${s}" data-i="${i}"><span class="n">${l.st[i] ? ic("tick").replace('class="i"','class="i" style="width:16px;height:16px;stroke-width:2.6"') : i+1}</span>${ic(icn(x))}<span class="t">${esc(nm(x))}</span></button>`).join("")}
 <p class="sub" style="margin:10px 0 0">Puis retour au calme 5–10 min.</p>
 <div class="tip">${ic("info")}${note}</div>
 <button class="btn l sm" style="margin-top:12px" data-a="match" data-d="${s}">${l.match ? "✓ Match joué à la place" : "J'ai joué un match à la place"}</button></div>
 <div class="foot"><div>${cur<0 ? `<button class="btn" data-a="journal" data-d="${s}">Terminer la séance</button>` : `<button class="btn l" style="width:auto;padding:0 18px" data-a="journal" data-d="${s}">Terminer</button><button class="btn" data-a="sta" data-d="${s}" data-i="${cur}">Station suivante</button>`}</div></div>`;
}

/* ---------- COURSE EN DIRECT ---------- */
let LV = null;
function sLive(s){
 const p = plan(s), sg = LV.sg, i = LV.i, cur = sg[i], nx = sg[i+1];
 const reps = sg.filter(x=>x.rep);
 return `<div class="pg">
 <div class="row" style="font-size:15px;font-weight:500"><span style="color:var(--oli)">${cur.rep ? "Répétition "+cur.rep+" sur "+cur.reps : "Étape "+(i+1)+" sur "+sg.length}</span><span class="sp"></span><span style="color:#8a8580">${p.title}</span></div>
 <div style="text-align:center;margin-top:9vh"><div class="lab" id="lvlab">${cur.n}</div><div class="clock" id="lvclock">0:00</div><div style="color:#8a8580;margin-top:10px" id="lvsub">${esc(cur.e)}</div></div>
 <div style="height:6px;border-radius:3px;background:#2a2826;margin-top:28px;overflow:hidden"><i id="lvbar" style="display:block;height:100%;width:0;background:var(--oli)"></i></div>
 <div class="lnum"><div><b id="lvel">0:00</b><span>écoulé</span></div><div><b id="lvrest">0:00</b><span>restant</span></div></div>
 ${reps.length ? `<div class="segbar">${reps.map(r=>{ const k = sg.indexOf(r); return `<i class="${k<i?"d":k===i?"c":""}"></i>`; }).join("")}</div>` : ""}
 ${nx ? `<div style="margin-top:24px;border-top:1px solid #2a2826;padding-top:16px"><div style="font-size:13px;color:#8a8580">Ensuite</div><div style="font-size:17px;font-weight:600">${nx.n} · ${fmtT(nx.d)}</div></div>` : ""}
 <div class="ctl"><button data-a="lvstop" aria-label="Terminer">${ic("stop")}</button><button class="main" data-a="lvpause" aria-label="Pause">${LV.run ? ic("pause") : icFill("play")}</button><button data-a="lvskip" aria-label="Étape suivante">${ic("skip")}</button></div></div>`;
}
const fmtT = sec => { sec = Math.max(0,Math.round(sec)); const h = Math.floor(sec/3600), m = Math.floor(sec%3600/60), x = sec%60; return (h ? h+":"+String(m).padStart(2,"0") : m)+":"+String(x).padStart(2,"0"); };
let actx = null;
function beep(f=880,d=.18,n=1){ try { actx = actx || new (window.AudioContext||window.webkitAudioContext)(); for (let k=0;k<n;k++){ const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; o.connect(g); g.connect(actx.destination); const t = actx.currentTime + k*.25; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.35,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.start(t); o.stop(t+d+.02); } } catch(e){} try { navigator.vibrate && navigator.vibrate(n>1?[200,100,200]:200); } catch(e){} }
let wake = null;
async function wakeOn(){ try { wake = await navigator.wakeLock.request("screen"); } catch(e){} }
function wakeOff(){ try { wake && wake.release(); } catch(e){} wake = null; }
document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState==="visible" && LV && LV.run) wakeOn(); });
function startLive(s){
 const p = plan(s); LV = {s, sg:segs(p), i:0, segStart:Date.now(), segAcc:0, total:0, totStart:Date.now(), run:true};
 beep(660,.15); wakeOn();
 push(sLive,[s],"up live");
 const t = top_(); t.cleanup = () => { clearInterval(LV && LV.tick); wakeOff(); };
 LV.tick = setInterval(tickLive, 250); tickLive();
}
function lvElapsed(){ return LV.segAcc + (LV.run ? (Date.now()-LV.segStart)/1000 : 0); }
function lvTotal(){ return LV.total + (LV.run ? (Date.now()-LV.totStart)/1000 : 0); }
function tickLive(){
 if (!LV) return; const cur = LV.sg[LV.i], el = lvElapsed();
 if (el >= cur.d){ nextSeg(true); return; }
 const left = cur.d - el, remain = left + LV.sg.slice(LV.i+1).reduce((a,x)=>a+x.d,0);
 const c = $("lvclock"); if (!c) return;
 c.textContent = fmtT(left); $("lvel").textContent = fmtT(lvTotal()); $("lvrest").textContent = fmtT(remain);
 $("lvbar").style.width = (el/cur.d*100).toFixed(1)+"%";
 if (left<=3.2 && left>2.95) beep(520,.1);
}
function nextSeg(auto){
 if (LV.i >= LV.sg.length-1){ finishLive(); return; }
 LV.i++; LV.segAcc = 0; LV.segStart = Date.now();
 const c = LV.sg[LV.i]; beep(c.rep ? 990 : 700, .2, c.rep ? 2 : 1);
 refresh();
}
function finishLive(){
 const min = Math.max(1, Math.round(lvTotal()/60)), s = LV.s; clearInterval(LV.tick); wakeOff(); beep(880,.25,3);
 const l = ses(s).log; l.dur = String(min); save(); LV = null;
 const t = top_(); t.cleanup = null; t.fn = sJournal; t.args = [s]; t.el.className = "scr up open"; paint(t); t.el.scrollTop = 0;
}

/* ---------- JOURNAL FIN DE SÉANCE ---------- */
const MOODS = ["Facile","Bien","Dur","Douleur"];
function sJournal(s){
 const p = plan(s), l = ses(s).log, eff = num(l.effort);
 const cols = ["#E4E5D9","#E4E5D9","#E4E5D9","#E4E5D9","#EAE3DA","#EAE3DA","#e8d9cc","#e8d9cc","#e6cfc4","#e6cfc4"];
 let top = "";
 if (p.type==="run") top = `<div class="g3"><label class="card stat" style="text-align:center"><input class="in" style="border:0;padding:0;text-align:center;font-size:22px;font-weight:600;background:none" inputmode="decimal" data-k="dist" data-d="${s}" value="${esc(l.dist)}" placeholder="0,0"><div class="l">Distance km</div></label><label class="card stat" style="text-align:center"><input class="in" style="border:0;padding:0;text-align:center;font-size:22px;font-weight:600;background:none" inputmode="numeric" data-k="dur" data-d="${s}" value="${esc(l.dur)}" placeholder="${p.dur}"><div class="l">Durée min</div></label><div class="card stat" style="text-align:center"><div class="v" id="jpace" style="margin-top:0;font-size:22px;padding:6px 0 2px">${pace(num(l.dur),num(l.dist))}</div><div class="l">Allure /km</div></div></div>`;
 else if (p.type==="hyrox") top = `<div class="g2"><label class="card stat" style="text-align:center"><input class="in" style="border:0;padding:0;text-align:center;font-size:22px;font-weight:600;background:none" inputmode="numeric" data-k="dur" data-d="${s}" value="${esc(l.dur)}" placeholder="${p.dur}"><div class="l">Temps total min</div></label><label class="card stat" style="text-align:center"><input class="in" style="border:0;padding:0;text-align:center;font-size:22px;font-weight:600;background:none" inputmode="decimal" data-k="km" data-d="${s}" value="${esc(l.km)}" placeholder="0,0"><div class="l">Km courus</div></label></div>`;
 else top = `<div class="g2"><label class="card stat" style="text-align:center"><input class="in" style="border:0;padding:0;text-align:center;font-size:22px;font-weight:600;background:none" inputmode="numeric" data-k="dur" data-d="${s}" value="${esc(l.dur)}" placeholder="${p.dur||""}"><div class="l">Durée min</div></label><div class="card stat" style="text-align:center"><div class="v" style="margin-top:0;font-size:22px;padding:6px 0 2px">${p.type==="force" ? FORCE.filter(e=>((l.ex||{})[e.id]?.log||[]).length).length+" / 7" : "✓"}</div><div class="l">${p.type==="force" ? "Exercices notés" : "Séance"}</div></div></div>`;
 return `<div class="pg" style="padding-top:0"><div class="sumtop"><svg class="logo" viewBox="0 0 894.51 512.62"><use href="#mark"/></svg><h1>Séance terminée</h1><p class="sub" style="color:var(--old)">${p.title} · ${DOWL[dow(s)].toLowerCase()} ${fmt(pd(s))}</p></div>
 <div style="margin-top:-34px">${top}</div>
 <h2>Comment c'était ?</h2><p class="sub">Effort ressenti sur 10</p>
 <div class="rpe">${[...Array(10)].map((_,i)=>`<button class="${eff===i+1?"on":""}" style="background:${cols[i]}" data-a="rpe" data-d="${s}" data-v="${i+1}">${i+1}</button>`).join("")}</div>
 <div class="rpel"><span>Récup</span><b>${eff ? EFFORT[eff] : "Touche un chiffre"}</b><span>Max</span></div>
 <label class="f">Ressenti</label><div class="moods">${MOODS.map(m=>`<button class="${l.mood===m?"on":""}" data-a="mood" data-d="${s}" data-v="${m}">${m}</button>`).join("")}</div>
 ${l.mood==="Douleur" ? `<div class="tip w">${ic("heart")}Douleur persistante : allège ou suspends l'effort concerné et demande un avis médical.</div>` : ""}
 ${p.type==="run" ? `<label class="f">FC moyenne (facultatif)</label><input class="in" inputmode="numeric" data-k="fc" data-d="${s}" value="${esc(l.fc)}" placeholder="bpm">` : ""}
 <label class="f">Note</label><textarea class="in" data-k="feel" data-d="${s}" placeholder="Jambes, souffle, technique, motivation…">${esc(l.feel)}</textarea></div>
 <div class="foot"><div><button class="btn l" style="width:auto;padding:0 18px" data-a="saveadapt" data-d="${s}">Adaptée</button><button class="btn" data-a="savedone" data-d="${s}">Enregistrer</button></div></div>`;
}

/* ================= HABITUDES ================= */
function rHabits(){
 const t = today(), hd = S.habits[hDay] || {}, d = pd(hDay), n = HABITS.filter((_,i)=>hd["h"+i]).length, inCh = chDays.includes(hDay);
 $("v-habits").innerHTML = `<p class="k">${hDay===t ? "Aujourd'hui" : DOWL[dow(hDay)]} · ${d.getDate()} ${MONTHL[d.getMonth()]}</p>
 <div class="row"><h1 class="sp">Mes habitudes</h1><button class="ib" data-a="hd" data-v="-1" aria-label="Jour précédent">${ic("back")}</button><button class="ib" data-a="hd" data-v="1" aria-label="Jour suivant" ${hDay>=t?"disabled style='opacity:.35'":""}>${ic("fwd")}</button></div>
 <div class="card dark row" style="margin-top:12px;padding:18px">${ring(chCount()/30,88,10,"#A4A78E","#4a3d36",`<span style="font-size:26px">${chCount()}</span><span style="font-size:12px;font-weight:500;color:var(--sub)">/ 30</span>`)}<div class="sp"><b style="font-size:18px;font-weight:600">Challenge 30 jours</b><div class="sub">Jusqu'au 23 décembre</div><div style="color:var(--oli);font-weight:600;font-size:13px;margin-top:4px">${plur(chSessions(),"séance")} sur 16 visées</div></div></div>
 <div class="card" style="margin-top:12px;padding:4px 16px">${HABITS.map((x,i)=>`<button class="hab ${hd["h"+i]?"on":""}" data-a="hab" data-i="${i}"><span class="bx">${hd["h"+i] ? ic("tick") : ""}</span>${x}</button>`).join("")}</div>
 <div class="g2" style="margin-top:12px">
  <div class="card"><div class="row k">${ic("moon")}Sommeil</div><div class="stp"><button data-a="sl" data-v="-0.5" aria-label="Moins">${ic("minus")}</button><b>${hd.sleep ? nf(hd.sleep)+" h" : "—"}</b><button data-a="sl" data-v="0.5" aria-label="Plus">${ic("plus")}</button></div></div>
  <div class="card"><div class="row k">${ic("bolt")}Énergie</div><div class="stp"><button data-a="en" data-v="-1" aria-label="Moins">${ic("minus")}</button><b>${hd.energy ? hd.energy+" / 10" : "—"}</b><button data-a="en" data-v="1" aria-label="Plus">${ic("plus")}</button></div></div></div>
 ${inCh ? `<button class="btn ${S.challenge[hDay] ? "l" : "o"}" style="margin-top:12px" data-a="ch" data-d="${hDay}">${S.challenge[hDay] ? "✓ Journée validée" : "Je valide ma journée"}</button>` : ""}
 <h2>Les 30 jours</h2><p class="sub">Coche un jour si tes engagements adaptés sont tenus, repos compris. Pas de rattrapage forcé.</p>
 <div class="ch30">${chDays.map((x,i)=>{ const dd = pd(x); return `<button class="${S.challenge[x]?"on":""}${x===t?" td":""}" data-a="ch" data-d="${x}" ${x>t?"disabled":""} aria-label="Jour ${i+1}">${i+1}<small>${dd.getDate()}/${dd.getMonth()+1}</small></button>`; }).join("")}</div>
 <div class="tip" style="margin-top:14px">${ic("info")}Vise 7 à 9 h de sommeil : ne le sacrifie jamais pour le sport.</div>`;
}

/* ================= PROGRÈS ================= */
let ros = [];
function rPerf(){
 ros.forEach(r=>r.disconnect()); ros = [];
 const cw = curWeek(), a = assiduite(); let totKm = 0, totMin = 0, rMin = 0, rKm = 0; const wk = [];
 for (let w=0; w<=12; w++){ const s = weekStats(w); wk.push(s.km); totKm += s.km; totMin += s.min; rMin += s.runMin; rKm += s.runKm; }
 const runs = [], eff = [], dn = [];
 for (let w=0; w<=12; w++) for (const s of weekDays(w)){ const p = plan(s); if (!p || !isDone(s)) continue; const l = logOf(s); dn.push(s);
  if (p.type==="run" && num(l.dur)) runs.push({x:s,y:num(l.dur),d:num(l.dist)}); if (num(l.effort)) eff.push({x:s,y:num(l.effort)}); }
 const exs = []; for (const s of dn){ const x = (logOf(s).ex||{})[exSel]; if (x && num(x.kg)) exs.push({x:s,y:num(x.kg),w:weekOf(s)}); }
 const maxK = Math.max(1, ...wk), maxKg = Math.max(1, ...exs.map(e=>e.y));
 const longest = runs.reduce((m,r)=>r.y>m.y?r:m,{y:0}), far = runs.reduce((m,r)=>r.d>m.d?r:m,{d:0}), best = runs.filter(r=>r.d).reduce((m,r)=>!m || r.y/r.d<m.y/m.d ? r : m, null);
 const prevKm = cw>0 ? wk[cw-1] : 0, delta = wk[cw]-prevKm;
 $("v-perf").innerHTML = `<p class="k">${cw===0 ? "Semaine de lancement" : "Semaine "+cw} · tendance</p><h1>Ma progression</h1>
 <div class="g2" style="margin-top:14px"><div class="card dark"><div class="k">Volume running</div><div style="font-size:26px;font-weight:600;margin-top:6px">${nf(totKm)} km</div><div style="font-size:12px;font-weight:600;color:var(--oli)">${cw>0 ? (delta>=0?"+":"")+nf(delta)+" km vs "+wLabel(cw-1) : nf(wk[0])+" km cette semaine"}</div></div>
 <div class="card"><div class="k">Assiduité</div><div style="font-size:26px;font-weight:600;margin-top:6px">${a ? a.pct+" %" : "—"}</div><div style="font-size:12px;font-weight:600;color:var(--old)">${a ? plur(a.d,"séance")+" sur "+a.p : "Pas encore de séance passée"}</div></div></div>
 <div class="card" style="margin-top:12px"><b style="font-weight:600">Kilomètres par semaine</b><div class="bars">${wk.map((k,w)=>`<div class="${w===cw?"cur":""}"><div class="tr"><i style="height:${(k/maxK*100).toFixed(1)}%"></i></div><small>${w===0?"L":w}</small></div>`).join("")}</div></div>
 <div class="card" style="margin-top:12px"><div class="row"><b class="sp" style="font-weight:600">Durée des sorties</b><span class="k">min</span></div><div class="fig" id="g1"></div></div>
 <div class="card" style="margin-top:12px"><div class="row"><b class="sp" style="font-weight:600">Effort ressenti</b><span class="k">/10</span></div><div class="fig" id="g2"></div></div>
 <div class="card" style="margin-top:12px"><div class="row"><b class="sp" style="font-weight:600">Charges</b><select class="in" id="exs" aria-label="Exercice">${FORCE.filter(e=>!["pompes","gainage"].includes(e.id)).map(e=>`<option value="${e.id}" ${e.id===exSel?"selected":""}>${e.n}</option>`).join("")}</select></div>
 ${exs.length ? exs.slice(-6).map((e,i,arr)=>`<div class="hb"><span class="k">${wLabel(e.w)}</span><div class="tr"><i class="${i===arr.length-1?"last":""}" style="width:${(e.y/maxKg*100).toFixed(1)}%"></i></div><b>${nf(e.y)} kg</b></div>`).join("") : `<p class="sub" style="margin-top:10px">Note tes charges pendant le renforcement pour voir leur évolution.</p>`}</div>
 <h2>Mes repères</h2><div class="card" style="padding:4px 16px"><table>
 <tr><td>Sortie la plus longue</td><td class="r">${longest.y ? longest.y+" min" : "—"}</td></tr><tr><td>Plus grande distance</td><td class="r">${far.d ? nf(far.d)+" km" : "—"}</td></tr>
 <tr><td>Meilleure allure</td><td class="r">${best ? pace(best.y,best.d)+" /km" : "—"}</td></tr><tr><td>Allure moyenne</td><td class="r">${rKm ? pace(rMin,rKm)+" /km" : "—"}</td></tr>
 <tr><td>Minutes actives</td><td class="r">${Math.round(totMin)} min</td></tr><tr><td>Objectif éventuel</td><td class="r">8–10 km en continu</td></tr></table></div>`;
 line("g1",runs,"min"); line("g2",eff,"",10);
 $("exs").onchange = e => { exSel = e.target.value; rPerf(); };
}
function line(id,pts,u,maxY){
 const el = $(id); if (!pts.length){ el.style.height = "auto"; el.innerHTML = `<p class="sub">Les données apparaîtront après tes premières séances.</p>`; return; }
 const s = document.createElementNS("http://www.w3.org/2000/svg","svg"); el.appendChild(s);
 const draw = () => { const W = s.clientWidth, H = s.clientHeight; if (!W) return; const L = 26, R = 14, T = 16, B = 22;
  const mx = maxY || Math.max(10, Math.ceil(Math.max(...pts.map(p=>p.y))*1.2/10)*10), X = i => pts.length===1 ? L+(W-L-R)/2 : L+i*(W-L-R)/(pts.length-1), Y = v => T+(H-T-B)*(1-v/mx);
  let g = ""; for (let k=0;k<=2;k++){ const v = mx*k/2; g += `<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#E3DCD0" stroke-dasharray="3 4"/><text x="${L-6}" y="${Y(v)+4}" font-size="10" text-anchor="end" fill="#8C796B">${Math.round(v)}</text>`; }
  const d = pts.map((p,i)=>(i?"L":"M")+X(i).toFixed(1)+" "+Y(p.y).toFixed(1)).join(" ");
  g += `<path d="${d} L${X(pts.length-1)} ${Y(0)} L${X(0)} ${Y(0)}Z" fill="#A4A78E" opacity=".22"/><path d="${d}" fill="none" stroke="#5F634C" stroke-width="2.5" stroke-linejoin="round"/>`;
  const stp = Math.ceil(pts.length/(W<360?4:6));
  pts.forEach((p,i)=>{ g += `<circle cx="${X(i)}" cy="${Y(p.y)}" r="4.5" fill="#FFFDF9" stroke="#5F634C" stroke-width="2.2"/>`; if (i%stp===0 || i===pts.length-1){ const dd = pd(p.x); g += `<text x="${X(i)}" y="${H-4}" font-size="10" text-anchor="middle" fill="#8C796B">${dd.getDate()}/${dd.getMonth()+1}</text>`; } });
  const lp = pts[pts.length-1]; g += `<text x="${X(pts.length-1)}" y="${Y(lp.y)-11}" font-size="11" font-weight="700" text-anchor="middle" fill="#302621">${nf(lp.y)}${u==="min"?"′":""}</text>`;
  s.innerHTML = g; };
 const ro = new ResizeObserver(draw); ro.observe(s); ros.push(ro);
}

/* ================= BILAN ================= */
const DEC = [["suivre","Suivre le plan","Séances tolérées et bonne récup : on avance."],["repeter","Répéter","La fatigue s'accumule : on refait la même semaine."],["alleger","Alléger","On réduit durées et charges."],["suspendre","Suspendre","Douleur ou maladie : on suspend l'effort concerné, reprise progressive."]];
function rBilan(){
 if (bW===null) bW = curWeek();
 const s = weekStats(bW), r = S.reviews["w"+bW] || {}, d0 = wStart(bW);
 const chips = [...Array(13)].map((_,w)=>`<button class="chip${w===bW?" on":""}${S.reviews["w"+w]?.saved && w!==bW?" ok":""}" data-a="bw" data-w="${w}">${wLabel(w)}</button>`).join("");
 const sq = (k,v) => `<div class="row" style="margin-top:12px"><span style="width:92px;font-weight:500">${k==="energy"?"Énergie":"Motivation"}</span><div class="sq sp">${[...Array(10)].map((_,i)=>`<button class="${i<v?"on":""}" data-a="sq" data-k="${k}" data-v="${i+1}" aria-label="${i+1}"></button>`).join("")}</div><b style="width:20px;text-align:right">${v||"–"}</b></div>`;
 const dec = DEC.find(x=>x[0]===r.dec);
 $("v-bilan").innerHTML = `<p class="k">Dimanche ${fmt(addD(d0,6))}</p><h1>Bilan de la semaine</h1>
 <div class="chips" id="bchips">${chips}</div>
 <div class="card dark" style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;row-gap:18px;padding:20px">
  ${[[s.done+" / "+s.plan,"Séances"],[nf(s.km),"Km"],[s.longest ? s.longest+"′" : "—","Plus longue"],[s.sleep ? nf(s.sleep)+" h" : "—","Sommeil moyen"],[s.runKm ? pace(s.runMin,s.runKm) : "—","Allure /km"],[s.effort ? nf(s.effort)+" / 10" : "—","Effort moyen"]].map(x=>`<div><div style="font-size:26px;font-weight:600;letter-spacing:-.01em">${x[0]}</div><div class="k">${x[1]}</div></div>`).join("")}</div>
 <h2>Ressenti</h2>${sq("energy",num(r.energy))}${sq("motiv",num(r.motiv))}
 ${[["win","Ma plus belle réussite"],["brake","Ce qui m'a freinée"],["pain","Douleurs, gêne, fatigue"],["adjust","Ajustement pour la semaine suivante"]].map(([k,lab])=>`<label class="f">${lab}</label><textarea class="in" style="min-height:64px" data-b="${k}">${esc(r[k])}</textarea>`).join("")}
 <h2>Décision pour ${bW<12 ? "la semaine "+(bW+1) : "la suite"}</h2>
 <div class="moods">${DEC.map(x=>`<button class="${r.dec===x[0]?"on":""}" data-a="dec" data-v="${x[0]}">${x[1]}</button>`).join("")}</div>
 ${dec ? `<div class="tip">${ic("info")}${dec[2]}</div>` : ""}
 <button class="btn" style="margin-top:16px" data-a="bsave">${r.saved ? "Bilan enregistré ✓" : "Enregistrer mon bilan"}</button>
 <p class="sub" style="margin-top:12px;font-size:13px">Un match joué compte comme une séance intense. Les repos ne sont pas des séances manquées.</p>`;
 const on = document.querySelector("#bchips .on"); if (on) $("bchips").scrollLeft = on.offsetLeft - $("bchips").clientWidth/2 + on.clientWidth/2;
}

/* ================= GUIDE ================= */
function sGuide(){
 const tb = (rows,head) => `<table>${head ? `<tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr>` : ""}${rows.map(r=>`<tr>${r.map((c,i)=>`<td${i===0?' style="font-weight:600"':""}>${c}</td>`).join("")}</tr>`).join("")}</table>`;
 return `<div class="pg">${backBtn()}<p class="k" style="margin-top:22px">Guide</p><h1>Mes repères</h1>
 <h2>Alimentation</h2><div class="card" style="padding:4px 16px">${tb([["Petit-déj","Skyr, avoine, banane, miel"],["Déjeuner","Poulet, riz, légumes, huile d'olive"],["Collation","Fruit, yaourt, amandes"],["Avant sport","Banane ou tartine, si besoin"],["Dîner","Saumon, pommes de terre, légumes"]])}</div>
 <p class="sub" style="margin-top:8px">Adapte les quantités à ta faim et à ton activité. Pas de régime restrictif.</p>
 <h2>Échelle d'effort</h2><div class="card" style="padding:4px 16px">${tb([["1–2","Récupération"],["3–4","Endurance, conversation possible"],["5–6","Soutenu"],["7–8","Fractionné maîtrisé"],["9–10","Maximal, à éviter"]])}</div>
 <h2>Ma routine</h2><div class="card" style="padding:4px 16px">${tb([["Réveil","6h30","6h45"],["Sport","Lun 7h · Mar 18h30","Jeu 17h15"],["Journée","9h–12h / 14h–18h","8h30–16h30"],["Coucher","22h30","22h30–23h"]],["","Lun–mer","Jeu–ven"])}</div>
 <h2>Mes engagements</h2>${stepsHTML([["Préparer ma tenue la veille","Et réserver mes créneaux le dimanche"],["Règle des 10 minutes","Quand la motivation manque, sauf maladie ou douleur"],["Ne jamais doubler une séance ratée","On reprend au prochain créneau","m"],["Noter mes progrès","Sans rechercher la perfection"]])}
 <h2>Cap sur 2027</h2>${stepsHTML([["Décembre","Régularité"],["Janvier","Endurance et force"],["Février","Bilan, éventuel objectif 8–10 km"],["Mars – avril","Préparation spécifique si prête","m"],["Printemps – été","Envisager un premier HYROX","e"]])}
 <h2>Sécurité</h2><div class="tip w" style="margin-top:0;align-items:flex-start">${ic("heart")}<span>Fatigue importante, douleur persistante ou essoufflement inhabituel : arrête ou allège et demande un avis médical. Douleur thoracique, malaise ou forte gêne respiratoire : stop et appelle le 15.</span></div>
 <h2>Sauvegarde</h2><div class="card"><p class="sub" style="margin-bottom:12px">Tes données restent sur ton iPhone. Fais une sauvegarde de temps en temps et range-la dans Fichiers.</p>
 <button class="btn sm" data-a="export">Exporter ma sauvegarde</button>
 <button class="btn l sm" style="margin-top:8px" data-a="importf">Importer un fichier</button><input type="file" id="impf" accept="application/json,.json,.txt" hidden>
 <details style="margin-top:12px"><summary class="k" style="cursor:pointer">Coller une sauvegarde (texte)</summary><textarea class="in" id="impt" style="margin-top:8px;font-size:12px" placeholder="Colle ici le texte copié depuis My Training Club"></textarea><button class="btn l sm" style="margin-top:8px" data-a="importt">Importer ce texte</button></details></div>
 <p class="sub" style="text-align:center;margin-top:28px;font-size:12px">VYRA · ton coach, ton rythme</p></div>`;
}
function doImport(txt){
 try { const r = JSON.parse(txt); if (!r || typeof r!=="object" || !r.sessions) throw 0; S = Object.assign(blank(), r); S.updatedAt = Date.now(); localStorage.setItem(KEY, JSON.stringify(S)); toast("Sauvegarde importée"); pop(); }
 catch(e){ toast("Ce fichier n'est pas une sauvegarde valide"); }
}

/* ================= REPOS (minuteur) ================= */
let restI = null;
function startRest(sec=90){
 clearInterval(restI); const end = Date.now()+sec*1000, box = $("rest"); box.classList.add("on");
 const show = () => { const left = Math.max(0,(end-Date.now())/1000); $("restT").textContent = fmtT(left); if (left<=0){ clearInterval(restI); $("restT").textContent = "C'est reparti"; beep(880,.2,2); setTimeout(()=>box.classList.remove("on"),2200); } };
 show(); restI = setInterval(show,250);
}

/* ================= ÉVÉNEMENTS ================= */
const A = {
 tab: t => go(t.dataset.v),
 open: t => push(sDetail,[t.dataset.d]),
 start: t => { const s = t.dataset.d, p = plan(s); if (p.type==="run") startLive(s); else push(sDetail,[s]); },
 guide: () => push(sGuide,[]),
 back: () => pop(),
 pw: t => { planW = +t.dataset.w; rPlan(); },
 bw: t => { bW = +t.dataset.w; rBilan(); },
 st: t => { ses(t.dataset.d).status = t.dataset.st; save(); refresh(); },
 live: t => startLive(t.dataset.d),
 journal: t => push(sJournal,[t.dataset.d],"up"),
 home: t => { ses(t.dataset.d).log.home = t.dataset.v==="1"; save(); refresh(); },
 demo: t => { const s = t.dataset.d, i = +t.dataset.i; if (top_() && top_().fn===sDemo) replaceTop(sDemo,[s,i]); else push(sDemo,[s,i],"up"); top_().after = () => animate($("stage"), FORCE[top_().args[1]]); top_().after(); },
 setok: t => { const s = t.dataset.d, i = +t.dataset.i, e = FORCE[i], x = exState(s,e.id), sets = setsFor(weekOf(s));
  if (x.log.length >= sets){ const nx = FORCE.findIndex((f,j)=>j>i && (exState(s,f.id).log||[]).length<sets); if (nx>=0){ replaceTop(sDemo,[s,nx]); top_().after = () => animate($("stage"), FORCE[nx]); top_().after(); } else pop(); return; }
  const kg = $("lkg").value, reps = $("lrep").value, eff = $("leff").value; x.log.push({kg,reps,eff}); x.kg = kg || x.kg; x.reps = reps; x.eff = eff; x.sets = x.log.length;
  if (statusOf(s)==="prevu") ses(s).status = "realise"; save();
  if (x.log.length < sets){ startRest(90); refresh(); toast("Série "+x.log.length+" notée · repos"); }
  else { const nx = FORCE.findIndex((f,j)=>j>i && (exState(s,f.id).log||[]).length<sets); toast("Exercice terminé");
   if (nx>=0){ startRest(90); replaceTop(sDemo,[s,nx]); top_().after = () => animate($("stage"), FORCE[nx]); top_().after(); } else { pop(); } } },
 rest: () => startRest(90),
 sta: t => { const s = t.dataset.d, i = +t.dataset.i, l = ses(s).log; l.st = l.st || []; l.st[i] = !l.st[i]; if (statusOf(s)==="prevu" && l.st.some(Boolean)) ses(s).status = "realise"; save(); refresh(); },
 match: t => { const s = t.dataset.d, l = ses(s).log; l.match = !l.match; if (l.match && plan(s).counts) ses(s).status = "adapte"; save(); refresh(); toast(l.match ? "Match noté : il compte comme séance intense" : "Match retiré"); },
 tobilan: t => { bW = weekOf(t.dataset.d); pop(stack.length); go("bilan"); },
 lvpause: () => { if (LV.run){ LV.segAcc = lvElapsed(); LV.total = lvTotal(); LV.run = false; wakeOff(); } else { LV.segStart = Date.now(); LV.totStart = Date.now(); LV.run = true; wakeOn(); } refresh(); },
 lvskip: () => { LV.total = lvTotal(); LV.totStart = Date.now(); nextSeg(false); },
 lvstop: () => finishLive(),
 rpe: t => { ses(t.dataset.d).log.effort = +t.dataset.v; save(); refresh(); },
 mood: t => { const l = ses(t.dataset.d).log; l.mood = l.mood===t.dataset.v ? "" : t.dataset.v; save(); refresh(); },
 savedone: t => { const s = t.dataset.d; if (statusOf(s)!=="adapte") ses(s).status = "realise"; save(); pop(stack.length); toast("Séance enregistrée"); },
 saveadapt: t => { ses(t.dataset.d).status = "adapte"; save(); pop(stack.length); toast("Séance enregistrée comme adaptée"); },
 hd: t => { const n = ymd(addD(pd(hDay),+t.dataset.v)); if (n<=today()){ hDay = n; rHabits(); } },
 hab: t => { const h = S.habits[hDay] || (S.habits[hDay] = {}); h["h"+t.dataset.i] = !h["h"+t.dataset.i]; save(); rHabits(); },
 sl: t => { const h = S.habits[hDay] || (S.habits[hDay] = {}); h.sleep = num(h.sleep) ? Math.max(0,Math.min(14,num(h.sleep)+(+t.dataset.v))) : 7.5; save(); rHabits(); },
 en: t => { const h = S.habits[hDay] || (S.habits[hDay] = {}); h.energy = num(h.energy) ? Math.max(1,Math.min(10,num(h.energy)+(+t.dataset.v))) : 6; save(); rHabits(); },
 ch: t => { const d = t.dataset.d; if (S.challenge[d]) delete S.challenge[d]; else S.challenge[d] = true; save(); rHabits(); if (S.challenge[d]) toast("Journée validée"); },
 sq: t => { const r = S.reviews["w"+bW] || (S.reviews["w"+bW] = {}); r[t.dataset.k] = +t.dataset.v; save(); rBilan(); },
 dec: t => { const r = S.reviews["w"+bW] || (S.reviews["w"+bW] = {}); r.dec = r.dec===t.dataset.v ? "" : t.dataset.v; save(); rBilan(); },
 bsave: () => { const r = S.reviews["w"+bW] || (S.reviews["w"+bW] = {}); r.saved = Date.now(); save(); rBilan(); toast("Bilan enregistré"); },
 export: async () => { const blob = new Blob([JSON.stringify(S)],{type:"application/json"}), name = "vyra-sauvegarde-"+today()+".json";
  try { const f = new File([blob],name,{type:"application/json"}); if (navigator.canShare && navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:"Sauvegarde VYRA"}); return; } } catch(e){ if (e && e.name==="AbortError") return; }
  const u = URL.createObjectURL(blob), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); toast("Sauvegarde téléchargée"); },
 importf: () => $("impf").click(),
 importt: () => doImport($("impt").value)
};
document.addEventListener("click", e => { const t = e.target.closest("[data-a]"); if (!t || t.disabled) return; const f = A[t.dataset.a]; if (f){ e.stopPropagation(); f(t); } });
document.addEventListener("keydown", e => { if (e.key==="Enter" && e.target.matches("[role=button][data-a]")) A[e.target.dataset.a](e.target); });
document.addEventListener("change", e => { if (e.target.id==="impf" && e.target.files[0]){ const r = new FileReader(); r.onload = () => doImport(r.result); r.readAsText(e.target.files[0]); } });
document.addEventListener("input", e => {
 const x = e.target, D = x.dataset;
 if (D.k && D.d){ const l = ses(D.d).log; l[D.k] = x.value; save(); if ((D.k==="dist" || D.k==="dur") && $("jpace")) $("jpace").textContent = pace(num(l.dur),num(l.dist)); return; }
 if (D.b){ const r = S.reviews["w"+bW] || (S.reviews["w"+bW] = {}); r[D.b] = x.value; save(); }
});
$("restX").onclick = () => { clearInterval(restI); $("rest").classList.remove("on"); };

/* ================= DÉMARRAGE ================= */
render();
setTimeout(()=>$("splash").classList.add("off"), 900);
setTimeout(()=>$("splash").remove(), 1500);
let lastDay = today();
document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState==="visible" && today()!==lastDay){ lastDay = today(); planW = curWeek(); hDay = today(); bW = null; if (!stack.length) render(); } });
if ("serviceWorker" in navigator && location.protocol!=="file:") navigator.serviceWorker.register("./sw.js").catch(()=>{});
}
