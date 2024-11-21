const solveButton = document.getElementById("solve")
let solve = false;

const screenLength = 600;
const cellLength = screenLength / 9;
const textSizing = screenLength / 40;

let board = []
let initialBoard = [];

function setup(){
    createCanvas(screenLength, screenLength); // Create a 400x400px canvas
    background(0);
    colorMode(HSB, 255);

    textSize(textSizing); 
    textAlign(CENTER, CENTER);

    line(0, 0, screenLength, 0)

    for(let i = 0; i < 9; i++){
        board.push([])
        for(let j = 0; j < 9; j++){
            board[i].push(
                {
                    possiblities: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    value: -1,
                    isCollapsed: false
                }
            );
        }
    }

    initialBoard = JSON.parse(JSON.stringify(board));
}


let leastEntropyArr = [];
let leastEntropy = 0;
let leastEntropyCell = [];
let valueSolvedThisLoop = false;
function draw() {
    background(255)

    //draws the board and its cells based on the possiblilites listed in the cell
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            //update the boards information
            for(let x = 0; x < 9; x++){
                board[i][j].possiblities = board[i][j].possiblities.filter(a => a != board[i][x].value)
            }
            for(let y = 0; y < 9; y++){
                board[i][j].possiblities = board[i][j].possiblities.filter(a => a != board[y][j].value)
            }

            const boxRow = Math.floor(i / 3); // Which 3x3 box row the cell belongs to
            const boxCol = Math.floor(j / 3); // Which 3x3 box column the cell belongs to

            const valuesInBox = [];
            for(let x = 0; x < 3; x++){
                for(let y = 0; y < 3; y++){
                    if(board[x + boxRow * 3][y + boxCol * 3].value != -1){
                        valuesInBox.push(board[x + boxRow * 3][y + boxCol * 3].value);
                    }
                }
            }

            board[i][j].possiblities = board[i][j].possiblities.filter(a => !valuesInBox.includes(a))


            //check if this cell has the least amount of entropy
            if(board[i][j].isCollapsed == false){
                leastEntropyArr.push(board[i][j].possiblities.length)
            }

            //draw the board
            if(board[i][j].possiblities.length == leastEntropy){
                fill(100, 150, 255)
            }else{
                fill(255);
            }

            if(i == leastEntropyCell[0] && j == leastEntropyCell[1]){
                fill(255, 255, 255)
            }
            square(j * cellLength, i * cellLength, cellLength);

            let gridSize = 3;

            if(board[i][j].isCollapsed == false){
                for (let m = 0; m < board[i][j].possiblities.length; m++) {
                    let row = Math.floor(m / gridSize); // Row in the 3x3 grid
                    let col = m % gridSize; // Column in the 3x3 grid
    
                    let xOffset = j * cellLength + (col + 0.5) * (cellLength / gridSize);
                    let yOffset = i * cellLength + (row + 0.5) * (cellLength / gridSize);
    
                    if (
                        mouseX > xOffset - textSizing / 2 &&
                        mouseX < xOffset + textSizing / 2 &&
                        mouseY > yOffset - textSizing / 2 &&
                        mouseY < yOffset + textSizing / 2
                    ) {
                        fill(255, 0, 0); //text color red
                        textSize(textSizing + textSizing / 10)
                    } else {
                        fill(120); //text color black
                        textSize(textSizing)
                    }
    
                    text(`${board[i][j].possiblities[m]}`, xOffset, yOffset);
                }
            }else{
                const largeTextSize = textSizing * 4;
                textSize(largeTextSize); 
                fill(0)
                text(`${board[i][j].value}`, j * cellLength + cellLength / 2, i * cellLength + cellLength / 2);
            }

            if (solve) {
                if (!valueSolvedThisLoop) {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            if (i === leastEntropyCell[0] && j === leastEntropyCell[1]) {
                                const randomChoice = Math.floor(Math.random() * board[i][j].possiblities.length);
                                board[i][j].isCollapsed = true;
                                board[i][j].value = board[i][j].possiblities[randomChoice];
                                board[i][j].possiblities = [];
                                valueSolvedThisLoop = true; 
                                break; 
                            }
                        }
                        if (valueSolvedThisLoop) break; 
                    }
                }
            }
        }
    }
    valueSolvedThisLoop = false;
    leastEntropy = Math.min(...leastEntropyArr)

    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(board[i][j].possiblities.length == leastEntropy){
                leastEntropyCell = [i, j];
                return
            }
        }
    }
    leastEntropyArr = []
    console.log(leastEntropy)

    valueSolvedThisLoop = !valueSolvedThisLoop;
    console.log(valueSolvedThisLoop)
}

function mousePressed() {
    let gridSize = 3;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            for (let m = 0; m < board[i][j].possiblities.length; m++) {
                let row = Math.floor(m / gridSize);
                let col = m % gridSize;

                
                let xOffset = j * cellLength + (col + 0.5) * (cellLength / gridSize);
                let yOffset = i * cellLength + (row + 0.5) * (cellLength / gridSize);

                
                let textWidth = textSizing; 
                let textHeight = textSizing;

                if (
                    mouseX > xOffset - textWidth / 2 &&
                    mouseX < xOffset + textWidth / 2 &&
                    mouseY > yOffset - textHeight / 2 &&
                    mouseY < yOffset + textHeight / 2
                ) {
                    board[i][j].isCollapsed = true;
                    board[i][j].value = board[i][j].possiblities[m]
                    board[i][j].possiblities = [];
                    initialBoard = JSON.parse(JSON.stringify(board));
                    console.log(`Clicked on: ${board[i][j].possiblities[m]} at cell [${i}, ${j}]`);
                }
            }
        }
    }
    
}

solveButton.addEventListener("click", () => {
    solve = !solve;
    board = JSON.parse(JSON.stringify(initialBoard));
    leastEntropyArr = []
    console.log(solve)
})
