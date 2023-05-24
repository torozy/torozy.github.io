
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
        this.damageBlastList=[];
        this.distroySequence = false;
        this.distroySequenceFrame = 12;
        this.isDistroyed = false;
        this.flameFireFrame = 6;
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
        
        //draw meteor
        let size = getMeteriodSize(this.value);
        if (!this.distroySequence) {
            // draw health

            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "grey";
            ctx.fillRect(this.x - healthBarOffsetX, this.y - healthBarOffsetY, 7, 2);
            ctx.fillStyle = "hsl(110, 100%, 30%)";
            ctx.fillRect(this.x - healthBarOffsetX, this.y - healthBarOffsetY, 7 - (7 * (this.initHealth - this.value) / this.initHealth), 2);

            ctx.globalAlpha = 1.0;
            ctx.stroke();

            if (this.flameFireFrame >= 1) {
                draw2DSpriteFrame(flameFireWebElemnt, this.flameFireFrame, 3, 128, 126,
                    {
                        x: this.x -(size * 40),
                        y: this.y-(size * 70),
                        width: size * 100,
                        height: size * 100
                    });

                this.flameFireFrame--;
            } else {
                this.flameFireFrame = 6;
            }


            ctx.save()
            var pos = { x: (this.x + (size) * 10), y: (this.y + (size) * 10) }
            ctx.translate(pos.x, pos.y)
            ctx.rotate(Math.PI / 180 * (this.ang += this.rotationSpeed))

            if (size === 5) {

                ctx.drawImage(sprite, 0, 520, 120, 98, -(size) * 10, -(size) * 10, (size) * 20, (size) * 20);
            } else if (size === 4) {

                ctx.drawImage(sprite, 518, 810, 89, 82, -(size) * 10, -(size) * 10, (size) * 20, (size) * 20);
            } else if (size === 3) {

                ctx.drawImage(sprite, 327, 452, 98, 96, -(size) * 10, -(size) * 10, (size) * 20, (size) * 20);
            } else if (size === 2) {

                ctx.drawImage(sprite, 0, 520, 120, 98, -(size) * 10, -(size) * 10, (size) * 20, (size) * 20);
            } else {
                ctx.drawImage(meteor, 0, 0, 98, 96, -(size) * 10, -(size) * 10, (size) * 20, (size) * 20);
            }

            ctx.restore()

            this.blastParticles = this.damageBlastList.forEach((damageCoordinates, index, arr) => {

                if (damageCoordinates.animateIndex > 0) {
                    drawSpriteFrame(explosionWebElemnt, damageCoordinates.animateIndex, 6,
                        {
                            x: damageCoordinates.damageX,
                            y: damageCoordinates.damageY,
                            width: size * 5,
                            height: size * 5
                        });
                }
                arr[index] = { ...damageCoordinates, animateIndex: damageCoordinates.animateIndex - 1 };
            })

            this.update();
        } else {
            if (this.distroySequenceFrame > 0) {
                let pos = { x: (this.x + (size) * 10), y: (this.y + (size) * 10) }
                drawSpriteFrame(explosionWebElemnt,(this.distroySequenceFrame%2 ===0)? this.distroySequenceFrame/2 : (this.distroySequenceFrame+1)/2  , 6,
                    {
                        x: pos.x,
                        y: pos.y,
                        width: size * 20,
                        height: size * 20
                    });
                this.distroySequenceFrame--; 
            }else{
                this.isDistroyed = true;
            }
        }
    }
}
