let DIM = 150;
let PIX = 4;
let NBR_DIM = 5;
let CAN = qs("canvas")
let CTX = CAN.getContext("2d");

let brushMode = 0;
let brushSize = 2;
let speed = 3
let resolution = 3;
let canvas = 2;
let color = 0;

let offRule = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let onRule = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let nbrs = [[1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];

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
let onColor = "blue";
let offColor = "white"

CAN.setAttribute("width", DIM * PIX + "px");
CAN.setAttribute("height", DIM * PIX + "px");
CAN.addEventListener("mousedown", function (e) {
    let x = Math.floor((e.pageX - CAN.offsetLeft) / PIX)
    let y = Math.floor((e.pageY - CAN.offsetTop) / PIX)
    console.log(x + " " + y)
    setCell(x, y, 1)
    for (let i = x - brushSizes[brushSize]; i <= x + brushSizes[brushSize]; i++) {
        for (let j = y - brushSizes[brushSize]; j <= y + brushSizes[brushSize]; j++) {
            if (brushMode === 0) { //fill
                setCell(i, j, 1)
            } else if (brushMode === 1) { //clear
                setCell(i, j, 0)
            } else if (brushMode === 2) { //invert
                setCell(i, j, (getCell(i, j) === 0) ? 1 : 0)
            } else { //random
                setCell(i, j, Math.floor(2 * Math.random()))
            }
        }
    }
    render();
})
qs("#menu").style.width = DIM*PIX + "px"
qs("#menu").style.height = DIM*PIX + "px"

function qs(q) {
    return document.querySelector(q);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function makeGrid() {
    for (let y = 0; y < DIM; y++) {
        let row = [];
        for (let x = 0; x < DIM; x++) {
            let val = canvas;
            if (canvas === 0) {
                val = Math.floor(Math.random() * 2)
            } else if (canvas === 1) {
                ((x - y) % 2 === 0) ? val = 0 : val = 1
            } else if (canvas === 2) {
                (x % 2 === 0) ? val = 0 : val = 1
            } else if (canvas === 3) {
				val = 0;
			} else {
				val = 1;
			}
            row[x] = [x, y, val]
        };
        grid[y] = row
    }
    render();
}
makeGrid();


function getCell(x, y) {
    if (boundless) {
        return (grid[mod(y, DIM)][mod(x, DIM)][2]);
    } else if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
        return (grid[y][x][2]);
    } else {
        return 0;
    }
}

function setCell(x, y, state) {
    grid[y][x][2] = state;
}

function render() { //draw the contents of the grid onto a canvas   
    qs("#cells").style.backgroundColor = offColor;
    CTX.clearRect(0, 0, DIM * PIX, DIM * PIX); //this should clear the canvas ahead of each redraw
    for (var y = 0; y < DIM; y++) { //iterate through rows
        for (var x = 0; x < DIM; x++) { //iterate through columns
            if (getCell(x, y) >= 1) {
                CTX.fillStyle = onColor;
                CTX.fillRect(x * PIX, y * PIX, PIX, PIX);
            }
        }
    }
}

render();

function step() {
    grid = grid.map(row => row.map(cell =>
        [cell[0], cell[1], rule(cell)]))
    render();
}

function getNeighbors(x, y) {
    let n = 0
    for (let i = 0; i < nbrs.length; i++) {
        if (getCell(x + nbrs[i][0], y + nbrs[i][1]) >= 1) {
            n++;
        }
    }
    return n;
}

function rule(cell) {
    let state = cell[2];
    if (cell[2] === 1) {
        return (onRule[getNeighbors(cell[0], cell[1])]);
    } else {
        return (offRule[getNeighbors(cell[0], cell[1])]);
    }
}

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

function makeRuleBtns(ruleArr) {
    for (let i = 0; i < ruleArr.length; i++) {
        let btn = document.createElement("button")
        btn.classList.add("rulebutton");
        btn.textContent = i;
        btn.addEventListener("click", function () {
            let on = (ruleArr[i] === 1);
            let newRule = 0;
            if (on) {
                this.style.backgroundColor = offColor;
                ruleArr[i] = 0
            } else {
                this.style.backgroundColor = onColor;
                ruleArr[i] = 1
            }
        });
        if (ruleArr == onRule) {
            btn.id = ("onrb" + i);
            qs("#onrule").appendChild(btn)
        } else {
            btn.id = ("offrb" + i);
            qs("#offrule").appendChild(btn)
        }
    }
}

function renderRuleBtns(rule) {
    for (let i = 0; i < rule.length; i++) {
        let btn = qs("#offrb" + i)
        if (rule === onRule) {
            btn = qs("#onrb" + i)
        }
        if (i > nbrs.length) {
            btn.disabled = true;
            btn.style.display = "none";
        } else {
            btn.disabled = false;
            btn.style.display = "inline";
            if (rule[i] === 1) {
                btn.style.backgroundColor = onColor
            } else {
                btn.style.backgroundColor = offColor
            }
        }
    }
}

makeRuleBtns(onRule);
makeRuleBtns(offRule);
renderRuleBtns(onRule);
renderRuleBtns(offRule);

function makeNbrBtns() {
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
                    for (let i = 0; i < nbrs.length; i++) {
                        if (nbrs[i][0] === x && nbrs[i][1] === y) {
                            nbrIndex = i;
                            break;
                        }
                    }
                    if (nbrIndex === -1) {
                        if (nbrs.length === 16) {
                            nbrs.splice(0, 1);
                        }
                        nbrs.push([x, y]);
                    } else {
                        nbrs.splice(nbrIndex, 1);
                    }
                    renderNbrBtns();
                    renderRuleBtns(onRule);
                    renderRuleBtns(offRule);
                })
            }
            row.appendChild(btn);
        }
        qs("#nbrBtns").appendChild(row)
    }
}

