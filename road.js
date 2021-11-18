import { randomNumberBetween } from './helpers.js';

let roads = [];
let timeSinceLastRoad;
let roadInterval;
let carSpeed;
const ROAD_HEIGHT = 30; // 10% of window height
const ROAD_WIDTH = ROAD_HEIGHT * 1.2; // two times of raod hight of window width


const FUEL_STATION_DISTANCE = 10; // 10 road segments

let distanceSinceLastStation;
const stationDirection = ['left', 'right', 'middle'];
const stationSizes = [5, 10, 15, 20];

export function setupRoad() {
    document.documentElement.style.setProperty('--road-height', ROAD_HEIGHT);
    document.documentElement.style.setProperty('--road-width', ROAD_WIDTH);
    distanceSinceLastStation = 0;
    timeSinceLastRoad = 0;
    roads.forEach(road => {
        road.remove();
    })
}


export function setCarSpeed(value) {
    carSpeed = value;
    roadInterval = (ROAD_HEIGHT * 0.90) / carSpeed;
}

export function getCarSpeed() {
    return carSpeed;
}

// Get the array of all stations rect position (top left right bottom);
export function getFuelStations() {
    const stationNodelist = document.querySelectorAll('[data-fuel-station]');
    return [...stationNodelist].map(stationElem => 
        ({
            id: Math.random() * 100000000,
            rect: stationElem.getBoundingClientRect(), 
            get size() {return stationElem.dataset.fuelSize},
            set size(value) { stationElem.dataset.fuelSize = value; stationElem.innerText = value}
        }));
}

// Generate road segments
export function updateRoads(delta) {
    
    timeSinceLastRoad += delta;
    
    if(timeSinceLastRoad > roadInterval) {
        timeSinceLastRoad -= roadInterval;
        createRoad(distanceSinceLastStation);
        distanceSinceLastStation++;
        if(distanceSinceLastStation > FUEL_STATION_DISTANCE) {
            distanceSinceLastStation = 0;
        }
    }

    roads.forEach(road => {
        if(road.bottom + ROAD_HEIGHT < 0) {
            road.remove();
            return;
        }
        road.bottom -= delta * carSpeed;
    });

}

// Create road segment
export function createRoad() {
    const roadElem = document.createElement('div');
    roadElem.classList.add('road');
    roadElem.style.setProperty('--road-left', 50)
    
    // Create mark element
    const roadMark = document.createElement('div');
    roadMark.classList.add('mark');
    roadElem.append(roadMark);

    // Create fuel station element
    if(distanceSinceLastStation === 0) {
        const fuelStation = document.createElement('div');
        fuelStation.classList.add('fuel-station', stationDirection[randomNumberBetween(0, 3)]);
        fuelStation.dataset.fuelStation = true;
        const size = stationSizes[randomNumberBetween(0, 4)];
        fuelStation.dataset.fuelSize = size;
        fuelStation.innerText = size;
        roadElem.append(fuelStation);
    }
    
    const road = {
        get bottom() {
            return parseFloat(getComputedStyle(roadElem).getPropertyValue('--road-bottom'));
        }, 
        set bottom(value) {
            roadElem.style.setProperty('--road-bottom', value);
        }, 
        remove() {
            roads = roads.filter(r => r !== road);
            roadElem.remove();
        }
    }

    document.body.append(roadElem);
    road.bottom = 100;
    roads.push(road);
}

