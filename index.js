const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl')
canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary{
    constructor({position}){
        this.position = position;
        this.width = 40;
        this.height = 40;
    }

    draw(){
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player{
    constructor({position, velocity}){
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 );
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Ghost{
    static speed = 2;
    constructor({position, velocity, color = 'red'}){
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = 15;
    this.prevCollision = []
    this.speed = 2;
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 );
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Pellet{
    constructor({position}){
    this.position = position;
    this.radius = 3;
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 );
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

const map = [
['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
['-', ' ', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
['-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-'],
['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
['-', '.', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '.', '-'],
['-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
['-', '-', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '-', '-'],
[' ', ' ', ' ', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', ' ', ' ', ' '],
[' ', ' ', ' ', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', ' ', ' ', ' '],
[' ', ' ', ' ', '-', '.', '.', '.', '-', ' ', ' ', ' ', '-', '.', '.', '.', '-', ' ', ' ', ' '],
[' ', ' ', ' ', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', ' ', ' ', ' '],
[' ', ' ', ' ', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', ' ', ' ', ' '],
['-', '-', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '-', '-'],
['-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
['-', '.', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '.', '-'],
['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
['-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-'],
['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]

var continueAnimating = true;
const pellets = []
const boundaries = [];
const ghosts = [new Ghost({position: {x: 700, y:60}, velocity: {x:-Ghost.speed, y:0}}),
    new Ghost({position: {x: 60, y:700}, velocity: {x:Ghost.speed, y:0}})];
const player = new Player({position: {x: 60, y:60}, velocity: {x:0, y:0}});
const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    }
}

let lastkey = '';
let score = 0;

map.forEach((row, v) => {
row. forEach((symbol, h) => {
    switch (symbol){
        case '-':
            boundaries.push(new Boundary({position:{x:40 * h, y:40 * v}}))
            break;
            case '.':
            pellets.push(new Pellet({position:{x: 20 + 40 * h, y: 20 + 40 * v}}))
            break;
        }
    })
})

function circleCollidesWithRectangle({circle, rectangle}){
    const padding = (40 / 2 - circle.radius -1)
return(circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x>= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding);
}

function animate() {
    if(continueAnimating){
        requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    if(keys.w.pressed && lastkey === 'w'){
        for(let i = 0; i < boundaries.length; i++){
            const Boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0, y:-5}}, rectangle: Boundary})){
            player.velocity.y = 0;
            break;
        }else{
            player.velocity.y = -5;
        }
        }
}else if(keys.a.pressed && lastkey === 'a'){
    for(let i = 0; i < boundaries.length; i++){
        const Boundary = boundaries[i];
        if (circleCollidesWithRectangle({circle: {...player, velocity: {x:-5, y:0}}, rectangle: Boundary})){
        player.velocity.x = 0;
        break;
    }else{
        player.velocity.x = -5;
    }
    }
}else if(keys.s.pressed && lastkey === 's'){
    for(let i = 0; i < boundaries.length; i++){
        const Boundary = boundaries[i];
        if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0, y:5}}, rectangle: Boundary})){
        player.velocity.y = 0;
        break;
    }else{
        player.velocity.y = 5;
    }
    }
}else if(keys.d.pressed && lastkey === 'd'){
    for(let i = 0; i < boundaries.length; i++){
        const Boundary = boundaries[i];
        if (circleCollidesWithRectangle({circle: {...player, velocity: {x:5, y:0}}, rectangle: Boundary})){
        player.velocity.x = 0;
        break;
    }else{
        player.velocity.x = 5;
        }
    }
}
pellets.forEach((pellet, i) =>{
    pellet.draw();

    if(Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius){
        pellets.splice(i, 1)
        score += 10;
        scoreEl.innerHTML = score;
    }
})
    boundaries.forEach((Boundary) => {
    Boundary.draw();

    if (circleCollidesWithRectangle({circle: player, rectangle: Boundary})){
        console.log('we are colise');
        player.velocity.y = 0
        player.velocity.x = 0
    }
})
player.update();

ghosts.forEach(Ghost => {     
    Ghost.update();

    if(Math.hypot(Ghost.position.x - player.position.x, Ghost.position.y - player.position.y) < Ghost.radius + player.radius){
    continueAnimating = false;
    console.log('you lose')
    }
    const collisions = [];     
    boundaries.forEach((Boundary) =>{          
    if (!collisions.includes('right') && circleCollidesWithRectangle({circle: {...Ghost, velocity: {x:Ghost.speed, y:0}}, rectangle: Boundary})){             
            collisions.push('right'); 
        }         
    if (!collisions.includes('left') && circleCollidesWithRectangle({circle: {...Ghost, velocity: {x:-Ghost.speed, y:0}}, rectangle: Boundary})){             
            collisions.push('left');         
        }         
    if  (!collisions.includes('up') && circleCollidesWithRectangle({circle: {...Ghost, velocity: {x:0, y:-Ghost.speed}}, rectangle: Boundary})){             
            collisions.push('up');         
        }         
    if (!collisions.includes('down') && circleCollidesWithRectangle({circle: {...Ghost, velocity: {x:0, y:Ghost.speed}}, rectangle: Boundary})){             
            collisions.push('down');         
        }     
    }) 

    if(collisions.length > Ghost.prevCollision.length)
        Ghost.prevCollision = collisions
      
            
           
    

    if(JSON.stringify(collisions) !== JSON.stringify(Ghost.prevCollision)){         
    //console.log('logogo')         
           if(Ghost.velocity.x > 0) Ghost.prevCollision.push('right')
           else if(Ghost.velocity.x < 0) Ghost.prevCollision.push('left')
           else if(Ghost.velocity.y > 0) Ghost.prevCollision.push('down')
           else if(Ghost.velocity.y < 0) Ghost.prevCollision.push('up') 
        
            //console.log(collisions) 
            //console.log(Ghost.prevCollision)  
            const pathways = Ghost.prevCollision.filter((collision) => {return !collisions.includes(collision)}); 
            
            //console.log({pathways})

            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            
            //console.log({direction})
            
            switch (direction){
                case 'down':
                Ghost.velocity.y = Ghost.speed;
                Ghost.velocity.x = 0;
                break
                case 'up':
                Ghost.velocity.y = -Ghost.speed;
                Ghost.velocity.x = 0;
                break
                case 'right':
                Ghost.velocity.y = 0;
                Ghost.velocity.x = Ghost.speed;
                break
                case 'left':
                Ghost.velocity.y = 0;
                Ghost.velocity.x = -Ghost.speed;
                break
            }
            Ghost.prevCollision = [];
        }
        
        }) }
}


animate();

addEventListener('keydown', ({key}) => {
    switch (key){
        case 'w':
            keys.w.pressed = true;
            lastkey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastkey = 'a';
            break;
        case 's':
            keys.s.pressed = true; 
            lastkey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastkey = 'd';
            break;
    }
})
addEventListener('keyup', ({key}) => {
    switch (key){
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false; 
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})
