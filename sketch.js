class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const config = {
    minBranchLength: 40,
    maxBranchLength: 100,
    splitAngle: 36,
    shrinkFactor: 0.92
}

const width = window.innerWidth;
const height = window.innerHeight * 0.9;

function setup() {
    const radius = treeRadius() + 300;
    const center = new Point(width/2, height/2);
    createCanvas(width, height);
   /*  let startingPoints = [];
    for(let i = 0; i < 40; i++){
        startingPoints.push(new Point(center.x + (Math.random()* (radius + radius) - radius), center.y + (Math.random()* (radius + radius) - radius)));
    }
    startingPoints.sort((p1, p2) => p1.y - p2.y)
                  .forEach(point => drawFractal(point, parseInt(Math.random() * (config.maxBranchLength - config.minBranchLength) + config.minBranchLength), 90)); */
    drawFractal(new Point(width/2, height), config.maxBranchLength, 90);
}

function draw() {
}

function treeRadius() {
    let length = config.maxBranchLength;
    let radius = 0;
    while(length > config.minBranchLength) {
        radius += length;
        length *= config.shrinkFactor;
    }
    return radius;
}

function drawFractal(start, length, angle){
    if (length > config.minBranchLength) {
        const nextPoint = calcNextPoint(start, length, angle)
        setDesign(length);
        line(start.x, start.y, nextPoint.x, nextPoint.y);
        drawFractal(nextPoint, length * config.shrinkFactor, (angle +  Math.random() * config.splitAngle) % 360);
        setDesign(length);
        drawFractal(nextPoint, length * config.shrinkFactor, (angle - Math.random() * config.splitAngle) % 360);
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
};

const calcDesign = (length) => {
    const dynamicDiff = (length - config.minBranchLength) / (config.maxBranchLength - config.minBranchLength);
    const brown = {red: Math.random() * 20 + 155, green: Math.random() * 20 + 32, blue: Math.random() * 20 + 32};
    const leaf = {red: Math.random() * 20 + 0, green: Math.random() * 20 + 155, blue: 0};
    return {
        red: (brown.red -  leaf.red) * dynamicDiff + leaf.red,
        green: (brown.green -  leaf.green) * dynamicDiff + leaf.green,
        blue: (brown.blue -  leaf.blue) * dynamicDiff + leaf.blue,
        weight: 333 * dynamicDiff
     };
}