//variables
let InputDir = { x: 0, y: 0 };
const food_sound = new Audio('/snake/js/food.mp3');
const gameover_sound = new Audio('/snake/js/gameover.mp3');
const move_sound = new Audio('/snake/js/move.mp3');
const music_sound = new Audio('/snake/js/music.mp3');
let speed = 5;

let lastPaintTime = 0;
let snakearr = [
    { x: 13, y: 15 },
];
food = { x: 6, y: 7 };
let score = 0;
let hiscore = 0;


//function

function reset_hiscore() {
    hiscore = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
}

function main(ctime) {
    window.requestAnimationFrame(main);//to make loop
    hiscoreBox.innerHTML = "High Score : " + hiscore;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    else {
        lastPaintTime = ctime
    }
    gameEngine();
}

function isCollide(snakearr) {
    //if snake eat itself
    for (let i = 1; i < snakearr.length; i++) {
        if (snakearr[i].x === snakearr[0].x && snakearr[i].y === snakearr[0].y) {
            return true;
        }
    }
    if (snakearr[0].x >= 18 || snakearr[0].x <= 0 || snakearr[0].y >= 18 || snakearr[0].y <= 0) {
        return true;
    }
    return false;
}


function gameEngine() {
    //p1 = upadet snake and food
    if (isCollide(snakearr)) {
        gameover_sound.play();
        music_sound.pause();
        InputDir = { x: 0, y: 0 };
        alert("GAME OVER");
        snakearr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score : " + score;
        gameover_sound.play();
    }
    music_sound.play();
    //if eat food then +snake and move food
    if (snakearr[0].y === food.y && snakearr[0].x === food.x) {
        food_sound.play();
        score += 1;
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscore));
            hiscoreBox.innerHTML = "High Score : " + hiscore;
        }
        scoreBox.innerHTML = "Score : " + score;
        snakearr.unshift({ x: snakearr[0].x + InputDir.x, y: snakearr[0].y + InputDir.y });
        // food = {x:Math.round(a+(b-a)* Math.random())}//formula to gen random number
        let a = 2, b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        // food_sound.pause();
    }
    //moving snake
    for (let i = snakearr.length - 2; i >= 0; i--) {
        const ele = snakearr[i];
        snakearr[i + 1] = { ...snakearr[i] }; // spread to put equal but if not then it only points to it
    }
    snakearr[0].x += InputDir.x;
    snakearr[0].y += InputDir.y;


    //p2 = display snake and food
    //display snake
    document.getElementById('board').innerHTML = "";
    snakearr.forEach((e, index) => {
        console.log(e);
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;//as e.y is row 
        snakeElement.style.gridColumnStart = e.x;//as e.x is col
        if (index == 0) {
            snakeElement.classList.add('head');//to add head
        }
        else {
            snakeElement.classList.add('snake');
        }
        document.getElementById('board').appendChild(snakeElement);

        // board.appendChild(snakeElement);
    })
    //display the food
    foodelement = document.createElement('div');
    foodelement.style.gridRowStart = food.y;
    foodelement.style.gridColumnStart = food.x;
    foodelement.classList.add('food');
    document.getElementById('board').appendChild(foodelement);
}







//main logic starts

hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscore = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
}
else {
    hiscore = JSON.parse(localStorage.getItem("hiscore"));
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
    // hiscoreBox.innerHTML = "HIGH SCORE : " + hiscore;
    // scoreBox.innerHTML = "Score = " + 1000;
}

window.requestAnimationFrame(main);//requestAnimationFrame is better than set intervel and good fps

window.addEventListener('keydown', e => {
    InputDir = { x: 0, y: 1 };
    move_sound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            InputDir.x = 0;
            InputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            InputDir.x = 0;
            InputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            InputDir.x = -1;
            InputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            InputDir.x = 1;
            InputDir.y = 0;
            break;
    }
});