class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const maxLengthSlider = document.getElementById('maxLengthSlider');
const recursionLevelSlider = document.getElementById('recursionLevelSlider');
const splitAngleSlider = document.getElementById('splitAngleSlider');
const growFactorSlider = document.getElementById('growFactorSlider');
const thiccSlider = document.getElementById('thiccSlider');
const sliders = Array.from(document.getElementsByClassName('slider'));
const growBtn = document.getElementById('growBtn');

const calcMinBranchLength = (maxLength, grow, level) => {
    return maxLength * Math.pow(grow, level);
}

const getConfiguration = () => {
    return {
        minBranchLength: calcMinBranchLength(parseInt(maxLengthSlider.value), parseInt(growFactorSlider.value) / 100, parseInt(recursionLevelSlider.value)),
        maxBranchLength: parseInt(maxLengthSlider.value),
        splitAngle: parseInt(splitAngleSlider.value),
        growFactor: parseInt(growFactorSlider.value) / 100,
        thiccFactor: parseInt(thiccSlider.value)
    }
}

let config;

function setup() {
    sliders.forEach(el => el.addEventListener('input', () => {
            config = getConfiguration();
            drawNewTree();
        }));
    growBtn.addEventListener('click', growTree);

    const width = window.innerWidth * 0.9;
    const height = window.innerHeight;
    createCanvas(width, height);
    
    config = getConfiguration();
    drawNewTree();
}

const drawNewTree = () => {
    clear();
    drawFractal(new Point(width/2, height), config.maxBranchLength, 90);
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const growTree = async () => {  
    sliders.forEach(slider => slider.disabled = true);
    growBtn.disabled = true;

    const targetMaxLength = config.maxBranchLength;
    const targetTHICCness = config.thiccFactor;
    const targetAngle = config.splitAngle - 5;
    const targetLevel = recursionLevelSlider.value;

    const growCycles = 100;
    let currentMaxLength = 0, currentTHICCness = 0, currentAngle = 0, currentLevel = 0;

    for(let i = 1; i <= growCycles; i++){
        await sleep(5000 / growCycles)
        currentMaxLength = i * targetMaxLength / growCycles;
        currentTHICCness = i * targetTHICCness / growCycles;
        currentAngle = i * targetAngle / growCycles + 5;
        currentLevel = i * targetLevel / growCycles;
        config.maxBranchLength = currentMaxLength;
        config.thiccFactor = currentTHICCness;
        config.splitAngle = currentAngle;
        config.minBranchLength = calcMinBranchLength(currentMaxLength, config.growFactor, currentLevel)
        drawNewTree();
    }

    sliders.forEach(slider => slider.disabled = false);
    growBtn.disabled = false;
}

const drawFractal = (start, length, angle) => {
    if (length > config.minBranchLength) {
        const nextPoint = calcNextPoint(start, length, angle)
        setDesign(length);
        line(start.x, start.y, nextPoint.x, nextPoint.y);
        drawFractal(nextPoint, length * config.growFactor, (angle + config.splitAngle) % 360);
        setDesign(length);
        drawFractal(nextPoint, length * config.growFactor, (angle - config.splitAngle) % 360);
    }
}

const setDesign = (length) => {
    const design = calcDesign(length);
    stroke(design.red, design.green, design.blue);
    strokeWeight(design.weight);
}

const calcNextPoint = (point, length, angle) => {
    angle = angle * (Math.PI / 180);
    return {x: point.x - Math.round(Math.cos(angle)*length),
            y: point.y - Math.round(Math.sin(angle)*length)};
}

const calcDesign = (length) => {
    const dynamicDiff = (length - config.minBranchLength) / (config.maxBranchLength - config.minBranchLength);
    const brown = {red: 165, green: 42, blue: 42};
    const leaf = {red: 10, green: 165, blue: 0};
    return {
        red: (brown.red -  leaf.red) * dynamicDiff + leaf.red,
        green: (brown.green -  leaf.green) * dynamicDiff + leaf.green,
        blue: (brown.blue -  leaf.blue) * dynamicDiff + leaf.blue,
        weight: config.thiccFactor * dynamicDiff
     };
}