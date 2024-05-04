var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerOneX = 0;
var playerOneY = canvas.height / 2;
var playerTwoX = canvas.width;
var playerTwoY = canvas.height / 2;

var playerOneRadius = 100;
var playerTwoRadius = 100;

var playerOneCounter = 0;
var playerTwoCounter = 0;

var playerOneAngle = 0;
var playerOneAngularVelocity = 0.02;
var playerTwoAngle = 0;
var playerTwoAngularVelocity = 0.02;

var playerOneClockwise = true;
var playerTwoClockwise = true;

var playerOneShooting = false;
var playerTwoShooting = false;

var showPlayerOneFog = false;
var showPlayerTwoFog = false;

var playerOnePowerupUsed = false;
var playerTwoPowerupUsed = false;

var shootVelocity = 8;
var randomDots = [];

function generateRandomDots() {
    var minDistance = 70;
    for (var i = 0; i < 14; i++) {
        var dotX, dotY;
        var validPosition = false;
        while (!validPosition) {
            dotX = Math.random() * (canvas.width - 300) + 150;
            dotY = Math.random() * (canvas.height - 100) + 50;
            validPosition = true;

            if (dotX >= canvas.width / 2 - 50 && dotX <= canvas.width / 2 + 50) {
                validPosition = false;
            }

            for (var j = 0; j < randomDots.length; j++) {
                var dx = dotX - randomDots[j].x;
                var dy = dotY - randomDots[j].y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
        }

        let score = Math.floor(Math.random() * 5) + 1;
        let radius = 0;
        switch (score) {
            case 1:
                radius = 30;
                break;
            case 2:
                radius = 25;
                break;
            case 3:
                radius = 20;
                break;
            case 4:
                radius = 15;
                break;
            case 5:
                radius = 10;
                break;
        }
        randomDots.push({ x: dotX, y: dotY, score: score * 10, radius: radius });
    }
}

function drawRandomDots() {
    randomDots.forEach(function (dot) {
        switch (dot.score) {
            case 10:
                drawDot(dot.x, dot.y, dot.radius, "#c183de");
                break;
            case 20:
                drawDot(dot.x, dot.y, dot.radius, "#af9ad6");
                break;
            case 30:
                drawDot(dot.x, dot.y, dot.radius, "#609ee2");
                break;
            case 40:
                drawDot(dot.x, dot.y, dot.radius, "#d2c8e5");
                break;
            case 50:
                drawDot(dot.x, dot.y, dot.radius, "#61b3a5");
                break;
        }
    });
}

function drawDot(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = "#392b46";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

generateRandomDots();

function checkCollision(ballX, ballY) {
    for (var i = 0; i < randomDots.length; i++) {
        var dot = randomDots[i];
        var dx = ballX - dot.x;
        var dy = ballY - dot.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < dot.radius + 20) {
            return i;
        }
    }
    return -1;
}

var lineY = canvas.height / 2;
var lineDirection = 1;
var lineHeight = 200;

function drawMovingLine() {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, lineY - lineHeight / 2 - 1);
    ctx.lineTo(canvas.width / 2, lineY + lineHeight / 2 + 1);
    ctx.strokeStyle = "#392b46";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, lineY - lineHeight / 2);
    ctx.lineTo(canvas.width / 2, lineY + lineHeight / 2);
    ctx.strokeStyle = "#9257b2";
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.closePath();
}


function updateMovingLine() {
    lineY += lineDirection;

    if (lineY - lineHeight / 2 <= 0) {
        lineDirection = 1;
    } else if (lineY + lineHeight / 2 >= canvas.height) {
        lineDirection = -1;
    }
}

function drawRestartButton() {
    ctx.fillStyle = "#302c2c";
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
    ctx.fillStyle = "#FFF";
    ctx.font = "30px Arial";
    ctx.fillText("Restart", canvas.width / 2 - 48, canvas.height / 2 + 85);
}

function drawScore() {
    ctx.strokeStyle = "#363c54"; 
    ctx.font = "bold 50px Arial";
    ctx.lineWidth = 2.5;

    ctx.strokeText(playerOneCounter, 30, 60);
    ctx.fillStyle = "#0095DD";
    ctx.fillText(playerOneCounter, 30, 60);

    ctx.strokeStyle = "#453654"; 
    ctx.lineWidth = 2.5;

    if (playerTwoCounter <= 9) {
        ctx.strokeText(playerTwoCounter, canvas.width - 60, 60);
        ctx.fillStyle = "#f29bd2";
        ctx.fillText(playerTwoCounter, canvas.width - 60, 60);
    } else if (playerTwoCounter <= 99) {
        ctx.strokeText(playerTwoCounter, canvas.width - 80, 60);
        ctx.fillStyle = "#f29bd2";
        ctx.fillText(playerTwoCounter, canvas.width - 80, 60);
    } else {
        ctx.strokeText(playerTwoCounter, canvas.width - 110, 60);
        ctx.fillStyle = "#f29bd2";
        ctx.fillText(playerTwoCounter, canvas.width - 110, 60);
    }
}

