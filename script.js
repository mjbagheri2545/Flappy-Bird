let can = document.querySelector('canvas');
let c = can.getContext('2d');

let sprite = new Image();
sprite.src = './image/sprite.png';
let frame = 0;

let state = {
    currentState : 0,
    getready : 0,
    gaming : 1,
    gameover : 2
}

function click(){
    switch (state.currentState) {
        case state.getready:
            state.currentState = state.gaming;
            break;
        case state.gaming:
            bird.flap();
            break;
        default:
            bird.speed = 0;
            state.currentState = state.getready;
            break;
    }
}

document.addEventListener('click',click);
document.addEventListener('keydown',(e)=>{
    if(e.which == 32){
        click();
    }
    console.log(2)
})

class Bg{
    constructor(){
        this.sx = 0,
        this.sy = 0,
        this.w = 275,
        this.h = 224,
        this.x = 0,
        this.y = can.height - 224
    }
    draw(){
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w,this.y,this.w,this.h);
    }

}

let bg = new Bg();

class Fg{
    constructor(){
        this.sx = 276,
        this.sy = 0,
        this.w = 224,
        this.h = 112,
        this.x = 0,
        this.y = can.height - 112
    }
    draw(){
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w,this.y,this.w,this.h);

    }

}

let fg = new Fg();

class Bird{
    constructor(){
        this.animation = [
        {sx : 276, sy : 112},
        {sx : 276, sy : 139},
        {sx : 276, sy : 165},
        {sx : 276, sy : 139},
        ],
        this.w = 34,
        this.h = 26,
        this.x = 50,
        this.y = 150,
        this.currentIndex = 0,
        this.g = 0.25,
        this.speed = 0
    }
    draw(){
    let bird = this.animation[this.currentIndex];
    c.drawImage(sprite,bird.sx,bird.sy,this.w,this.h,this.x - this.w/2,this.y-this.h/2,this.w,this.h);
    }
    flap(){
    this.speed = -4.6;
    console.log(this.speed)
    }
    update(){
    let flySpeed = state.currentState == state.getready ? 10 : 5;
    this.currentIndex += frame % flySpeed == 0 ? 1 : 0;
    this.currentIndex = this.currentIndex % 4;
    if(state.currentState == state.getready){
        this.y = 130;
    }else{
        this.speed +=this.g;
        this.y +=this.speed;
    }
    if(this.y + this.h/2 >= can.height - fg.h){
        state.currentState = state.gameover;
        this.y = can.height - fg.h - this.h/2;
    }
    }

}

let bird = new Bird();

class GetReady{
    constructor(){
        this.sx = 0,
        this.sy = 228,
        this.w = 174,
        this.h = 160,
        this.x = can.width/2 - 174/2,
        this.y = 80
    }
    draw(){
    if(state.currentState == state.getready){
        c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }
    }

}

let getready = new GetReady();

class GameOver{
    constructor(){
        this.sx = 175,
        this.sy = 228,
        this.w = 225,
        this.h = 200,
        this.x = can.width/2 - 225/2,
        this.y = 100
    }
    draw(){
    if(state.currentState == state.gameover){
        c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }
    }

}

let gameover = new GameOver();

function draw(){
    c.fillStyle = '#00cec9';
    c.fillRect(0,0,can.width,can.height);
    bg.draw();
    fg.draw();
    getready.draw();
    gameover.draw();
    bird.draw();
}
function update(){
    bird.update();
}
function game(){
    update();
    draw();
    frame++;
    requestAnimationFrame(game);
    

}

game();