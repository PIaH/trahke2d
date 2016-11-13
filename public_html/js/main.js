// ========================================================
// Definitions
// ========================================================
var mainCanvas, ctx, step, steps = 0, tick = 0, period = 2, snake1, snake2, snake3, numberOfSnakes;

// ========================================================
// Initialization
// ========================================================
function initCanvas(canvas) {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
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
    if(numberOfSnakes >= 1) {
        snake1.draw(ctx);
        snake1.executeGameStep(ctx);
    }
    if(numberOfSnakes >= 2) {
        snake2.draw(ctx);
        snake2.executeGameStep(ctx);
    }
    
    if(numberOfSnakes >= 3) {
        snake3.draw(ctx);
        snake3.executeGameStep(ctx);
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Play tron2d @ ittner.it", mainCanvas.width -250, mainCanvas.height - 40);
    
    if(numberOfSnakes >= 1) {
        ctx.fillStyle = snake1.color;
        ctx.fillText(snake1.name + " [" + snake1.keyConfiguration + "] Score: " + snake1.score, 10 , 25);
    }
    if(numberOfSnakes >= 2) {
        ctx.fillStyle = snake2.color;
        ctx.fillText(snake2.name + " [" + snake2.keyConfiguration + "] Score: " + snake2.score, 10 , 50);
    }
    if(numberOfSnakes >= 3) {
        ctx.fillStyle = snake3.color;
        ctx.fillText(snake3.name + " [" + snake3.keyConfiguration + "] Score: " + snake3.score, 10 , 75);
    }
    console.log("Calling drawMain");
}

function mainLoop(ctx) {
    tick++;
    drawMain(ctx);

    setTimeout('mainLoop(ctx)', period);
}

function handleKey(key) {
    if(numberOfSnakes >= 1) snake1.handleKeyInput(key);
    if(numberOfSnakes >= 2) snake2.handleKeyInput(key);
    if(numberOfSnakes >= 3) snake3.handleKeyInput(key);
}

// ========================================================
// Main
// ========================================================
function main(num) {
    
    new Audio("audio/start.wav").play();
    
    numberOfSnakes = num;
    
    if(numberOfSnakes >= 1) snake1 = createSnake("Oberon", "#cf722d");
    if(numberOfSnakes >= 2) snake2 = createSnake("Kermit", "#47b500");
    if(numberOfSnakes >= 3) snake3 = createSnake("Zandra", "#ff00ff");
    
    // Make all snakes known to each other so that the react on collisions
    if(numberOfSnakes >= 2) snake1.makeKnownTo(snake2);
    if(numberOfSnakes >= 3) snake1.makeKnownTo(snake3);
    if(numberOfSnakes >= 2) snake2.makeKnownTo(snake1);
    if(numberOfSnakes >= 3) snake2.makeKnownTo(snake3);
    if(numberOfSnakes >= 3) snake3.makeKnownTo(snake1);
    if(numberOfSnakes >= 3) snake3.makeKnownTo(snake2);
    
    // Configure the keys of all snakes
    if(numberOfSnakes >= 1) snake1.keyConfiguration = "arrow";
    if(numberOfSnakes >= 2) snake2.keyConfiguration ="wasd";
    if(numberOfSnakes >= 3) snake3.keyConfiguration ="ijkl";
    
    mainCanvas = document.getElementById("main");
    mainCanvas.style.display = 'block';
    mainCanvas.style.margin = '5px';
    //window.addEventListener('resize', resizeCanvas, false);
    document.addEventListener('keydown', function (event) {
        handleKey(event.code);
    });
    function resizeCanvas(canvas) {
        initCanvas(canvas);

        ctx = mainCanvas.getContext("2d");
        if(numberOfSnakes >= 1)  snake1.startGame();
        if(numberOfSnakes >= 2) snake2.startGame();
        if(numberOfSnakes >= 3) snake3.startGame();
        mainLoop(ctx);
    }
    resizeCanvas(mainCanvas);
}

bootbox.prompt({
    title: "<h1>Play a litte round of Thrake2d </h1>\n\
            <i>by ittner.it</i><br />\n\
            <img class=\"img img-responsive\" src=\"img/screen.png\"/> <br /><br />\n\
            <p>Select the number of players (1-3)</p>",
    inputType: 'select',
    inputOptions: [
        {
            text: '1 Player',
            value: '1',
        },
        {
            text: '2 Players',
            value: '2',
        },
        {
            text: '3 Players',
            value: '3',
        }
    ],
    callback: function (result) {
        if(result != 1 && result != 2 && result != 3) {
            main(1);
        } else {
            main(result);
        }
    }
});