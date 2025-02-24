
/*
// TODOs:
Add multicolor
better UI
Draggable brush
Save state button
fun presets
parallelize
*/

//VARS/CONSTANTS
const DIM = 150; const PIX = 4; const NBR_DIM = 5; const CANVAS = qs("canvas")
const CTX = CANVAS.getContext("2d");

let brushMode = 0;
let brushSize = 2;
let speed = 3;
let resolution = 3;
let canvas = 0;
let color = 0;

let boundless = true;
let resolutions = [[60, 10], [75, 8], [100, 6], [150, 4], [300, 2]] //600px
let speeds = [400, 225, 150, 75, 0]
let brushSizes = [0, 1, 3, 5, 10]
let canvases = ["RANDOM", "CHECKERS", "STRIPES", "CLEAR", "FILL", ]
let brushModes = ["FILL", "CLEAR", "INVERT", "RANDOM"]
let sizes = ["1", "2", "3", "4", "5"]
let colors = ["BLUE", "GREEN", "YELLOW", "ORANGE", "RED", "PURPLE"]

let grid = [];
let timer = null;
let delay = speeds[speed];


let stateColors = ["white", "blue", "purple"]

let neighbors = [[1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];

let rules = [[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

CANVAS.setAttribute("width", DIM * PIX + "px");
CANVAS.setAttribute("height", DIM * PIX + "px");

qs("#menu").style.width = DIM * PIX + "px"
qs("#menu").style.height = DIM * PIX + "px"

makeRuleButtons();
renderRuleButtons();
makeGrid();

//HELPER FUNCTIONS
function qs(q) { return document.querySelector(q) }

function makeGrid() {
    for (let y = 0; y < DIM; y++) {
        let row = [];
        for (let x = 0; x < DIM; x++) {
            let val = 0;
            switch(canvas) {
                case 0: val = Math.floor(Math.random() * 2); break //random
                case 1: ((x - y) % 2 === 0) ? val = 0 : val = 1; break // checkers
                case 2: (x % 2 === 0) ? val = 0 : val = 1; break
                case 3: val = 0; break
                case 4: val = 1; break
            }
            row[x] = [x, y, val]
        }
        grid[y] = row
    }
    render();
}

function getCell(x, y) {
    if (x >= 0 && x < DIM && y >= 0 && y < DIM) return (grid[y][x][2]);
    else if (boundless) return (grid[mod(y, DIM)][mod(x, DIM)][2]); 
    else return 0;
}

function setCell(x, y, state) { grid[y][x][2] = state; }

//draw the contents of the grid onto a canvas   
function render() { 
    qs("#cells").style.backgroundColor = "white";
    CTX.clearRect(0, 0, DIM * PIX, DIM * PIX); //this should clear the canvas ahead of each redraw
    for (var y = 0; y < DIM; y++) {
        for (var x = 0; x < DIM; x++) {
            let cellState = getCell(x, y)
            if (cellState == 0) continue
            CTX.fillStyle = stateColors[cellState]
            CTX.fillRect(x * PIX, y * PIX, PIX, PIX);
        }
    }
}

render();

function doRule(cell) {
    let state = cell[2];
    return (rules[state][getNeighbors(cell[0], cell[1])]);
}

function step() {
    grid = grid.map(row => row.map(cell =>
        [cell[0], cell[1], doRule(cell)]))
    render();
}

function getNeighbors(x, y) {
    let n = 0
    for (let i = 0; i < neighbors.length; i++) {
        if (getCell(x + neighbors[i][0], y + neighbors[i][1]) >= 1) n++;
    }
    return n;
}

function makeRuleButtons() {
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        for (let j = 0; j < rule.length; j++) {
            let button = document.createElement("button")
            button.classList.add("rulebutton");
            button.textContent = j;
            button.addEventListener("click", function () {
                rule[j]++
                if (rule[j] == 2) rule[j] = 0
                this.style.backgroundColor = stateColors[rule[j]];
            });
            button.id = ("ruleButton" + i + "-" + j);
            qs("#rule" + i).appendChild(button)
        }
    }
}

function renderRuleButtons() {
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        for (let j = 0; j < rule.length; j++) {
            let button = qs("#ruleButton" + i + "-" + j)
            if (j > neighbors.length) {
                button.disabled = true;
                button.style.display = "none";
            } else {
                button.disabled = false;
                button.style.display = "inline";
                button.style.backgroundColor = stateColors[rule[j]]    
            }
        }
    }
}

function renderRules() { for (let i = 0; i < rules.length; i++) renderRuleButtons(rule, ) }

function makeNeighborButtons() {
    for (let y = -NBR_DIM; y <= NBR_DIM; y++) {
        let row = document.createElement("div")
        row.classList.add("nbrRow")
        for (let x = -NBR_DIM; x <= NBR_DIM; x++) {
            let btn = document.createElement("button")
            btn.id = "nbrx" + x + "y" + y;
            btn.classList.add("nbrBtn");
            if (x !== 0 || y !== 0) {
                btn.addEventListener("click", function () {
                    let nbrIndex = -1
                    for (let i = 0; i < neighbors.length; i++) {
                        if (neighbors[i][0] === x && neighbors[i][1] === y) { nbrIndex = i; break; }
                    }
                    if (nbrIndex === -1) {
                        if (neighbors.length === 16) neighbors.splice(0, 1);
                        neighbors.push([x, y]);
                    } else {  neighbors.splice(nbrIndex, 1) }
                    renderNeighborButtons(); renderRules();
                })
            }
            row.appendChild(btn);
        }
        qs("#nbrBtns").appendChild(row)
    }
}

let q = [1, 2, 3, 4, 5, 6, 7]
function renderNeighborButtons() {
    let nbrBtns = document.getElementsByClassName("nbrBtn");
    for (let i = 0; i < nbrBtns.length; i++) nbrBtns[i].style.backgroundColor = "white";
    for (let i = 0; i < neighbors.length; i++) qs("#nbrx" + neighbors[i][0] + "y" + neighbors[i][1]).style.backgroundColor = "gray";
    qs("#nbrx0y0").style.backgroundColor = stateColors[1];
}

makeNeighborButtons();
renderNeighborButtons();
let nbrNext = 0;

// BRUSH
CANVAS.addEventListener("mousedown", function (e) {
    let x = Math.floor((e.pageX - CANVAS.offsetLeft) / PIX)
    let y = Math.floor((e.pageY - CANVAS.offsetTop) / PIX)
    console.log(x + " " + y)
    setCell(x, y, 1)
    for (let i = x - brushSizes[brushSize]; i <= x + brushSizes[brushSize]; i++) {
        for (let j = y - brushSizes[brushSize]; j <= y + brushSizes[brushSize]; j++) {
            if (brushMode === 0) setCell(i, j, 1) //fill
            else if (brushMode === 1) setCell(i, j, 0) //clear
            else if (brushMode === 2) setCell(i, j, (getCell(i, j) === 0) ? 1 : 0) //invert
            else setCell(i, j, Math.floor(2 * Math.random())) //random
        }
    }
    render();
})

//OTHER BUTTONS

qs("#setCanvas").addEventListener("change", function () {
	canvas = parseInt(qs("#setCanvas").value);
    makeGrid();
	qs("#setCanvas").value = -1;
	qs("#setCanvas").text = "Set Canvas...";
});

qs("#boundless").addEventListener("click", function () {
    boundless = !boundless
    this.innerHTML = "<strong>Boundless: </strong> " + ((boundless) ? "ON" : "OFF")
});

qs("#brushMode").addEventListener("click", () => {
    brushMode = mod(brushMode + 1, brushModes.length)
    this.innerHTML = "<strong>Brush Mode: </strong> " + brushModes[brushMode]
});

qs("#brushSize").addEventListener("click", () => {
    brushSize = mod(brushSize + 1, brushSizes.length)
    this.innerHTML = "<strong>Brush Size: </strong>" + sizes[brushSize]
});

qs("#color").addEventListener("click", () => {
    color = mod(color + 1, colors.length)
    //onColor = colors[color].toLowerCase()
    render();
    renderNeighborButtons();
    renderRules()
    this.innerHTML = "<strong>Color: </strong>" + colors[color]
});

qs("#resolution").addEventListener("click", () => {
    resolution = mod(resolution + 1, resolutions.length)
    DIM = resolutions[resolution][0]
    PIX = resolutions[resolution][1]
    makeGrid();
    this.innerHTML = "<strong>Resolution: </strong>" + sizes[resolution]
});

qs("#speed").addEventListener("click", () => {
    speed = mod(speed + 1, speeds.length);
    delay = speeds[speed];
    if (timer != null) { stop(); start(); }
    this.innerHTML = "<strong>Speed: </strong>" + sizes[speed]
});

qs("#step").addEventListener("click", () => {
    if (timer === null) step()
});

qs("#start").addEventListener("click", start);

function start() {
    if (timer === null) { timer = setInterval( () => { step() }, delay) }
}

qs("#stop").addEventListener("click", stop);
function stop() {
    clearInterval(timer);
    timer = null;
}

function mod(n, m) { return ((n % m) + m) % m }

//let offRule = [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]//boxy
//let onRule = [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
//let offRule = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//dotty
//let onRule = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
//let offRule = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//retro
//let onRule = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
//let offRule = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//woozily
//let onRule = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//let offRule = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//maze
//let onRule = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//let offRule = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//retro
//let onRule = [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//let offRule = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//cowy
//let onRule = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//let offRule = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//thick
//let onRule = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//let offRule = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//empty
//let onRule = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//classic
//let nbrs = [[1,1],[1,-1],[-1,-1],[-1,1]]; //diagonals only
//let nbrs = [[1,1],[1,-1],[-1,-1],[-1,1],[2,2],[2,-2],[-2,-2],[-2,2]]; //diagonal star
//let nbrs = [[0,1],[0,-1],[0,2],[0,-2],[0,3],[0,-3]]; //line out
//let nbrs = [[0,1],[0,-1],[-1,0],[1,0],[2,0],[0,2],[-2,0],[0,-2]];// straight star
//let nbrs = [[2,1],[2,0],[1,-3],[0,-1],[1,-1],[1,0],[4,4],[0,-2]]; //random
//let nbrs = [[1,1],[2,2],[-1,1],[-2,2],[0,1],[0,2],[0,1]]; //arrow
//let nbrs = [[1,1],[2,2],[-1,1],[-2,2],[0,1],[0,2],[0,2]]; //arrow 2
//let nbrs = [[1,1],[2,2],[-1,1],[-2,2],[0,1],[0,2],[0,3]]; //arrow 3
//let nbrs = [[1,1],[2,2],[-1,1],[-2,2],[0,10],[0,20],[0,40]]; //arrow 4

//combos- arrow + dotty, arrow+thick