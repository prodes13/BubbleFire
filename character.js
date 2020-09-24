class Character {
    constructor(x, y, radius, color, velocity, context) {
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color
        this.velocity = velocity;
        this.context = context;
    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update() { 
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

export default Character;