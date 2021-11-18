import { randomNumberBetween } from './helpers.js';
import { getCarSpeed } from './road.js';

let trees = [];
let treeInterval, timeSinceLastTree;

export function setupTrees() {
    treeInterval = 1200;
    timeSinceLastTree = 0;
    trees.forEach(tree => {
        tree.remove();
    })
}

export function updateTrees(delta) {
    timeSinceLastTree += delta;
    if(timeSinceLastTree > treeInterval) {
        timeSinceLastTree -= treeInterval;
        createTree();
    }
    trees.forEach(tree => {
        if(tree.bottom + tree.size < 0) {
            return tree.remove();
        }
        tree.bottom -= delta * getCarSpeed();
    })
}

function createTree() {
    const treeElem = document.createElement('div');
    treeElem.classList.add('tree')
    treeElem.style.setProperty('--tree-size', randomNumberBetween(80, 120));
    treeElem.style.setProperty('--tree-left', randomNumberBetween(100, 300));
    const tree = {
        get bottom() {
            return parseFloat(getComputedStyle(treeElem).getPropertyValue('--tree-bottom'));
        },
        set bottom(value) {
            treeElem.style.setProperty('--tree-bottom', value);
        },
        get size() {
            return parseFloat(getComputedStyle(treeElem).getPropertyValue('--tree-size'))
        },
        remove() {
            trees = trees.filter(t => {
                return t !== tree;
            })

            treeElem.remove();
        }
    }

    tree.bottom = 1000;
    document.body.append(treeElem);
    trees.push(tree);
}



