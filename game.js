const $=id=>document.getElementById(id);
const screens=["home","game","result","payment"];
let score=0,lives=3,timeLeft=30,coins=Number(localStorage.getItem("basitCoins")||0);
let high=Number(localStorage.getItem("basitHigh")||0);
let premium=localStorage.getItem("basitPremium")==="yes";
let timer=null,moveTimer=null,running=false;

function show(name){screens.forEach(s=>$(s).classList.toggle("active",s===name)); updateHome();}
function updateHome(){
  $("homeHigh").textContent=high;$("homeCoins").textContent=coins;$("homeMode").textContent=premium?"PREMIUM":"FREE";
}
function randomPos(el){
  const area=$("gameArea"), maxX=area.clientWidth-el.offsetWidth,maxY=area.clientHeight-el.offsetHeight;
  el.style.left=Math.max(4,Math.random()*maxX)+"px";el.style.top=Math.max(4,Math.random()*maxY)+"px";
}
function startGame(){
  score=0;lives=premium?5:3;timeLeft=premium?60:30;running=true;
  $("score").textContent=score;$("lives").textContent=lives;$("time").textContent=timeLeft;$("coins").textContent=coins;
  $("target").style.display="flex";$("bomb").style.display=premium?"flex":"none";$("message").textContent="";
  show("game");setTimeout(()=>{randomPos($("target"));randomPos($("bomb"));},50);
  clearInterval(timer);clearInterval(moveTimer);
  timer=setInterval(()=>{timeLeft--; $("time").textContent=timeLeft;if(timeLeft<=0)endGame()},1000);
  moveTimer=setInterval(()=>{if(running){randomPos($("target"));if(premium)randomPos($("bomb"))}},700);
}
function endGame(){
  if(!running)return;running=false;clearInterval(timer);clearInterval(moveTimer);
  $("target").style.display="none";$("bomb").style.display="none";
  $("finalScore").textContent=score;
  let record=false;if(score>high){high=score;localStorage.setItem("basitHigh",high);record=true}
  $("newRecord").textContent=record?"🔥 NEW HIGH SCORE!":"Keep hunting and beat your record.";
  show("result");
}
function hitTarget(){
  if(!running)return;
  const points=premium?2:1;score+=points;coins+=1;
  localStorage.setItem("basitCoins",coins);
  $("score").textContent=score;$("coins").textContent=coins;
  $("message").textContent="+"+points;
  setTimeout(()=>{$("message").textContent=""},180);
  randomPos($("target"));
}
function hitBomb(){
  if(!running)return;lives--; $("lives").textContent=lives;
  $("message").textContent="💥 -1 LIFE";setTimeout(()=>{$("message").textContent=""},300);
  if(lives<=0)endGame();
}
$("target").addEventListener("pointerdown",e=>{e.preventDefault();hitTarget()});
$("bomb").addEventListener("pointerdown",e=>{e.preventDefault();hitBomb()});
$("startBtn").onclick=startGame;$("againBtn").onclick=startGame;$("quitBtn").onclick=endGame;
$("premiumBtn").onclick=()=>show("payment");$("premiumTop").onclick=()=>show("payment");$("resultPremium").onclick=()=>show("payment");
$("backBtn").onclick=()=>show("home");

$("unlockBtn").onclick=()=>{
  const code=$("unlockCode").value.trim().toUpperCase();
  // Demo code for the first prototype. Replace this with server-side payment verification later.
  if(code==="BASIT5"){
    premium=true;localStorage.setItem("basitPremium","yes");
    alert("Premium unlocked! Welcome to BASIT HUNT Premium.");
    $("unlockCode").value="";show("home");
  }else{
    alert("Invalid unlock code. Complete the payment and request your unlock code from Mohammed Shaibu.");
  }
};
updateHome();
