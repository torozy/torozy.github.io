/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


getMousePos = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        xCurrent: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        yCurrent: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

blastBox = (box) => {
    for (let i = 0; i < box.blastParticles; i = i + 100) {
        // let speed=(Math.random() - 0.5) * 2;
        let blastParticle = new Particle(box.x + 17.5, box.y + 17.5, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 100, 'yellow');
     
        let blastAudio = new Audio('img/Blast.mp3');
        blastAudio.volume = 0.7;
        blastAudio.play();

        particles.push(blastParticle);
    }
}

drawScoreBoard = () => {

    document.getElementById("score").innerHTML = score;

}

gameOver = () => {

    if(score > maxScore){
        window.localStorage.setItem("maxScore",score);
        maxScore = score;
    }

    const context = ctx;
    context.fillStyle = "#DDE";
    context.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    context.beginPath();
    context.fillStyle = "green";
    context.strokeStyle = "hsl(110, 100%, 30%)";
    let lineWidth = context.lineWidth = 0.5;
    context.globalAlpha = 0.5;
    context.fillStyle = "hsl(110, 100%, 30%)";
    context.fillRect(0, ctx.canvas.height / 2 - 37.5, ctx.canvas.width, ctx.canvas.height / 2 + 37.5);
    context.globalAlpha = 1.0;


    const controller = document.getElementById("controller");
    controller.style = "display: none;";

    document.getElementById("popup").style = "display: none;";

    restartPopup.style = "display: block;";

    const scoreHolder = document.getElementById("score-holder");
    scoreHolder.innerHTML = score;

    const maxScoreHolder = document.getElementById("max-score-holder");
    maxScoreHolder.innerHTML = maxScore;
    
    document.getElementById("level").innerHTML = level;


    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.style = "display: none;";

    powerPlay = false;

    gameOverFlag = true;

}

var img_obj = {
    'source': null,
    'current': 0,
    'total_frames': 2,
    'width': 180,
    'height': 220
};



const sprite = document.getElementById("tank");

let fireAnimateToggle = true;



drawGun = (x) => {

    if (powerPlay) {
        document.getElementById("popup").style = "display: block;animation:fade 3000ms;-webkit-animation:fade 3000ms;";

        // display spaceship
        ctx.drawImage(shipWebElement, 0, 0, 112, 75, mouse.x - 46, mouse.y - 80, 92, 55);

        
        // displayt fire exaust
        if(fireAnimateToggle){
            ctx.drawImage(sprite, 831, 0, 14, 31, mouse.x - 8, mouse.y - 25, 16, 15);
        }else{
            ctx.drawImage(sprite, 834, 299, 14, 31, mouse.x - 8, mouse.y - 25, 16, 20);
        }

    } else {

        document.getElementById("popup").style = "display: none;";

         // display spaceship
         ctx.drawImage(shipWebElement, 0, 0, 112, 75, mouse.x - 46, mouse.y - 80, 92, 55);


        
        // displayt fire exaust
        if(exaustCounter < 5){
            ctx.drawImage(sprite, 831, 0, 14, 31, mouse.x - 8, mouse.y - 25, 16, 15);
            exaustCounter++;
        }else if (exaustCounter <10){
            ctx.drawImage(sprite, 834, 299, 14, 31, mouse.x - 8, mouse.y - 25, 16, 20);
            exaustCounter++;
        }else{
            exaustCounter=0;
        }

        fireAnimateToggle=!fireAnimateToggle;

        // draw_tank(ctx, 10, 10);

    }


}

