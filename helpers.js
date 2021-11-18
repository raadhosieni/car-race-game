// Generate random number between tow numbers
export function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}