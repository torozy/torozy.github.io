
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
            // // draw ball
            // const context = ctx;
            // context.beginPath();
            // context.fillStyle = "hsl(110, 100%, 30%)";
            // context.strokeStyle = "hsl(110, 100%, 30%)";
            // let lineWidth = context.lineWidth = 0.5;
            // context.globalAlpha = 0.5;
            // ctx.fillStyle = this.color;
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            // ctx.fill();
            // context.globalAlpha = 1.0;
            // context.stroke();
            ctx.drawImage(afterBlastParticleWebElemnt, 0, 0, 100, 100, this.x - 10, this.y-10, 20, 20);
            
            // ctx.drawImage(afterBlastParticleWebElemnt, 0, 0, afterBlastParticleWebElemnt.width, afterBlastParticleWebElemnt.height, this.x - 5, this.y-5, 10, 10);
            // ctx.drawImage(sprite, 222, 84, 25, 24, this.x - 5, this.y-5, 10, 10);
        } else if (this.color === 'red') { 
            ctx.drawImage(redBulletWebElemnt, 0, 0, 15, 51, this.x - 2.5, this.y, 5, 20);
        }else {
            ctx.drawImage(sprite, 856, 421, 9, 54, this.x - 2.5, this.y, 2, 10);
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