import { setupCar, updateCar, car } from './car.js';
import { createRoad, updateRoads, setupRoad } from './road.js';
import { updateTrees, setupTrees } from './landscape.js';

// Elments
const startBtn = document.querySelector('[data-start]');

let timeSinceLastUpdate;
let stopGame = false;

// Events
document.addEventListener('keypress', handleStart, {once: true});
startBtn.addEventListener('click', handleStart)
document.addEventListener('keypress', e => {
    if(e.code == "Space") {
        stopGame = !stopGame;
        console.log(stopGame);
    }
})




function updateLoop(time) {
    if (timeSinceLastUpdate == null) {
        timeSinceLastUpdate = time;
        requestAnimationFrame(updateLoop);
        return;
    }
    const delta = time - timeSinceLastUpdate;
    if(checkStopGame()) {
        return handleStop();
    }
    updateCar(delta);
    updateRoads(delta);
    updateTrees(delta);
    timeSinceLastUpdate = time;
    window.requestAnimationFrame(updateLoop);
}

function checkStopGame() {
    return stopGame || car.disel === 0;
}

function handleStop() {
    startBtn.classList.remove('hide');
    document.addEventListener('keypress', handleStart, {once: true});
}

function setupGame() {
    timeSinceLastUpdate = null;
    stopGame = false;
    createRoad();
    setupRoad();
    setupCar();
    setupTrees();
}

function handleStart() {
    setupGame();
    startBtn.classList.add('hide');
    window.requestAnimationFrame(updateLoop);
}