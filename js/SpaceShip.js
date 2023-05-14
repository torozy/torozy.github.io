
class SpaceShip {
    constructor() {
        this.width = 50;
        this.height = 28;
        this.exhaustWidth = 5 ;
        this.exhaustHeight = 10 ;
        this.startX=mouse.x - (this.width/2);
        this.startY=mouse.y ;
        this.exaustCounter = 0;
        // this.endX=;
        // this.endY=;
    }
    draw() {
        this.startX=mouse.x - (this.width/2);
        this.startY=mouse.y ;
     
        // display spaceship
        ctx.drawImage(shipWebElement, 0, 0, 112, 75, this.startX, this.startY, this.width, this.height);

        // displayt fire exaust
        if(this.exaustCounter < 5){
            ctx.drawImage(sprite, 831, 0, 14, 31, mouse.x - (this.exhaustWidth/2), mouse.y + this.height, this.exhaustWidth, this.exhaustHeight+4);
            this.exaustCounter++;
        }else if (this.exaustCounter <10){
            ctx.drawImage(sprite, 834, 299, 14, 31, mouse.x - (this.exhaustWidth/2), mouse.y + this.height, this.exhaustWidth, this.exhaustHeight);
            this.exaustCounter++;
        }else{
            this.exaustCounter=0;
        }

        
    }
}
