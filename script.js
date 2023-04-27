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

// ... (rest of the script.js file)

// Add an event listener for the submit button
const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', handleSubmit);

function handleSubmit() {
    let correctMatches = 0;

    tasksData.forEach(task => {
        const taskElement = document.getElementById(task.id);
        const appElement = document.getElementById(task.app);

        if (taskElement.parentNode === appElement) {
            appElement.classList.add('correct');
            correctMatches++;
        } else {
            appElement.classList.remove('correct');
        }
    });

    setTimeout(() => {
        const playerName = localStorage.getItem('playerName');
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: playerName, score: correctMatches });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        alert(`Congratulations ${playerName}! You matched ${correctMatches} out of ${tasksData.length} tasks correctly.`);
    }, 500);
}

// ... (rest of the script.js file)

// Add an event listener for the player form
const playerForm = document.getElementById('player-form');
playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerName = document.getElementById('player-name').value;
    localStorage.setItem('playerName', playerName);
    playerForm.style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});
