const version = '14.14.1';
let allChampionElements = [];
let currentTurn = 0;
let pickedOrBanned = new Set();
let timerInterval = null;
let timeLeft = 30;

const sequence = [
  { type: 'ban', team: 'blue' },
  { type: 'ban', team: 'red' },
  { type: 'ban', team: 'blue' },
  { type: 'ban', team: 'red' },
  { type: 'ban', team: 'blue' },
  { type: 'ban', team: 'red' },
  { type: 'pick', team: 'blue' },
  { type: 'pick', team: 'red' },
  { type: 'pick', team: 'red' },
  { type: 'pick', team: 'blue' },
  { type: 'pick', team: 'blue' },
  { type: 'pick', team: 'red' },
  { type: 'ban', team: 'red' },
  { type: 'ban', team: 'blue' },
  { type: 'ban', team: 'blue' },
  { type: 'ban', team: 'red' },
  { type: 'pick', team: 'red' },
  { type: 'pick', team: 'blue' },
  { type: 'pick', team: 'blue' },
  { type: 'pick', team: 'red' }
];

// ✅ 챔피언 로딩
async function loadChampions() {
  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`);
  const json = await res.json();
  const champions = json.data;

  const pool = document.getElementById('championPool');
  for (let key in champions) {
    const champ = champions[key];
    const img = document.createElement('img');
    img.src = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`;
    img.alt = champ.name;
    img.title = champ.name;
    img.dataset.name = champ.name;
    img.dataset.id = champ.id;

    img.addEventListener('click', () => {
      handlePick(champ.id, img);
    });

    pool.appendChild(img);
    allChampionElements.push(img);
  }
}

// ✅ 픽 처리
function handlePick(champId, imgEl) {
  if (pickedOrBanned.has(champId) || currentTurn >= sequence.length) return;

  pickedOrBanned.add(champId);
  imgEl.classList.add('selected');
  nextTurn();
}

// ✅ 다음 턴으로 이동
function nextTurn() {
  clearInterval(timerInterval);

  currentTurn++;
  if (currentTurn >= sequence.length) {
    document.getElementById("turn-indicator").textContent = "밴픽 완료";
    document.getElementById("timer").textContent = "";
    return;
  }

  const { team, type } = sequence[currentTurn];
  const turnNum = Math.ceil((currentTurn + 1) / 2);
  document.getElementById("turn-indicator").textContent =
    `${team.toUpperCase()} TEAM ${type.toUpperCase()} ${turnNum}`;

  // ⏱ 타이머 시작
  timeLeft = 30;
  document.getElementById("timer").textContent = `:${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `:${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextTurn(); // 자동 스킵
    }
  }, 1000);
}

// ✅ 검색 기능
document.getElementById('searchInput').addEventListener('input', function () {
  const keyword = this.value.trim();
  allChampionElements.forEach(img => {
    const match = img.dataset.name.includes(keyword);
    img.style.display = match ? "inline-block" : "none";
  });
});

// ✅ 초기화
loadChampions().then(() => {
  nextTurn(); // 첫 턴 시작
});