animate = () => {
    if(moveLeftFlag && mouse.x > 0 ){
        mouse.x = mouse.x - 2.5;
    }else if(moveRightFlag && mouse.x < window.innerWidth){
        mouse.x = mouse.x + 2.5;
    }

    if (powerPlay) {
        ctx.fillStyle = "lightgreen";
    } else {
        ctx.fillStyle = "black";
    }
    
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //animate background
    if(backgroundAnimationY<=0){
    for(let bgy = backgroundAnimationY; bgy < ctx.canvas.height ;bgy = bgy+256){
       for(let bgx = 0; bgx < ctx.canvas.width ;bgx = bgx+256){
            ctx.drawImage(background, 0, 0,256,256,bgx,bgy,256,256);
        }   
    }
    backgroundAnimationY++;

    }else{
        for(let bgy = backgroundAnimationY; bgy < ctx.canvas.height ;bgy = bgy+256){
            for(let bgx = 0; bgx < ctx.canvas.width ;bgx = bgx+256){
                 ctx.drawImage(background, 0, 0,256,256,bgx,bgy,256,256);
             }   
         }
        backgroundAnimationY = -256;
    }

    

    ctx.save();

    drawGun();
    let boxesLength = boxes.length, particlesLength = particles.length;
    if (boxesLength > 3) {
        powerPlay = true;
    }
    for (let i = 0; i < boxesLength; i++) {
        for (let j = 0; j < particlesLength; j++) {
            let boxX = boxes[i].x, boxY = boxes[i].y, particleX = particles[j].x, particleY = particles[j].y;

            if (0 > particleY || particleY > window.innerHeight) {
                particles.splice(j, 1);
                particlesLength--;
                j--;
                continue;
            }

            if (boxX < particleX && particleX < (boxX + (6 - getMeteriodSize(boxes[i].value))*20) && boxY < particleY && particleY < (boxY + (6 - getMeteriodSize(boxes[i].value))*20)) {
                boxes[i].value = boxes[i].value - particles[j].value;
                particles.splice(j, 1);
                particlesLength--;
                j--;
                score++;
                if (boxes[i].value === 0 || boxes[i].value < 0) {
                    blastBox(boxes[i]);
                    boxes.splice(i, 1);
                    boxesLength--;
                    break;
                }
            }
        }
        if (boxes.length > 0 && boxes[i] != undefined) {
            if (boxes[i].y > window.innerHeight) {
                gameOver();
                return;
            }
            boxes[i].draw();
        }

        if (score > level * 10) {
            boxMaxValue += 1;
            level++;
            document.getElementById("level").innerHTML = level;
            powerPlay = false;
        }

    }

    particles.map(particle => {
        particle.draw();
    });

    //    console.log(particles);
    drawScoreBoard();

    if(!controllerIntructionFlag){
        drawControllerInstructions(ctx);
    }

    //start partical and box addition to the frame
    isAnimate = true;

    ctx.restore();
    requestAnimationFrame(animate);
}

const drawControllerInstructions = (ctx) => {

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(ctx.canvas.width-150 , (ctx.canvas.height/2), 140, 90);
    ctx.fillStyle = 'black';
    ctx.font = "30px serif";
    ctx.fillText("Click [>>] to ", ctx.canvas.width-140, (ctx.canvas.height/2)+40 ,120);
    ctx.fillText("Move Ship Right", ctx.canvas.width-140, (ctx.canvas.height/2) + 75 ,120);
    drawArrow(ctx,ctx.canvas.width-20,  (ctx.canvas.height/2)+90,ctx.canvas.width-20 ,ctx.canvas.height - ctx.canvas.height*0.32 ,10, 'lightgreen')


    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(10 , (ctx.canvas.height/2), 140, 90);
    ctx.fillStyle = 'black';
    ctx.font = "30px serif";
    ctx.fillText("Click [<<] to ", 10, (ctx.canvas.height/2)+40 ,120);
    ctx.fillText("Move Ship Left", 10, (ctx.canvas.height/2) + 75 ,120);
    drawArrow(ctx,20,  (ctx.canvas.height/2)+90,20 ,ctx.canvas.height - ctx.canvas.height*0.32 ,10, 'lightgreen')

    window.localStorage.setItem("controllerIntructionFlag", true);

}

const drawArrow = (ctx, startX, startY, endX, endY, width, color) => {

    var headlen = 10;
    var angle = Math.atan2(endY-startY,endX-startX);
    // ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX-headlen*Math.cos(angle-Math.PI/7),
               endY-headlen*Math.sin(angle-Math.PI/7));
    ctx.lineTo(endX-headlen*Math.cos(angle+Math.PI/7),
               endY-headlen*Math.sin(angle+Math.PI/7));
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX-headlen*Math.cos(angle-Math.PI/7),
               endY-headlen*Math.sin(angle-Math.PI/7));
    ctx.stroke();
    // ctx.restore();
}

class Particle {
    constructor(x, y, speedX, speedY, value, color) {
        this.x = x;
        this.y = y;
        this.speedY = speedY;
        this.speedX = speedX;
        this.value = value;
        this.color = color;
    }

    update() {
        this.checkBoundary();
        this.y -= this.speedY;
        this.x -= this.speedX;
    }
    draw() {

        if (this.color === 'yellow') {
            // draw ball
            const context = ctx;
            context.beginPath();
            context.fillStyle = "hsl(110, 100%, 30%)";
            context.strokeStyle = "hsl(110, 100%, 30%)";
            let lineWidth = context.lineWidth = 0.5;
            context.globalAlpha = 0.5;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            context.globalAlpha = 1.0;
            context.stroke();
        } else {
            ctx.drawImage(sprite, 856, 421, 9, 54, this.x - 2.5, this.y, 5, 20);
        }


        this.update();
    }
    checkBoundary() {
        if (this.x >= window.innerWidth || this.x <= 0) {
            this.speedX = -1 * this.speedX;
        }
        if (this.y > window.innerHeight) {
            this.speedY = -1 * this.speedY;
        }
    }
}

