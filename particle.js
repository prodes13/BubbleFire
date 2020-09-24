import Character from './character.js';
import { FRICTION } from './constants.js';

class Particle extends Character{
    constructor(x, y, radius, color, velocity, context) {
        super(x, y, radius, color, velocity, context);
        this.alpha = 1;
    }
    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.restore();
    }

    update() { 
        this.draw();
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

export default Particle;