// ========================================================
// Definitions
// ========================================================
var mainCanvas, ctx, step, steps = 0, tick = 0, period = 2, snake, snake2;

// ========================================================
// Initialization
// ========================================================
function initCanvas(canvas) {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
//    canvas.width = 500 - 20;
//    canvas.height = 400 - 20;
}

function drawBackground(ctx) {
    var grd = ctx.createLinearGradient(0, 0, mainCanvas.width, mainCanvas.height);
    grd.addColorStop(0, "#8af8ff");
    grd.addColorStop(1, "#8aa8ff");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
}

// ========================================================
// Main Loop
// ========================================================



function drawMain(ctx) {

    drawBackground(ctx);

    
    snake.draw(ctx);
    snake.executeGameStep(ctx);
        
    snake2.draw(ctx);
    snake2.executeGameStep(ctx);
    
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Play tron2d @ ittner.it", mainCanvas.width -250, mainCanvas.height - 40);
    ctx.fillStyle = snake.color;
    ctx.fillText(snake.name + " [" + snake.keyConfiguration + "] Score: " + snake.score, 10 , 25);
    ctx.fillStyle = snake2.color;
    ctx.fillText(snake2.name + " [" + snake2.keyConfiguration + "] Score: " + snake2.score, 10 , 50);
    console.log("Calling drawMain");
}

function mainLoop(ctx) {
    tick++;
    drawMain(ctx);

    setTimeout('mainLoop(ctx)', period);
}

function handleKey(key) {
    snake.handleKeyInput(key);
    snake2.handleKeyInput(key);
}

// ========================================================
// Main
// ========================================================
function main() {
    snake =  createSnake("Detlev", "red");
    snake2 = createSnake("Dieter", "green");
    
    snake.makeKnownTo(snake2);
    snake2.makeKnownTo(snake);
    
    snake.keyConfiguration = "arrow";
    snake2.keyConfiguration ="wasd";
    
    mainCanvas = document.getElementById("main");

    //window.addEventListener('resize', resizeCanvas, false);
    document.addEventListener('keydown', function (event) {
        handleKey(event.code);

    });
    function resizeCanvas(canvas) {
        initCanvas(canvas);

        ctx = mainCanvas.getContext("2d");
        snake.startGame();
        snake2.startGame();
        mainLoop(ctx);
    }
    resizeCanvas(mainCanvas);
}

main();





// TODO:
//var start = null;
//var element = document.getElementById("main");
////element.style.position = 'absolute';
//
//function step(timestamp) {
//    if (!start)
//        start = timestamp;
//    var progress = timestamp - start;
//    element.style.left = Math.min(progress / 10, 200) + "px";
//    if (progress < 2000) {
//        window.requestAnimationFrame(step);
//    }
//}
//
//window.requestAnimationFrame(step);