class Box {
    constructor() {
        this.value = this.generateValue();
        this.initHealth =  this.value;
        this.blastParticles = this.value;
        let tmpValue = (Math.random() * window.innerWidth);
        this.x = tmpValue > 70 ? tmpValue - 70 : tmpValue;
        this.y = 0;
        this.speedY = 1;
        this.ang = 0
        this.rotationSpeed = Math.random() > 0.5 ? -5*Math.random() : 5*Math.random() ;
    }
    generateValue(){
        let tmp = boxMaxValue;
        if(boxes.length && boxes[boxes.length-1] > (boxMaxValue*0.5)){
            tmp = 3;
        }
        return Math.floor(Math.random() * (tmp - boxMinValue) + boxMinValue);
    }
    update() {
        this.y += this.speedY;
    }
    draw() {
        // draw health

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, 10, 5);
        ctx.fillStyle = "hsl(110, 100%, 30%)";
        ctx.fillRect(this.x, this.y, 10 - (10 * (this.initHealth-this.value)/this.initHealth), 5);

        ctx.globalAlpha = 1.0;
        ctx.stroke();


        //draw meteor
        let size = getMeteriodSize(this.value);

        ctx.save()
        var pos = {x: (this.x + (6-size)*10), y: (this.y + (6-size)*10)}
        ctx.translate(pos.x ,pos.y)    
        ctx.rotate(Math.PI / 180 * (this.ang += this.rotationSpeed))
        
        if(size === 5){
            ctx.drawImage(sprite, 0, 520, 120, 98, -(6-size)*10, -(6-size)*10, (6-size)*20, (6-size)*20);
        }else if(size === 4){
            ctx.drawImage(sprite, 518, 810, 89, 82, -(6-size)*10, -(6-size)*10, (6-size)*20, (6-size)*20);
        }else if(size === 3){
            ctx.drawImage(sprite, 327, 452, 98, 96, -(6-size)*10, -(6-size)*10, (6-size)*20, (6-size)*20);
        }else if(size === 2){
            ctx.drawImage(sprite, 0, 520, 120, 98, -(6-size)*10, -(6-size)*10, (6-size)*20, (6-size)*20);
        }else{
            ctx.drawImage(meteor, 0, 0, 98, 96, -(6-size)*10,-(6-size)*10, (6-size)*20, (6-size)*20);
        }


        ctx.restore()

        

        this.update();
    }
}

getMeteriodSize = (value) => {
    let tmpSize = 1;
    if(value>100){
        tmpSize = 5;
    }else if(value>60){
        tmpSize = 4;
    }else if(value>35){
        tmpSize = 3;        
    }else if(value>20){
        tmpSize = 2;
    }
    return tmpSize;
}


function drawCircle() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2);
    ctx.fill();
}

resetGame = () => {
    particles = [];
    boxes = [];
    mouse = {
        x: window.innerWidth / 2,
        y: ctx.canvas.height -20
    }
    boxMinValue = 1;
    boxMaxValue = 5;
    score = 0;
    level = 1;
    gameOverFlag = false;

    document.getElementById("level").innerHTML = level;

}

const playGround = document.getElementById("playGround");
playGround.width = window.innerWidth;
// playGround.height = window.innerHeight-window.innerHeight*0.05;
playGround.height = window.innerHeight;


const restartPopup = document.getElementById("restart-popup");
const shipWebElement = document.getElementById("ship");
const meteor = document.getElementById("meteor");
const canvasElement = document.getElementById("myCanvas");
const background = document.getElementById("background");
const swipeInstruction = document.getElementById("swipeInstruction");

const ctx = canvasElement.getContext("2d");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
let particles = [];
let boxes = [];
let mouse = {
    x: window.innerWidth / 2,
    y: ctx.canvas.height - 20
}
let boxMinValue = 1;
let boxMaxValue = 5;
let score = 0;
let level = 1;
let gameOverFlag = false;
let storage = window.localStorage;
let maxScore = storage.getItem("maxScore") || 0;
let shootSpeed = 250 / level;
let powerPlay = false;
let moveRightFlag = false;
let moveLeftFlag = false;
let isAnimate = false;
//user for animating ship's exaust 
let exaustCounter = 0;
let backgroundAnimationY = -256;
//make it true for swipe instruction
let controllerIntructionFlag = window.localStorage.getItem("controllerIntructionFlag") || false;

// const initSpaceShip = (e) => {

