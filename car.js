
// Elments
const carElem = document.querySelector('[data-car]');
const diselElem = document.querySelector('[data-disel]');

// Constants
const CAR_CHANGE_DIRECTION_SPEED = 5;
import { setCarSpeed, getCarSpeed, getFuelStations } from "./road.js";

const TANK_FULL_SIZE = 100;
const FUEL_CONSUMING_START_RATE = .005;
const BREAK_ACCELERATOR = 0.0005; 
const ACCELERATOR = 0.1;
const MAX_SPEED = 1.5;
const START_SPEED = 0.4;


let carDirection, fuel, fuel_consuming_rate;

// Add direction control to the car
function addDirectionControl() {
    document.addEventListener('keydown', handleDirectionControl);
    document.addEventListener('keyup', (e) => {
        carDirection = '';
    })
}

// Add speed control events to the car
function addSpeedControl() {
    document.addEventListener('keydown', handleSpeedControl)
}

// Remove speed control events from the car
function removeSpeedControl() {
    document.removeEventListener('keydown', handleSpeedControl)
}

function handleSpeedControl(e) {
    if(e.code === "ArrowUp") {
        if(getCarSpeed() < MAX_SPEED) 
            setCarSpeed(getCarSpeed() + ACCELERATOR);
    }

    if(e.code === "ArrowDown") {
        if(getCarSpeed() > 0) 
            setCarSpeed(getCarSpeed() - ACCELERATOR);
    }
}

function handleDirectionControl(e) {
    if(e.code === "ArrowLeft") {
        carDirection = 'left';
    } 
    if(e.code === "ArrowRight") {
        carDirection = 'right';
    }
}

export function setupCar() {
    car.fuel = TANK_FULL_SIZE;
    fuel_consuming_rate = FUEL_CONSUMING_START_RATE;
    setCarSpeed(START_SPEED);
    addSpeedControl();
    addDirectionControl();
    diselElem.innerText = car.fuel;
}

function updateCarDirection() {
    if(carDirection === 'left') {
        car.changeDirection('left')
    } 
    if(carDirection === 'right') {
        car.changeDirection('right');
    }
}

export function updateCar(delta) {

    updateCarDirection();

    // Stop car if disel is 0
    if(car.fuel <= 0) {
        if(getCarSpeed() > 0) {
            // Decrease the car speed as a percentage of the current speed
            setCarSpeed(getCarSpeed() - delta * (BREAK_ACCELERATOR * getCarSpeed()));
            removeSpeedControl();
        }
        
        setTimeout(() => {
            if(car.fuel < 0) car.fuel = 0;
        }, 7000);
    } else {
        addSpeedControl();
    }

    // Update disel
    updateFuel(delta);
}



function updateFuel(delta) {
    const rects = getFuelStations();    
    rects.forEach(station => {
        if(checkCollision(station.rect, carElem.getBoundingClientRect())) {
            if(car.fuel  < TANK_FULL_SIZE) {
                car.refill(station.size);
                if(car.fuel > TANK_FULL_SIZE) {
                    car.fuel = TANK_FULL_SIZE;
                }
                if(station.size > 0) {
                    const alertElem = document.createElement('div');
                    alertElem.classList.add('alert', 'fuel');
                    alertElem.innerText = station.size;
                    document.body.append(alertElem);
                    setTimeout(() => {
                        alertElem.remove();
                    }, 1000)
                }
                station.size = 0;
            }
        }
    })

    if(car.fuel > 0) {
        car.fuel -= fuel_consuming_rate * delta;
        diselElem.innerText = `Disel: ${Math.ceil(car.fuel)}`;
    }
}

function checkCollision(rect1, rect2) {
    return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        )
}

export const car = {
    get fuel() {
        return fuel;
    },
    set fuel(value) {
        fuel = value;
    },
    get left() {
        return parseFloat(getComputedStyle(carElem).getPropertyValue('--car-left'));
    },
    set left(value) {
        carElem.style.setProperty('--car-left', value)
    }, 
    changeDirection(direction) {
        if(direction === 'left') {
            car.left -= CAR_CHANGE_DIRECTION_SPEED;
        } else if(direction === 'right') {
            car.left += CAR_CHANGE_DIRECTION_SPEED;
        }
    }, 
    refill(size) {
        car.fuel += parseFloat(size);
    }
}