function checkWin() {
    if (playerOneCounter >= 600 || playerTwoCounter >= 600) {
        var winner;
        var textColor;
        if (playerOneCounter >= 600) {
            winner = "Player One";
            textColor = "#0095DD";
            ctx.strokeStyle = "#444b6a";
        } else {
            winner = "Player Two";
            textColor = "#f29bd2";
            ctx.strokeStyle = "#59456e";
        }

        ctx.lineWidth = 2.7;
        ctx.strokeText(winner + " wins!", canvas.width / 2 - 200, canvas.height / 2);
        ctx.fillStyle = textColor; 
        ctx.fillText(winner + " wins!", canvas.width / 2 - 200, canvas.height / 2);

        drawRestartButton();
        cancelAnimationFrame(animationFrame);
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    checkWin();

    if (randomDots.length === 0) {
        generateRandomDots();
    }

    var playerOneBallX = playerOneX + playerOneRadius * Math.cos(playerOneAngle);
    var playerOneBallY = playerOneY + playerOneRadius * Math.sin(playerOneAngle);

    if (!showPlayerOneFog) {
        ctx.beginPath();
        ctx.moveTo(playerOneX - 10, playerOneY);
        ctx.lineTo(playerOneBallX, playerOneBallY + 5);
        ctx.strokeStyle = "#0095DD";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(playerOneX - 10, playerOneY);
        ctx.lineTo(playerOneBallX, playerOneBallY - 5);
        ctx.strokeStyle = "#0095DD";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(playerOneBallX, playerOneBallY, 20, 0, Math.PI * 2);
        ctx.strokeStyle = "#392b46";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(playerOneBallX, playerOneBallY, 10, 0, Math.PI * 2);
        ctx.strokeStyle = "#392b46";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#95cef9";
        ctx.fill();
        ctx.closePath();
    }

    if (playerOneBallX <= 25) {
        playerOneClockwise = !playerOneClockwise;
    }

    if (playerOneShooting) {
        var dx = playerOneX - playerOneBallX;
        var dy = playerOneY - playerOneBallY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var playerOneShootDirectionX = dx / distance;
        var playerOneShootDirectionY = dy / distance;

        playerOneBallX -= playerOneShootDirectionX * shootVelocity;
        playerOneBallY -= playerOneShootDirectionY * shootVelocity;
        playerOneRadius += shootVelocity;

        var collidedIndex = checkCollision(playerOneBallX, playerOneBallY);
        if (playerOneBallX < 0
            || playerOneBallX > canvas.width
            || playerOneBallY < 0
            || playerOneBallY > canvas.height
            || collidedIndex >= 0
            || playerOneBallX >= canvas.width / 2 - 20 && playerOneBallX <= canvas.width / 2 + 20
            && playerOneBallY >= lineY - lineHeight / 2 - 20 && playerOneBallY <= lineY + lineHeight / 2 + 20) {
            playerOneShooting = false;
            if (collidedIndex >= 0) {
                randomDots[collidedIndex].x = playerOneBallX;
                randomDots[collidedIndex].y = playerOneBallY;
            }
        }
    } else if (playerOneRadius > 100) {
        var dx = playerOneX - playerOneBallX;
        var dy = playerOneY - playerOneBallY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var playerOneShootDirectionX = dx / distance;
        var playerOneShootDirectionY = dy / distance;

        playerOneBallX -= playerOneShootDirectionX * shootVelocity;
        playerOneBallY -= playerOneShootDirectionY * shootVelocity;
        playerOneRadius -= shootVelocity;

        var collidedIndex = checkCollision(playerOneBallX, playerOneBallY);
        if (playerOneBallX < 0
            || playerOneBallX > canvas.width
            || playerOneBallY < 0
            || playerOneBallY > canvas.height
            || collidedIndex >= 0) {
            if (collidedIndex >= 0) {
                randomDots[collidedIndex].x = playerOneBallX;
                randomDots[collidedIndex].y = playerOneBallY;

                if (randomDots[collidedIndex].x <= 120) {
                    playerOneCounter += randomDots[collidedIndex].score;
                    randomDots.splice(collidedIndex, 1);
                }
            }
        }
    } else {
        playerOneRadius = 100;
        if (playerOneClockwise) {
            playerOneAngle += playerOneAngularVelocity;
        } else {
            playerOneAngle -= playerOneAngularVelocity;
        }
    }

    var playerTwoBallX = playerTwoX - playerTwoRadius * Math.cos(playerTwoAngle);
    var playerTwoBallY = playerTwoY - playerTwoRadius * Math.sin(playerTwoAngle);

    if (!showPlayerTwoFog) {
        ctx.beginPath();
        ctx.moveTo(playerTwoX + 10, playerTwoY);
        ctx.lineTo(playerTwoBallX, playerTwoBallY - 5);
        ctx.strokeStyle = "#f29bd2";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(playerTwoX + 10, playerTwoY);
        ctx.lineTo(playerTwoBallX, playerTwoBallY + 5);
        ctx.strokeStyle = "#f29bd2";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(playerTwoBallX, playerTwoBallY, 20, 0, Math.PI * 2);
        ctx.strokeStyle = "#392b46";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#f29bd2";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(playerTwoBallX, playerTwoBallY, 10, 0, Math.PI * 2);
        ctx.strokeStyle = "#392b46";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#95cef9";
        ctx.fill();
        ctx.closePath();
    }

    if (playerTwoBallX >= canvas.width - 25) {
        playerTwoClockwise = !playerTwoClockwise;
    }

    if (playerTwoShooting) {
        var dxP2 = playerTwoX - playerTwoBallX;
        var dyP2 = playerTwoY - playerTwoBallY;
        var distanceP2 = Math.sqrt(dxP2 * dxP2 + dyP2 * dyP2);
        var playerTwoShootDirectionX = dxP2 / distanceP2;
        var playerTwoShootDirectionY = dyP2 / distanceP2;

        playerTwoBallX -= playerTwoShootDirectionX * shootVelocity;
        playerTwoBallY -= playerTwoShootDirectionY * shootVelocity;

        playerTwoRadius += shootVelocity;

        var collidedIndexP2 = checkCollision(playerTwoBallX, playerTwoBallY);
        if (playerTwoBallX < 0
            || playerTwoBallX > canvas.width
            || playerTwoBallY < 0
            || playerTwoBallY > canvas.height
            || collidedIndexP2 >= 0
            || playerTwoBallX >= canvas.width / 2 - 20 && playerTwoBallX <= canvas.width / 2 + 20
            && playerTwoBallY >= lineY - lineHeight / 2 - 20 && playerTwoBallY <= lineY + lineHeight / 2 + 20) {
            playerTwoShooting = false;
            if (collidedIndexP2 >= 0) {
                randomDots[collidedIndexP2].x = playerTwoBallX;
                randomDots[collidedIndexP2].y = playerTwoBallY;
            }
        }
    } else if (playerTwoRadius > 100) {
        var dxP2 = playerTwoX - playerTwoBallX;
        var dyP2 = playerTwoY - playerTwoBallY;
        var distanceP2 = Math.sqrt(dxP2 * dxP2 + dyP2 * dyP2);
        var playerTwoShootDirectionX = dxP2 / distanceP2;
        var playerTwoShootDirectionY = dyP2 / distanceP2;

        playerTwoBallX -= playerTwoShootDirectionX * shootVelocity;
        playerTwoBallY -= playerTwoShootDirectionY * shootVelocity;
        playerTwoRadius -= shootVelocity;

        var collidedIndexP2 = checkCollision(playerTwoBallX, playerTwoBallY);
        if (playerTwoBallX < 0
            || playerTwoBallX > canvas.width
            || playerTwoBallY < 0
            || playerTwoBallY > canvas.height
            || collidedIndexP2 >= 0) {
            if (collidedIndexP2 >= 0) {
                randomDots[collidedIndexP2].x = playerTwoBallX;
                randomDots[collidedIndexP2].y = playerTwoBallY;

                if (randomDots[collidedIndexP2].x >= canvas.width - 120) {
                    playerTwoCounter += randomDots[collidedIndexP2].score;
                    randomDots.splice(collidedIndexP2, 1);
                }
            }
        }
    } else {
        playerTwoRadius = 100;
        if (playerTwoClockwise) {
            playerTwoAngle += playerTwoAngularVelocity;
        } else {
            playerTwoAngle -= playerTwoAngularVelocity;
        }
    }

    drawScore();
    drawRandomDots();
    drawMovingLine();
    updateMovingLine();
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", function (event) {
    var playerOneBallX = playerOneX + playerOneRadius * Math.cos(playerOneAngle);
    if (event.code === "Space" && playerOneRadius == 100 && playerOneBallX > 25) {
        playerOneShooting = true;
    }
});

document.addEventListener("keydown", function (event) {
    var playerTwoBallX = playerTwoX - playerTwoRadius * Math.cos(playerTwoAngle);
    if (event.code === "Enter" && playerTwoRadius == 100 && playerTwoBallX < canvas.width - 25) {
        playerTwoShooting = true;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.code === "ShiftRight" && !playerOnePowerupUsed) {
        playerOnePowerupUsed = true;
        showPlayerOneFog = true;
        setTimeout(function () {
            showPlayerOneFog = false;
        }, 6000);
    }
});

document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.code === "ShiftLeft" && !playerTwoPowerupUsed) {
        playerTwoPowerupUsed = true;
        showPlayerTwoFog = true;
        setTimeout(function () {
            showPlayerTwoFog = false;
        }, 6000);
    }
});

canvas.addEventListener("click", function (event) {
    if (playerOneCounter >= 600 || playerTwoCounter >= 600) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
            mouseY >= canvas.height / 2 + 50 && mouseY <= canvas.height / 2 + 100) {
            location.reload();
        }
    }
});

draw();