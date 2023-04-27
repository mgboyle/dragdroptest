const tasksData = [
    { id: 'task1', content: 'Creating presentations', app: 'app1' },
    { id: 'task2', content: 'Managing tasks', app: 'app2' },
    { id: 'task3', content: 'Editing photos', app: 'app3' },
  ];
  
  const appsData = [
    { id: 'app1', content: 'Microsoft PowerPoint' },
    { id: 'app2', content: 'Trello' },
    { id: 'app3', content: 'Adobe Photoshop' },
  ];
  
  const tasks = document.getElementById('tasks');
  const apps = document.getElementById('apps');
  const scoreElement = document.createElement('h3');
  scoreElement.textContent = 'Score: 0';
  document.body.appendChild(scoreElement);
  
  let score = 0;
  
  tasksData.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.id = task.id;
    taskElement.className = 'task';
    taskElement.textContent = task.content;
    taskElement.draggable = true;
    taskElement.addEventListener('dragstart', onDragStart);
    tasks.appendChild(taskElement);
  });
  
  appsData.forEach(app => {
    const appElement = document.createElement('div');
    appElement.id = app.id;
    appElement.className = 'app';
    appElement.textContent = app.content;
    appElement.addEventListener('dragover', onDragOver);
    appElement.addEventListener('drop', onDrop);
    apps.appendChild(appElement);
  });
  
  function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }
  
  function onDragOver(event) {
    event.preventDefault();
  }
  
  function onDrop(event) {
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    const targetAppElement = event.target;
  
    const task = tasksData.find(t => t.id === taskId);
    if (task.app === targetAppElement.id) {
      targetAppElement.classList.add('correct');
      taskElement.style.display = 'none';
      score++;
      updateScore();
      checkCompletion();
    } else {
      alert('Incorrect match. Please try again.');
    }
  
    event.dataTransfer.clearData();
  }
  
  function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
  }
  
  // Add a variable to track the start time
  let startTime;
  
  // Add an event listener for the player form
  const playerForm = document.getElementById('player-form');
  playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerName = document.getElementById('player-name').value;
    localStorage.setItem('playerName', playerName);
    playerForm.style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
  
    // Record the start time when the game starts
    startTime = performance.now();
  });
  
  function checkCompletion() {
    const remainingTasks = tasksData.filter(task => document.getElementById(task.id).style.display !== 'none');
    if (remainingTasks.length === 0) {
      // All tasks are completed
      const endTime = performance.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // Calculate time taken in seconds
  
      const playerName = localStorage.getItem('playerName');
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboard.push({ name: playerName, score: score, time: timeTaken });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  
      alert(`Congratulations ${playerName}! You matched all tasks correctly in ${timeTaken} seconds.`);
  
    // Redirect to the leaderboard page
    window.location.href = 'leaderboard.html';
  }
}

function populateLeaderboard() {
  const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

  leaderboardData.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    } else if (a.time && b.time) {
      return a.time - b.time;
    } else {
      return 0;
    }
  });

  const tableBody = document.querySelector('#leaderboard tbody');

  leaderboardData.forEach((entry, index) => {
    const row = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;
    row.appendChild(rankCell);

    const playerCell = document.createElement('td');
    playerCell.textContent = entry.name;
    row.appendChild(playerCell);

    const scoreCell = document.createElement('td');
    scoreCell.textContent = entry.score;
    row.appendChild(scoreCell);

    const timeCell = document.createElement('td');
    timeCell.textContent = entry.time ? `${entry.time} s` : 'N/A';
    row.appendChild(timeCell);

    tableBody.appendChild(row);
  });
}

// Call the populateLeaderboard function when the leaderboard page is loaded
if (document.querySelector('#leaderboard')) {
  populateLeaderboard();
}
  