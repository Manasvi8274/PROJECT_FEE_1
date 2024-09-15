
let board;
let boardwidth = 600;
let boardheight = 600;
let context;

//player
let playerwidth = 80;
let playerheight = 10;
let playervelocityX = 10;

let player = {
    x: boardwidth / 2 - playerwidth / 2,//to make center
    y: boardheight - playerheight - 5,//to make height of player (-5 to make sure not to stick to boundary )
    width: playerwidth,
    height: playerheight,
    velocityX: playervelocityX,
}

//ball


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
}

function update() {
    requestAnimationFrame(update);//call a function update 
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);
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