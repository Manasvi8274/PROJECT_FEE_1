
let board;
let boardwidth = window.innerWidth / 2.7;
let boardheight = window.innerHeight / 1.2;
let context;

//player
let playerwidth = (boardwidth - 80) / 5;
let playerheight = (boardwidth - 80) / 50;
let playervelocityX = 20;

let player = {
    x: boardwidth / 2 - playerwidth / 2,//to make center
    y: boardheight - playerheight - 5,//to make height of player (-5 to make sure not to stick to boundary )
    width: playerwidth,
    height: playerheight,
    velocityX: playervelocityX,
}

//ball
let ballwidth = boardwidth / 50;
let ballheight = boardwidth / 50;
let ballvelocityx = 3;
let ballvelocityy = 2;
let ball = {
    x: boardwidth / 2,//inititl position
    y: boardheight / 2,
    width: ballwidth,
    height: ballheight,
    velocityx: ballvelocityx,
    velocityy: ballvelocityy,
}

//blocks
let blockarray = [];
let blockwidth = (boardwidth - 100) / 8;
let blockheight = (boardwidth - 80) / 50;
let blockcolumns = 8;
let blockrows = 3;//more as level goes up
let blockmaxrows = 10;
let blockcount = 0;

//starting block
let blockx = 15;
let blocky = 45;

//score
let score = 0;
let hiscore = JSON.parse(localStorage.getItem("hiscore"));
if (hiscore = null) {
    hiscore = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
}


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");
    //initial player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);//call a function update
    document.addEventListener("keydown", moveplayer);

    //create a block
    createblock();
}

function update() {
    requestAnimationFrame(update);//call a function update 
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "white";
    ball.x += ball.velocityx;
    ball.y += ball.velocityy;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //bounce ball off
    if (ball.y <= 0) {
        ball.velocityy *= -1;
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardwidth) {
        ball.velocityx *= -1;
    }
    else if (ball.y + ball.height >= boardheight) {
        // gameover
    }

    //bounce ball of player paddle
    if (topcollision(ball, player) || bottomcollsion(ball, player)) {
        ball.velocityy *= -1;
    }
    else if (leftcollision(ball, player) || rightcollision(ball, player)) {
        ball.velocityx *= -1;
    }

    //blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockarray.length; i++) {
        let block = blockarray[i];
        if (!block.break) {//only not broken block
            if (topcollision(ball, block) || bottomcollsion(ball, block)) {
                block.break = true;
                ball.velocityy *= -1;
                blockcount -= 1;
                score += 100;
                if (hiscore < score) {
                    hiscore = score;
                    localStorage.setItem("hiscore", JSON.stringify(hiscore));
                }
            }
            else if (leftcollision(ball, block) || rightcollision(ball, block)) {
                block.break = true;
                ball.velocityx *= -1;
                blockcount -= 1;
                score += 100;
                if (hiscore < score) {
                    hiscore = score;
                    localStorage.setItem("hiscore", JSON.stringify(hiscore));
                }
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //score
    context.font = "20px serif";
    context.fillText(score, 10, 25);//10 right and 25 down
    //hiscore
    context.font = "20px serif";
    context.fillText(hiscore, boardwidth - 40, 25);
}


function outbound(xpos) {
    return (xpos < 0 || xpos + playerwidth > boardwidth);
}
function moveplayer(e) {
    if (e.code == "ArrowLeft") {
        let nextplayerx = player.x - player.velocityX;
        if (!outbound(nextplayerx)) {
            player.x = nextplayerx;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerx = player.x + player.velocityX;
        if (!outbound(nextplayerx)) {
            player.x = nextplayerx;
        }
    }
}


function detectcollision(a, b) {
    return a.x < b.x + b.width &&//a top left doest not reach b top right
        a.x + a.width > b.x && //a top right not to b top left
        a.y < b.y + b.height && //a top left not b bottom left
        a.y + a.height > b.y;//a bottom left not b top left
}

//when ball collide block  from above
function topcollision(ball, block) {//ball is above block
    return detectcollision(ball, block) && (ball.y + ball.height) > block.y;
}

//when ball collide block from down
function bottomcollsion(ball, block) {//ball is below block
    return detectcollision(ball, block) && (block.y + block.height) > ball.y;
}

//when ball collide from left
function rightcollision(ball, block) {
    return detectcollision(ball, block) && (ball.x + ball.width) > block.x;
}

//when ball collide from right
function leftcollision(ball, block) {//ball is right fomr block
    return detectcollision(ball, block) && (block.x + block.width) > ball.x;
}

function createblock() {
    blockarray = [];//clean array
    for (let c = 0; c < blockcolumns; c++) {
        for (let r = 0; r < blockrows; r++) {
            let block = {
                x: blockx + c * blockwidth + c * 10,//to set 10 pixels apart
                y: blocky + r * blockheight + r * 10,//to set 10 space 
                height: blockheight,
                width: blockwidth,
                break: false,
            }
            blockarray.push(block);
        }
    }
    blockcount = blockarray.length;
}