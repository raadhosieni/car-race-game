import { setupCar, updateCar, car } from './car.js';
import { createRoad, updateRoads, setupRoad } from './road.js';
import { updateTrees, setupTrees } from './landscape.js';

let timeSinceLastUpdate;
let stopGame = false;

// Events
document.addEventListener('keypress', handleStart, {once: true});
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
    window.requestAnimationFrame(updateLoop);
}