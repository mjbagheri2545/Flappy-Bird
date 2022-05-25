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

function clickHandler(){
    switch (state.currentState) {
        case state.getready:
            state.currentState = state.gaming;
            break;
        case state.gaming:
            bird.flap();
            break;
        default:
            state.currentState = state.getready;
            break;
    }
}

document.addEventListener('click',clickHandler);
document.addEventListener('keydown',(e)=>{
    if(e.code == 'space'){
        clickHandler();
    }
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
        {sy : 112},
        {sy : 139},
        {sy : 165},
        {sy : 139},
        ],
        this.sx = 276,
        this.w = 34,
        this.h = 26,
        this.x = 33,
        this.y = 130,
        this.currentIndex = 0,
        this.bird = this.animation[this.currentIndex].sy;
    }
    draw(){
    c.drawImage(sprite,this.sx,this.bird,this.w,this.h,this.x,this.y,this.w,this.h);
    }
    flap(){

    }
    update(){
    
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
    
}
function game(){
    update();
    draw();
    frame+=1;
    requestAnimationFrame(game);
    

}

game();