//     controllerIntructionFlag = false;
//     mouse.x = e.touches[0].clientX;
//     mouse.y = e.touches[0].clientY-50;
//     // if (gameOverFlag &&
//     //     (ctx.canvas.width / 2 - 90) < mouse.x && (ctx.canvas.width / 2 + 60) > mouse.x &&
//     //     (ctx.canvas.height / 2 + 75) < mouse.y && (ctx.canvas.height / 2 + 125) > mouse.y) {
//     //     resetGame();
//     //     requestAnimationFrame(animate);
//     // }
//     //if(powerPlay){
//     //  particles.push(new Particle(event.x, window.innerHeight-50, 0, 10, 100, 'red'));
//     //}else{
//     //  particles.push(new Particle(event.x, window.innerHeight-50, 0, 10, 1, 'blue'));
//     //}
// }
// // document.getElementById("startPopup").height=width.innerHeight;

// canvasElement.addEventListener("touchmove", initSpaceShip);


restartPopup.addEventListener("click", function (event) {
    
    restartPopup.style = "display: none;";
    
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.style = "display: flex;";

    const controller = document.getElementById("controller");
    controller.style = "display: flex;";

        resetGame();
        requestAnimationFrame(animate);

});

const conLeft = document.getElementById("left-move-button");
conLeft.addEventListener("touchstart", function (event) {
    moveLeftFlag = true;
    moveRightFlag = false;
    
    leftControllerButtonPressed();

    if(!controllerIntructionFlag){
        controllerIntructionFlag = true;
    } 
});

conLeft.addEventListener("touchend", function (event) {
    moveLeftFlag = false;
    controllerButtonUnPressed();
});

const conRight = document.getElementById("right-move-button");
conRight.addEventListener("touchstart", function (even) {
    moveRightFlag = true;
    moveLeftFlag = false;
    
    rightControllerButtonPressed();

    if(!controllerIntructionFlag){
        controllerIntructionFlag = true;
    } 

})

conRight.addEventListener("touchend", function (even) {
    moveRightFlag = false;
    controllerButtonUnPressed();
})

const leftControllerButtonPressed = () => {
    const leftButton = document.getElementById("left-move-button");
    leftButton.style = "transform: scale(1.1, 1.1);box-shadow: 0px 0px 0px 0px #00640057;";

}

const rightControllerButtonPressed = () => {
    const rightButton = document.getElementById("right-move-button");
    rightButton.style = "transform: scale(1.1, -1.1);box-shadow: 0px 0px 0px 0px #00640057;";


}

const controllerButtonUnPressed = () => {
    const rightButton = document.getElementById("right-move-button");
    rightButton.style = "box-shadow: -4px 8px 3px 3px #00640057;";

    const leftButton = document.getElementById("left-move-button");
    leftButton.style = "box-shadow: 4px 8px 3px 3px #00640057;";
}


// const startGame = () => {
//     ctx.fillStyle = "#DDE";
//     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.save();
//     ctx.fillStyle = "#DDE";
//     ctx.fillRect(ctx.canvas.width / 2 - 175, (ctx.canvas.height / 2) + 150, 310, 110);
//     ctx.stroke();
//     ctx.globalAlpha = 0.5;
//     ctx.fillStyle = "white";
//     ctx.fillRect(ctx.canvas.width / 2 - 180, (ctx.canvas.height / 2) + 150, 300, 100);
//     ctx.globalAlpha = 1.0;
//     ctx.stroke();
//     ctx.fillStyle = "black";
//     ctx.fillText('Start', ctx.canvas.width / 2 - 115, (ctx.canvas.height / 2) + 220);
//     ctx.stroke();
// }

// startGame();
setInterval(() => {
    if(isAnimate){
        boxes.push(new Box());
        isAnimate=false;
    }
}, 3000);

setInterval(() => {
    if(isAnimate){
        if (powerPlay) {
            particles.push(new Particle(mouse.x, mouse.y - 100, 0, 10, 100, 'yellow'));
        } else {
            particles.push(new Particle(mouse.x, mouse.y - 100, 0, 10, 1, 'blue'));
        }
        
        isAnimate=false;
    }
    
}, shootSpeed);
//let powerModeEmitter = setInterval(() => {
//    powerPlay=!powerPlay;
//}, 3000);

let audio = new Audio('img/Toro track.mp3');
audio.volume=0.025;
audio.loop = true;



   

const playTrack= ()=> {
    audio.play().then(x=>playTrack())
    .catch(e => console.log("audio not supported"));
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", function (event) {
    const startPopup = document.getElementById("startPopup");
    startPopup.style = "display: none;"
    canvasElement.style = "display: block;";

    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.style = "display: flex;";

    const controller = document.getElementById("controller");
    controller.style = "display: flex;";
    resetGame();
    audio.play();
    // playTrack();
    requestAnimationFrame(animate);
});


