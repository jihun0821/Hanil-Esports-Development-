setInterval(() => {
  // 예시: 점수를 랜덤으로 바꾸기 (실제론 API 연결 가능)
  document.getElementById('blue-score').textContent = Math.floor(Math.random() * 10);
  document.getElementById('red-score').textContent = Math.floor(Math.random() * 10);
}, 2000);
