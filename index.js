import Character from './character.js';
import Particle from './particle.js';
import { BULLET_SPEED, PLAYER_SPEED, PARTICLE_SPEED } from './constants.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const c = context;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const x = canvas.width/2;
const y = canvas.height/2;

const controls = {
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false
}

const playerVelocity = {
    x: 0,
    y: 0
}

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');

let player;
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Particle(x, y, 15, 'white', playerVelocity, context, 'player');
    console.log(player.name);
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerText = score;
    bigScoreEl.innerText = score;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = 10 + Math.random() * 30;
        let x;
        let y;
        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            // y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color =  `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(
            canvas.height/2 - y,
            canvas.width/2 - x
            );
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Character(x, y, radius, color, velocity, context));
    }, 1000);
}

let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);

    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    if(controls.leftPressed) {
        playerVelocity.x = -PLAYER_SPEED;
    } else if(controls.rightPressed) {
        playerVelocity.x = PLAYER_SPEED;
    } else if(controls.upPressed) {
        playerVelocity.y = -PLAYER_SPEED;
    } else if(controls.downPressed) {
        playerVelocity.y = PLAYER_SPEED;
    } else {
        playerVelocity.x = 0;
        playerVelocity.y = 0;
    }
    
    player.update();
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();
        
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'flex';
            bigScoreEl.innerText = score;
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(dist - enemy.radius - projectile.radius < 1) {
                // this is a trick for the flashing effect
                // create explosions! 
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(projectile.x, 
                            projectile.y, 
                            // radius 0 to 2
                            Math.random() * 2,  
                            enemy.color, 
                            {
                                x: (Math.random() - 0.5) * (Math.random() * PARTICLE_SPEED),
                                y: (Math.random() - 0.5) * (Math.random() * PARTICLE_SPEED)
                            },
                            context
                        ));
                    }

                if(enemy.radius - 10 > 5) {
                    //  increasing out score 
                    score += 100;
                    scoreEl.innerText = score;
                    gsap.to(enemy, {
                        radius: enemy.radius-10
                    });
                    // enemy.radius -= 10;
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {                    
                    //  increasing out score when it's destroyed
                    score += 250;
                    scoreEl.innerText = score;
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    })
}

window.addEventListener('click', (event) => {
    // const projectile = new Projectile(event.clientX, event.clientY, 5, 'red', null);
    // atan2 y is the first argument
    const angle = Math.atan2(
        event.clientY - player.y,
        event.clientX - player.x
        );

    projectiles.push(new Character(
        player.x,
        player.y, 
        5,
        'white',
        {
            x: Math.cos(angle) * BULLET_SPEED,
            y: Math.sin(angle) * BULLET_SPEED
        },
        context
    ));

});

// CONTROLS
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    e.preventDefault();
    if(e.key == "Right" || e.key == "ArrowRight") {
        controls.rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        controls.leftPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        controls.upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        controls.downPressed = true;
    }
}
function keyUpHandler(e) {
    e.preventDefault();
    if(e.key == "Right" || e.key == "ArrowRight") {
        controls.rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        controls.leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        controls.upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        controls.downPressed = false;
    }
}


startGameBtn.addEventListener('click', (event) => {
    init();
    modalEl.style.display = 'none';
    animate();
    spawnEnemies();
});