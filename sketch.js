class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const width = 3860;
const height = 2160;
const shrinkFactor = 0.9;
const maxLength = 180, minLength = 40;


function setup() {
    const radius = treeRadius() + 300;
    const center = new Point(width/2, height/2);
    createCanvas(width, height);
    let startingPoints = [];
    for(let i = 0; i < 70; i++){
        startingPoints.push(new Point(center.x + (Math.random()* (radius + radius) - radius), center.y + (Math.random()* (radius + radius) - radius)));
    }
    startingPoints.sort((p1, p2) => p1.y - p2.y)
                  .forEach(point => drawFractal(point, parseInt(Math.random() * (maxLength - minLength) + minLength), 90));
}

function draw() {
}

function treeRadius() {
    let length = maxLength;
    let radius = 0;
    while(length > 40 ) {
        radius += length;
        length *= shrinkFactor;
    }
    return radius;
}

function drawFractal(start, length, angle){
    if (length > minLength) {
        const nextPoint = calcNextPoint(start, length, angle)
        setDesign(length);
        line(start.x, start.y, nextPoint.x, nextPoint.y);
        drawFractal(nextPoint, length * shrinkFactor, (angle +  Math.random() * 36) % 360);
        setDesign(length);
        drawFractal(nextPoint, length * shrinkFactor, (angle - Math.random() * 36) % 360);
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
    const dynamicDiff = (length - minLength) / (maxLength - minLength);
    const brown = {red: Math.random() * 20 + 155, green: Math.random() * 20 + 32, blue: Math.random() * 20 + 32};
    const leaf = {red: Math.random() * 20 + 0, green: Math.random() * 20 + 155, blue: 0};
    return {
        red: (brown.red -  leaf.red) * dynamicDiff + leaf.red,
        green: (brown.green -  leaf.green) * dynamicDiff + leaf.green,
        blue: (brown.blue -  leaf.blue) * dynamicDiff + leaf.blue,
        weight: 333 * dynamicDiff
     };
}