makeNbrBtns();
let q = [1, 2, 3, 4, 5, 6, 7]
function renderNbrBtns() {
    let nbrBtns = document.getElementsByClassName("nbrBtn");
    for (let i = 0; i < nbrBtns.length; i++) {
        nbrBtns[i].style.backgroundColor = "white";
    }
    for (let i = 0; i < nbrs.length; i++) {
        qs("#nbrx" + nbrs[i][0] + "y" + nbrs[i][1]).style.backgroundColor = "black";
    }
    qs("#nbrx0y0").style.backgroundColor = onColor;
}

function removeNbrBtn(x, y) {
    let tmpNbrs = nbrs.slice();
}

renderNbrBtns();
let nbrNext = 0;



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

qs("#brushMode").addEventListener("click", function () {
    brushMode = mod(brushMode + 1, brushModes.length)
    this.innerHTML = "<strong>Brush Mode: </strong> " + brushModes[brushMode]
});

qs("#brushSize").addEventListener("click", function () {
    brushSize = mod(brushSize + 1, brushSizes.length)
    this.innerHTML = "<strong>Brush Size: </strong>" + sizes[brushSize]
});

qs("#color").addEventListener("click", function () {
    color = mod(color + 1, colors.length)
    onColor = colors[color].toLowerCase()
    render();
    renderNbrBtns();
    renderRuleBtns(onRule);
    renderRuleBtns(offRule);
    this.innerHTML = "<strong>Color: </strong>" + colors[color]
});

qs("#resolution").addEventListener("click", function () {
    resolution = mod(resolution + 1, resolutions.length)
    DIM = resolutions[resolution][0]
    PIX = resolutions[resolution][1]
    makeGrid();
    this.innerHTML = "<strong>Resolution: </strong>" + sizes[resolution]
});

qs("#speed").addEventListener("click", function () {
    speed = mod(speed + 1, speeds.length);
    delay = speeds[speed];
    if (timer != null) {
        stop();
        start();
    }
    this.innerHTML = "<strong>Speed: </strong>" + sizes[speed]
});

qs("#step").addEventListener("click", function () {
    if (timer === null) {
        step();
    }
});

qs("#start").addEventListener("click", start);
function start() {
    if (timer === null) {
        timer = setInterval(function () {
            step();
        }, delay)
    }
}

qs("#stop").addEventListener("click", stop);
function stop() {
    clearInterval(timer);
    timer = null;
}

// materialize CSS side nav
$('.button-collapse').sideNav({
    menuWidth: 300,
    edge: 'left',
    closeOnClick: true,
    draggable: true,
});