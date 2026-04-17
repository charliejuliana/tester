let players = JSON.parse(localStorage.getItem('mg_players')) || [
{name:"Charlie Juliana", points:0, img:"charlieminigolf.png"},
{name:"Caleb Willner", points:0, img:"CalebRabbi.png"},
{name:"Devin Skinner", points:0, img:"SkinnerProfile.png"},
{name:"Isaac Baranski", points:0, img:"tuffAhhIsaac.png"},
{name:"Peter Merk", points:0, img:"PeterProfile.png"},
{name:"Avery Radom", points:0, img:"averyiszesty-1.png"}
];

let tournaments = JSON.parse(localStorage.getItem('mg_tournaments')) || [];

function saveData(){
  localStorage.setItem('mg_players', JSON.stringify(players));
  localStorage.setItem('mg_tournaments', JSON.stringify(tournaments));
}

/* ---------------- LEADERBOARD ---------------- */
function renderLeaderboard(){
  const div = document.getElementById("leaderboardList");
  if(!div) return;

  const sorted = [...players].sort((a,b)=>b.points-a.points);

  div.innerHTML = "";

  sorted.forEach((p,i)=>{
    div.innerHTML += `
      <div class="card player">
        <img src="${p.img}">
        <div style="flex:1">
          <strong>#${i+1} ${p.name}</strong>
        </div>
        <span class="badge">${p.points} pts</span>
      </div>
    `;
  });
}

/* ---------------- PLAYERS ---------------- */
function renderPlayers(){
  const div = document.getElementById("playersList");
  if(!div) return;

  div.innerHTML = "";
  players.forEach(p=>{
    div.innerHTML += `
      <div class="card player">
        <img src="${p.img}">
        <span>${p.name}</span>
      </div>
    `;
  });
}

/* ---------------- TOURNAMENTS ---------------- */
function renderTournaments(){
  const div = document.getElementById("tournamentList");
  if(!div) return;

  div.innerHTML = "";
  tournaments.forEach((t,i)=>{
    div.innerHTML += `
      <div class="card">
        <h3>${t.name}</h3>
        <p>${t.date} | ${t.location}</p>
        <a href="tournament.html?id=${i}">
          <button>View Leaderboard</button>
        </a>
      </div>
    `;
  });
}

/* ---------------- TOURNAMENT PAGE ---------------- */
function loadTournamentPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if(id === null) return;

  const t = tournaments[id];

  document.getElementById("detailTitle").innerText = t.name;
  document.getElementById("detailInfo").innerText =
    `${t.date} | ${t.location} | ${t.holes} holes`;

  const table = document.getElementById("detailTable");
  table.innerHTML = "";

  t.results.forEach(r=>{
    table.innerHTML += `
      <tr>
        <td>${r.place}</td>
        <td>${r.name}</td>
        <td>${r.score}</td>
      </tr>
    `;
  });
}

/* ---------------- ADMIN ---------------- */
function unlock(){
  if(document.getElementById("password").value === "TheTour2026"){
    document.getElementById("adminPanel").style.display = "block";
    initScores();
  }
}

function initScores(){
  const div = document.getElementById("scores");
  div.innerHTML = "";
  players.forEach(p=>{
    div.innerHTML += `
      ${p.name}: <input type="number" id="score-${p.name}">
      <br>
    `;
  });
}

/* ---------------- ADD TOURNAMENT ---------------- */
function addTournament(){
  let results = [];

  players.forEach(p=>{
    let val = document.getElementById(`score-${p.name}`).value;
    if(val !== "") results.push({name:p.name, score:parseInt(val)});
  });

  results.sort((a,b)=>a.score-b.score);

  let places = [];
  let place = 1;

  for(let i=0;i<results.length;i++){
    if(i>0 && results[i].score === results[i-1].score){
      places[i] = places[i-1];
    } else {
      places[i] = place;
    }
    place++;
  }

  function getPoints(p){
    if(p===1) return 4;
    if(p===2) return 3;
    if(p===3) return 2;
    if(p===4) return 1;
    return 0;
  }

  results.forEach((r,i)=>{
    let player = players.find(x=>x.name===r.name);
    player.points += getPoints(places[i]);
  });

  tournaments.push({
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    location: document.getElementById("location").value,
    holes: document.getElementById("holes").value,
    results: results.map((r,i)=>({...r, place: places[i]}))
  });

  saveData();
  alert("Tournament Added");
}
