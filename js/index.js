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
    // for (let i = 0; i < box.blastParticles; i = i + 100) {
        // console.log("inside blast box")
        // let speed=(Math.random() - 0.5) * 2;
        let blastParticle = new Particle(box.x + 17.5, box.y + 17.5, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 100, 'yellow');
     
        let blastAudio = new Audio('img/Blast.mp3');
        blastAudio.volume = 0.9;
        blastAudio.play();

        particles.push(blastParticle);
    // }

}

drawScoreBoard = () => {

    document.getElementById("score").innerHTML = score;

}

gameOver = () => {

    audio.pause(); 

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
    for(let bgy = backgroundAnimationY; bgy < ctx.canvas.height ;bgy = bgy+background.height){
       for(let bgx = 0; bgx < ctx.canvas.width ;bgx = bgx+background.width){
            ctx.drawImage(background, 0, 0,background.width,background.height,bgx,bgy,background.width,background.height);
        }   
    }
    backgroundAnimationY++;

    }else{
        for(let bgy = backgroundAnimationY; bgy < ctx.canvas.height ;bgy = bgy+background.height){
            for(let bgx = 0; bgx < ctx.canvas.width ;bgx = bgx+background.width){
                 ctx.drawImage(background, 0, 0,background.width,background.height,bgx,bgy,background.width,background.height);
             }   
         }
        backgroundAnimationY = -background.height;
    }

    //power play popup
    
    if (powerPlay) {
        document.getElementById("popup").style = "display: block;animation:fade 3000ms;-webkit-animation:fade 3000ms;";
    } else {
        document.getElementById("popup").style = "display: none;";
    }

    ctx.save();

    spaceShip.draw();
    let boxesLength = boxes.length, particlesLength = particles.length;
    
    for (let i = 0; i < boxesLength; i++) {
        for (let j = 0; j < particlesLength; j++) {
            let boxX = boxes[i].x, boxY = boxes[i].y, particleX = particles[j].x, particleY = particles[j].y;

            if (0 > particleY || particleY > window.innerHeight) {
                particles.splice(j, 1);
                particlesLength--;
                j--;
                continue;
            }

            if (boxX < particleX && particleX < (boxX + (getMeteriodSize(boxes[i].value))*20) && boxY < particleY && particleY < (boxY + ( getMeteriodSize(boxes[i].value))*20)) {
                boxes[i].value = boxes[i].value - particles[j].value;
                boxes[i].damageBlastList.push({
                    damageX: particleX,
                    damageY: particleY,
                    animateIndex: 6
                });

                let laserBlastAudio = new Audio('img/laser1.mp3');
                laserBlastAudio.volume = 0.9;
                laserBlastAudio.play();

                particles.splice(j, 1);
                particlesLength--;
                j--;
                score++;
                if (boxes[i].value === 0 || boxes[i].value < 0) {
                    if(boxes[i].isDistroyed){
                        blastBox(boxes[i]);
                        boxes.splice(i, 1);
                        boxesLength--;
                        break;
                    }else{
                        boxes[i].distroySequence=true;
                        score--;
                        break;
                    }
                    
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

        if (boxes[i] && boxes[i].y > ctx.canvas.height*0.5) {
            powerPlay = true;
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


const drawSpriteFrame = (spriteElement,frame,maxFrame,coordinates) => {

    const frameWidth = spriteElement.width/maxFrame;
    const frameHeight = spriteElement.height;
    ctx.drawImage(spriteElement, (frame-1)*frameWidth, 0, frame*frameWidth, frameHeight,
                 coordinates.x-(coordinates.width/2),coordinates.y,coordinates.width ,coordinates.height );
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
        y: ctx.canvas.height -80
    }
    boxMinValue = 1;
    boxMaxValue = 5;
    score = 0;
    level = 1;
    gameOverFlag = false;

    document.getElementById("level").innerHTML = level;
    audio.play();

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
const redBulletWebElemnt = document.getElementById("red-bullet");
const explosionWebElemnt = document.getElementById("explosion");
const afterBlastParticleWebElemnt = document.getElementById("sun");



const ctx = canvasElement.getContext("2d");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
let particles = [];
let boxes = [];
//to be overriden in reset method
let mouse = {
    x: 0,
    y: 0
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
let backgroundAnimationY = -256;
//make it true for swipe instruction
let controllerIntructionFlag = window.localStorage.getItem("controllerIntructionFlag") || false;

//meteor health bar
const healthBarOffsetX=10;
const healthBarOffsetY=10;

//construct Space Ship

const spaceShip = new SpaceShip();

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


// startGame();
setInterval(() => {
    if(isAnimate){
        boxes.push(new Box());
        isAnimate=false;
        audio.play();
    }else{
        audio.pause();
    }
}, 3000);

setInterval(() => {
    if(isAnimate){
        if (powerPlay) {
            particles.push(new Particle(mouse.x, mouse.y , 0, 10, 100, 'red'));
        } else {
            particles.push(new Particle(mouse.x, mouse.y , 0, 10, 1, 'blue'));
        }
        
        isAnimate=false;
    }
    
}, shootSpeed);

let audio = new Audio('img/space-asteroids.mp3');
audio.volume=0.3;
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

window.addEventListener('load', () => {
    startButton.disabled =false;
  })
