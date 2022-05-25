let can = document.querySelector('canvas');
let c = can.getContext('2d');

let sprite = new Image();
sprite.src = './image/sprite.png';
let frame = 0;

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
        this.x = 50,
        this.y = 215,
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

class Start{
    constructor(){
        this.sx = 0,
        this.sy = 227,
        this.w = 175,
        this.h = 160,
        this.x = can.width/2 - 175/2,
        this.y = can.height/2 - 80
    }
    draw(){
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}

let start = new Start();

class GameOver{
    constructor(){
        this.sx = 174,
        this.sy = 227,
        this.w = 225,
        this.h = 200,
        this.x = can.width/2 - 225/2,
        this.y = can.height/2 - 100
    }
    draw(){
    c.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}

let gameOver = new GameOver();

function draw(){
    c.fillStyle = '#00cec9';
    c.fillRect(0,0,can.width,can.height);
    bg.draw();
    fg.draw();
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