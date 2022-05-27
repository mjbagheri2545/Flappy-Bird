let can = document.querySelector('canvas');
let c = can.getContext('2d');

let sprite = new Image();
sprite.src = './image/sprite.png';
let frame = 0;
let deg = Math.PI/180

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
            bird.rotation = 0;
            pipes.position= [];
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
        this.y = can.height - 112,
        this.dx = 2
    }
    draw(){
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w,this.y,this.w,this.h);
    }
    update(){
        if(state.currentState == state.gaming){
            this.x = (this.x - this.dx)%(this.w/2) ;
        }
    }
}

let fg = new Fg();

class Pipes{
    constructor(){
        this.top = {
            sx : 553 ,
            sy : 0
        }
        this.bottom = {
            sx : 502 ,
            sy : 0
        }
        this.maxY = -150,
        this.w = 53,
        this.h = 400,
        this.position = [],
        this.dx = 2,
        this.gap = 80
    }
    draw(){
        for(let i = 0; i < this.position.length;i++){
          let pos = this.position[i];
          let topY = pos.y;
          let bottomY = pos.y + this.h + this.gap;
          if(bottomY + this.h >=fg.h) {
             ;
        }
          c.drawImage(sprite,this.top.sx,this.top.sy,this.w,this.h,pos.x,topY,this.w,this.h);
          c.drawImage(sprite,this.bottom.sx,this.bottom.sy,this.w,this.h,pos.x,bottomY,this.w,this.h);
        }
    }
    update(){
        if(state.currentState != state.gaming) return;
        if(frame %100 == 0){
            this.position.push({
                x : can.width ,
                y : this.maxY * (Math.random() + 1)})
            }

            for(let i = 0; i < this.position.length;i++){
                this.position[i].x -= this.dx;
                if(this.position[i].x + this.w <= 0){
                    this.position.shift();
                }
            }
        
        }
        
}


let pipes = new Pipes();

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
        this.speed = 0,
        this.rotation = 0,
        this.r = 1.3
    }
    draw(){
    let bird = this.animation[this.currentIndex];
    c.save();
    c.translate(this.x,this.y)
    c.rotate(this.rotation);
    c.drawImage(sprite,bird.sx,bird.sy,this.w,this.h, - this.w/2,-this.h/2,this.w,this.h);
    c.restore();
    }
    flap(){
    this.speed = -4.6;
    this.rotation = - 25 * deg;
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
        this.currentIndex = 1;
    }
    if(state.currentState == state.getready || state.currentState == state.gameover){
        this.rotation = this.rotation;
    }else{
        if(this.rotation >= 85 * deg){
            this.rotation = 85 * deg;
        }else{
            this.rotation = this.rotation + this.r * deg;
        }
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
    pipes.draw();
    getready.draw();
    gameover.draw();
    bird.draw();
}
function update(){
    bird.update();
    fg.update();
    pipes.update();
}
function game(){
    update();
    draw();
    frame++;
    requestAnimationFrame(game);
    
}

game();