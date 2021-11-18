import { setCarSpeed, getCarSpeed, getFuelStations } from "./road.js";

// Elments
const fuelElem = document.querySelector('[data-fuel]');
const upBtn = document.querySelector('.up');
const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const downBtn = document.querySelector('.down');

// Constants
const CAR_CHANGE_DIRECTION_SPEED = .5;
const TANK_FULL_SIZE = 100;
const FUEL_CONSUMING_START_RATE = .005;
const BREAK_ACCELERATOR = 0.0005; 
const ACCELERATOR = 0.01;
const MAX_SPEED = 0.5;
const START_SPEED = 0.03;


let carDirection, fuel, fuel_consuming_rate;

export const car = createCar();

// Add direction control to the car
function addDirectionControl() {
    document.addEventListener('keydown', handleDirectionControl);
    leftBtn.addEventListener('touchstart', handleDirectionControl)
    rightBtn.addEventListener('touchstart', handleDirectionControl)
    leftBtn.addEventListener('touchend', () => {
        carDirection = '';
    })
    rightBtn.addEventListener('mouseup', () => {
        carDirection = '';
    })
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
    if(e.code === "ArrowLeft" || e.target.classList.contains('left')) {
        carDirection = 'left';
    } 
    if(e.code === "ArrowRight" || e.target.classList.contains('right')) {
        carDirection = 'right';
    }
}

export function setupCar() {
    car.fuel = TANK_FULL_SIZE;
    fuel_consuming_rate = FUEL_CONSUMING_START_RATE;
    setCarSpeed(START_SPEED);
    addSpeedControl();
    addDirectionControl();
    fuelElem.innerText = car.fuel;
}



export function updateCar(delta) {

    updateCarDirection();

    // Stop car if fuel is 0
    if(car.fuel <= 0) {
        if(getCarSpeed() > 0) {
            // Decrease the car speed as a percentage of the current speed
            setCarSpeed(getCarSpeed() - delta * (BREAK_ACCELERATOR * getCarSpeed()));
            removeSpeedControl();
        }
        
        setTimeout(() => {
            if(car.fuel < 0) car.fuel = 0;
        }, 5000);
    } else {
        addSpeedControl();
    }

    // Update fuel
    updateFuel(delta);
}

function updateCarDirection() {
    if(carDirection === 'left') {
        car.changeDirection('left')
    } 
    if(carDirection === 'right') {
        car.changeDirection('right');
    }
}

function updateFuel(delta) {
    const rects = getFuelStations();    
    rects.forEach(station => {
        if(checkCollision(station.rect, car.getCarRect())) {
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
        fuelElem.innerText = `Fuel: ${Math.ceil(car.fuel)}`;
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

function createCar() {
    const carElem = document.createElement('div');
    carElem.classList.add('car');
    const car = {
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
                console.log('left');
                car.left -= CAR_CHANGE_DIRECTION_SPEED;
            } else if(direction === 'right') {
                console.log('right');
                car.left += CAR_CHANGE_DIRECTION_SPEED;
            }
        }, 
        refill(size) {
            car.fuel += parseFloat(size);
        }, 
        getCarRect() {
            return carElem.getBoundingClientRect();
        }
    }
    document.body.append(carElem);
    car.left = 50;
    return car;
}


