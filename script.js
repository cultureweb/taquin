let size = 2;
let arrayForBoard = [];
let solution = [];  // Tableau de jeu GAGNANT
let counter = 0;
let stateChecked = {};

$(document).ready(() => {
    startNewGame();

    $('#start').click(() => {
        // alert('newGame')
        startNewGame();
        console.log(arrayForBoard)
    });
    $('#solve').click(() => {
        //alert('newGame')
        console.clear()
        stateChecked = {};
        solution = [];
        if (DFSFunction(arrayForBoard, 0, 20)) {
            // gagné
            playSolution()
        } else {
            console.log('Pas trouvé')
        }
    });
})

function playSolution() {
    //debugger
    console.log('ug', arrayForBoard)

    alert('temp')
    let intervalFunc = setInterval(() => {
        if (solution.length > 0) {
            swap(arrayForBoard, arrayForBoard.lastIndexOf(arrayForBoard.length - 1), solution.shift())
            drawBoard();
        } else {
            clearInterval(intervalFunc);
        }
    }, 1000);
    //console.log("trouvé solution", solution)
}

function DFSFunction(dfsList, deep, maxDepth) {
    counter++;
    if (counter % 100000 === 0) {
        console.log(counter)
    }

    //  si est_gagnant(e) alors
    if (isWin(dfsList)) {
        return true; //  renvoyer VRAI
    }

    //  si p > m alors // trop de coups
    if (deep > maxDepth) {
        return false
    }

    //  pour chaque x dans mouvements_possibles(e)
    let possibilities = canMove(dfsList);
    for (let i = 0; i < possibilities.length; i++) {
        let list = dfsList.concat();

        let emptyCaseIndex = list.indexOf(list.length - 1)

        //  nouv_e = x(e) // on applique le mouvement x sur e
        swap(list, possibilities[i], emptyCaseIndex)
        let hash = list.join();
        if (!stateChecked[hash]) {
            stateChecked[hash] = true;
            solution.push(possibilities[i]);
            //console.log("solution push ", solution)

            //  si DFS(nouv_e, p+1, m) alors // DFS renvoie VRAI ou FAUX
            if (DFSFunction(list, deep + 1, maxDepth)) {
                return true;//  renvoyer VRAI
            }
            solution.pop();
        }
        //console.log("solution pop", solution)
    }
    // aucun des mouvements possibles ne mène à une solution
    return false;//  renvoyer FAUX
}

function isWin(list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] !== i) {
            return false;
        }
    }
    return true;
}
function getSize() {
    return Number($('input[name=exampleRadios]:checked').val());
}
function startNewGame() {
    size = getSize();
    arrayForBoard = [];
    for (let i = 0; i < size * size; i++) {
        arrayForBoard.push(i);
    }
    // on mélange les 16 éléments
    shuffle(arrayForBoard);
    while (!isSolvable(arrayForBoard)) {
        //console.log('non resolvable')
        shuffle(arrayForBoard);
    }
    drawBoard();
    installClickHandlers(arrayForBoard);
}
function shuffle(list) {
    let i, j;
    for (i = 0; i < list.length; i++) {
        j = Math.floor(Math.random() * (list.length));
        swap(list, i, j);
    }
    return list;
}

function swap(list, pos1, pos2) {
    const temp = list[pos1];
    list[pos1] = list[pos2];
    list[pos2] = temp;
}

function countSwap(puzzle) {
    let counter = 0;
    let tempPuzzle = puzzle.concat();
    for (let indexMix = tempPuzzle.length - 1; indexMix > 0; indexMix--) {
        //console.log('test', tempPuzzle);
        let indexSort = 0;
        while (tempPuzzle[indexSort] !== indexMix) {
            indexSort++;
        }
        if (indexMix !== indexSort) {
            swap(tempPuzzle, indexMix, indexSort);
            counter++;
        }
    }
    console.log('counter', counter);
    return counter;
}

function countMove(puzzle) {
    //arrayTest = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 13, 14, 12];
    let index = 0;

    //console.log(arrayTest[i])
    while (puzzle[index] !== puzzle.length - 1) {
        index++
    }
    finalCol = 3;
    finalLine = 3;
    column = index % size
    line = Math.floor(index / size)
    let move = (finalCol - column) + (finalLine - line);
    return move;
}

function isEven(value) {
    return value % 2 === 0 ? true : false;
}

function isSolvable(puzzle) {
    return isEven(countMove(puzzle)) === isEven(countSwap(puzzle))
}

function installClickHandlers(puzzle) {

    const moves = canMove(puzzle);
    //console.log("can Move", moves)
    let index = puzzle.lastIndexOf(puzzle.length - 1)
    //console.log('index', index);

    moves.forEach((i) => {
        $(`#${puzzle[i]}`).click(function () {
            //console.log("puzzle mélangé avant ", puzzle)

            swap(puzzle, index, i)
            // console.log("mélangé avant", puzzle)
            if (isWin(puzzle)) {
                console.log("bravo");
            }
            drawBoard();
            installClickHandlers(puzzle);
        });


    })

}

function canMove(puzzle) {

    let possibilitiesArray = [];
    let emptyCase = puzzle.lastIndexOf(puzzle.length - 1)
    let lineIndex = Math.floor(emptyCase / size)
    let colIndex = emptyCase % size;
    //  console.log('type', typeof size)
    if (lineIndex !== 0) {
        //console.log('i can move up')
        possibilitiesArray.push(emptyCase - size)
    }
    if (lineIndex !== size - 1) {
        //console.log('i can move down')
        possibilitiesArray.push(emptyCase + size)
    }
    if (colIndex !== 0) {
        //console.log('i can move left')
        possibilitiesArray.push(emptyCase - 1)

    }
    if (colIndex !== size - 1) {
        //console.log('i can move right')
        possibilitiesArray.push(emptyCase + 1)

    }
    //console.log('possibilities', possibilitiesArray)
    return possibilitiesArray;
}

function drawBoard() {
    $("#wrapper").empty();
    let $square;

    for (let i = 0; i < size; i++) {
        let $row = $("<div />", {
            class: 'row d-flex justify-content-center'
        });
        for (let j = 0; j < size; j++) {
            let ids = i * size + j;

            $square = $(`<div class="square d-flex justify-content-center align-items-center" id="${arrayForBoard[ids]}">${arrayForBoard[ids]}</div>`);
            if (arrayForBoard[ids] === arrayForBoard.length - 1) {
                $square.addClass('empty');
            }
            else {
                $square.addClass('full');
            }
            $($row).append($square);

        }
        $("#wrapper").append($row);
    }

}

