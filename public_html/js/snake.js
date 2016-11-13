function createSnake(snakename, snakecolor) {
    var x =
            {
                "name": snakename,
                "color": snakecolor,
                "currentX": 0,
                "currentY": 0,
                "corners": [], // array of, x/y
                "speed": 1,
                "movementX": 1,
                "movementY": 0,
                "score": 0,
                "sound_hit": new Audio("audio/hit.wav"),
                "sound_collission": new Audio("audio/collission.wav"),
                "otherSnakes": [],
                "availableStrawberries": [],
                "makeKnownTo": function (otherSnake) {
                    this.otherSnakes.push(otherSnake);
                },
                "draw": function (ctx) {
                    // Draw a point a the peek of the snake
                    var r = 255;
                    var g = 0;
                    var b = 0;
                    var a = 255;
                    //ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
                    ctx.fillStyle = this.color;
                    ctx.strokeStyle = this.color;
                    ctx.fillRect(this.currentX - 1, this.currentY - 1, 3, 3);
                    // Draw Lines
                    for (i = 1; i < this.corners.length; i++) {
                        var pos0 = this.corners[i - 1];
                        var pos1 = this.corners[i];
                        ctx.beginPath();
                        ctx.moveTo(pos0.x, pos0.y);
                        ctx.lineTo(pos1.x, pos1.y);
                        ctx.stroke();
                    }
                    // Draw line last corner to current position
                    if (this.corners.length > 0) {
                        var lastPoint = this.corners[this.corners.length - 1];
                        ctx.beginPath();
                        ctx.moveTo(this.currentX, this.currentY);
                        ctx.lineTo(lastPoint.x, lastPoint.y);
                        ctx.stroke();
                    }
                    console.log("Len: " + this.availableStrawberries.length);
                    // Draw Strawberries
                    for(i=0; i<this.availableStrawberries.length;i++) {
                        console.log("Drawing Strawberry");
                        var strawberry = this.availableStrawberries[i]; 
                        ctx.fillStyle = "red";
                        ctx.strokeStyle = "red";
                        ctx.fillRect(strawberry.x - strawberry.radius, strawberry.y - strawberry.radius, strawberry.radius, strawberry.radius);
                    }
                },
                "moveStep": function () {
                    // Perform Movement
                    this.currentX += this.movementX;
                    this.currentY += this.movementY;
                    if (tick % 100 === 0) {
                    //    this.speed++;
                        this.score++;
                    }
                },
                "endGame": function (ctx) {
                    // Game Over
                    console.log("game over");
                    ctx.font = "40px Arial";
                    ctx.fillText("X", this.currentX - 10, this.currentY + 22);
                    if(this.speed !== 0) {
                        // Just play the sound the first time of the function call
                        this.sound_collission.play();
                    }
                    this.speed = 0;
                    
                },
                "startGame": function () {
                    this.score = 0;
                    var quaterWidth = Math.floor(mainCanvas.width / 4);
                    var quaterHeight = Math.floor(mainCanvas.height / 4);
                    this.currentX = Math.floor((Math.random() * (quaterWidth + quaterWidth)) + 1) - 1 + quaterWidth;
                    this.currentY = Math.floor((Math.random() * (quaterHeight + quaterHeight)) + 1) - 1 + quaterHeight;
                    
                    // Create some strawberries
                    this.AddNewStrawberry({
                        "score": 50,
                        "radius": 15,
                        "x":400,
                        "y":400
                    });
                    
                    this.handleDirection("down");
                    this.handleDirection("right");
                    this.handleDirection("down");
                },
                "keyConfiguration": "arrow",
                "handleKeyInput": function (key) {
                    if (this.keyConfiguration === "arrow") {
                        switch (key) {
                            case "ArrowLeft":
                                this.handleDirection("left");
                                break;
                            case "ArrowRight":
                                this.handleDirection("right");
                                break;
                            case "ArrowUp":
                                this.handleDirection("up");
                                break;
                            case "ArrowDown":
                                this.handleDirection("down");
                                break;
                        }
                    } else if (this.keyConfiguration === "wasd") {
                        switch (key) {
                            case "KeyA":
                                this.handleDirection("left");
                                break;
                            case "KeyD":
                                this.handleDirection("right");
                                break;
                            case "KeyW":
                                this.handleDirection("up");
                                break;
                            case "KeyS":
                                this.handleDirection("down");
                                break;
                        }
                    } else if (this.keyConfiguration === "ijkl") {
                        switch (key) {
                            case "KeyJ":
                                this.handleDirection("left");
                                break;
                            case "KeyL":
                                this.handleDirection("right");
                                break;
                            case "KeyI":
                                this.handleDirection("up");
                                break;
                            case "KeyK":
                                this.handleDirection("down");
                                break;
                        }
                    }
                },
                "handleDirection": function (direction) {
                    var storeCorner = false;
                    switch (direction) {
                        case "left":
                            if (this.movementY !== 0) { // don't allow movements in the opposite direction
                                this.movementX = -this.speed;
                                this.movementY = 0;
                                storeCorner = true;
                            }
                            break;
                        case "right":
                            if (this.movementY !== 0) { // don't allow movements in the opposite direction
                                this.movementX = this.speed;
                                this.movementY = 0;
                                storeCorner = true;
                            }
                            break;
                        case "up":
                            if (this.movementX !== 0) { // don't allow movements in the opposite direction
                                this.movementX = 0;
                                this.movementY = -this.speed;
                                storeCorner = true;
                            }
                            break;
                        case "down":
                            if (this.movementX !== 0) { // don't allow movements in the opposite direction
                                this.movementX = 0;
                                this.movementY = this.speed;
                                storeCorner = true;
                            }
                            break;
                    }
                    if (storeCorner) {
                        this.corners.push({"x": this.currentX, "y": this.currentY});
                    }
                },
                "checkStrawberryCollission": function(pos) {
                    var hitsStrawberry = false;
                    var strawberryRes = null;
                    for(i=0; i<this.availableStrawberries.length; i++) {
                        var strawberry = this.availableStrawberries[i];
                        if((strawberry.x - strawberry.radius) <= pos.x && (strawberry.x + strawberry.radius) >= pos.x &&
                           (strawberry.y - strawberry.radius) <= pos.y && (strawberry.y + strawberry.radius) >= pos.y) {
                            hitsStrawberry = true;
                            strawberryRes = strawberry;
                            break;
                        }
                    }
                    return {
                        "isHit":hitsStrawberry,
                        "strawberry":strawberryRes 
                    };
                },
                "RemoveAvailableStrawberry": function(strawberry) {
                    var index = this.availableStrawberries.indexOf(strawberry);
                    if (index > -1) {
                        this.availableStrawberries = this.availableStrawberries.splice(index, 1);
                    }
                    this.availableStrawberries.pop();
                },
                "AddNewStrawberry": function(strawberry) {
                    this.availableStrawberries.push(strawberry);
                },
                "executeGameStep": function (ctx) {
                    var myPossiblePosition = {"x": this.currentX + this.movementX, "y": this.currentY + this.movementY};
                    var isMovementPossible = this.isMovementPossible(myPossiblePosition);
                    if(isMovementPossible) { // if movement is not possible here, we don't have to check the other snakes...
                        for (index = 0; index < this.otherSnakes.length; index++) {
                            var enemy = this.otherSnakes[index];
                            if(enemy.isMovementPossible(myPossiblePosition) === false) {
                                isMovementPossible = false;
                                break;
                            }
                        }
                    }
                    if(isMovementPossible) {                        
                        // Check if we are on a strawberry...
                        var strawberryCheck = this.checkStrawberryCollission(myPossiblePosition);
                        if(strawberryCheck.isHit === true) {
                            this.sound_hit.play();
                            // prepare a new strawberry for myself and others
                            var quaterWidth = Math.floor(mainCanvas.width / 4);
                            var quaterHeight = Math.floor(mainCanvas.height / 4);

                            // Create a new strawberry
                            var newStrawberry = {
                                "score": 50,
                                "radius": 15,
                                "x":Math.floor((Math.random() * (quaterWidth + quaterWidth)) + 1) - 1 + quaterWidth,
                                "y":Math.floor((Math.random() * (quaterHeight + quaterHeight)) + 1) - 1 + quaterHeight
                            };
                            this.score += strawberryCheck.strawberry.score;
                            this.availableStrawberries.pop();
                            // Inform others of this new strawberry...
                            for(j=0; j<this.otherSnakes.length; j++) {
                                var other = this.otherSnakes[j];
                                other.RemoveAvailableStrawberry(strawberryCheck.strawberry);
                                other.AddNewStrawberry(newStrawberry);
                            }
                            this.AddNewStrawberry(newStrawberry);
                        }
                        this.moveStep();
                    } else {
                        this.endGame(ctx);
                    }
                },
                "isMovementPossible": function (point) {
                    inbetween1D = function (a, b, p) {
                        return (p >= a && p <= b);
                    };
                    inbetween2D = function (a, b, p) {
                        return inbetween1D(a.x, b.x, p.x) && inbetween1D(a.y, b.y, p.y);
                    };
                    // Check all corners
                    console.log("Checking corners: " + this.corners.length);
                    for (i = 1; i < this.corners.length; i++) {
                        var p0 = this.corners[i - 1];
                        var p1 = this.corners[i];
                        console.log("checking point: Corner1 (" + p0.x + "," + p0.y + ") Corner2 (" + p1.x + "," + p1.y + ") Target (" + point.x + "," + point.y + ")");
                        if (inbetween2D(p0, p1, point) || inbetween2D(p1, p0, point)) {
                            return false;
                        }
                    }
                    // Check from last point to current position (this is a must with 1+ players)
                    var lastCorner = this.corners[this.corners.length - 1];
                    var currentPos = {"x": this.currentX, "y": this.currentY};
                    if (inbetween2D(lastCorner, currentPos, point) || inbetween2D(currentPos, lastCorner, point)) {
                        return false;
                    }
                    // check if it is not outside the canvas
                    if(point.x < 0 || point.x > mainCanvas.width || point.y < 0 || point.y > mainCanvas.height) {
                        return false;
                    }
                    return true;
                }
            };
    return x;
}