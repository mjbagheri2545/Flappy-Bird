let can = document.querySelector('canvas');
let c = can.getContext('2d');
let container = document.querySelector('.container');
let srcStyle = document.getElementById('style');
let bgImg = document.getElementById('background');

let sprite = new Image();
sprite.src = './image/sprite.png';
let frame = 0;
let deg = Math.PI/180;
let scoreValue ;
let localStorageKey ;

let musics = [
    './audio/die.wav',
    './audio/flap.wav',
    './audio/hit.wav',
    './audio/score.wav',
    './audio/start.wav',
];
let DIE = new Audio(musics[0]);
let FLAP = new Audio(musics[1]);
let HIT = new Audio(musics[2]);
let SCORE = new Audio(musics[3]);
let START = new Audio(musics[4]);

let state = {
    currentState : 0,
    getready : 0,
    mode : 1,
    gaming : 2,
    gameover : 3
}

let modes = [
    {
        text : 'Easy',
        class : 'div',
        top : '230px',
        k : 6,
        scoreBestIndex : 0,
        localStorageName : 'bestEasy',
        recordImgIndex : 0
    },
    {
        text : 'Medium',
        class : 'div',
        top : '280px',
        k : 5,
        scoreBestIndex : 1,
        localStorageName : 'bestMedium',
        recordImgIndex : 1
    },
    {
        text : 'Hard',
        class : 'div',
        top : '330px',
        k : 4,
        scoreBestIndex : 2,
        localStorageName : 'bestHard',
        recordImgIndex : 2
    }
]


function changeMode(){
    change(modes[0]);
    change(modes[1]);
    change(modes[2]);
}
function change(data){
    let myMode = document.createElement('div');
    myMode.className = data.class ;
    myMode.style.top = data.top;
    myMode.innerText = data.text;
    container.appendChild(myMode);
    myMode.addEventListener('click',()=>{
        pipes.gap = 20 * data.k;
        pipes.pipesDistance = 20 * data.k;
        bird.r = 6.5 / data.k;
        score.bestIndex = data.scoreBestIndex ;
        localStorageKey = data.localStorageName;
        newrecord.ImgIndex = data.recordImgIndex;
    document.querySelectorAll('.div').forEach((e)=>{
        e.remove();
     })
    })
}


container.addEventListener('click',(e)=>{
    switch (state.currentState) {
        case state.getready:
            scoreValue = 0;
            state.currentState = state.mode;
            changeMode();
            break;
        case state.mode:
            if(e.target.className == 'div'){
            state.currentState = state.gaming;
            START.play();
            }
            break;
        case state.gaming:
            bird.flap();
            FLAP.play();
            break;
        default:
            bird.speed = 0;
            bird.rotation = 0;
            pipes.position= [];
            score.value = 0;
            state.currentState = state.getready;
            break;
    }
});
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
        this.gap,
        this.pipesDistance
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
        if(frame % this.pipesDistance == 0){
            this.position.push({
                x : can.width ,
                y : this.maxY * (Math.random() + 1)})
            }

            for(let i = 0; i < this.position.length;i++){
                let pos = this.position[i];
                pos.x -= this.dx;
                if(this.position[i].x + this.w <= 0){
                    this.position.shift();
                    score.value+=1;
                    SCORE.play();
                    scoreValue = score.value;
                    score.best[score.bestIndex] = Math.max(score.value,score.best[score.bestIndex]);
                    localStorage.setItem(localStorageKey,score.best[score.bestIndex]);
                }
                let bottomPosY = pos.y + this.h + this.gap;
                if(bird.x + 12 > pos.x && bird.x - 12 < pos.x + this.w && bird.y - 12 < pos.y + this.h
                    && bird.y + 12 > pos.y ){
                    HIT.play();
                    state.currentState = state.gameover;
                }
                if(bird.x + 12 > pos.x && bird.x - 12 < pos.x + this.w && bird.y - 12 > bottomPosY
                    && bird.y + 12 < bottomPosY + this.h ){
                    HIT.play();
                    state.currentState = state.gameover;
                }


            }
        
        }
        
}

let pipes = new Pipes();
class Score{
    constructor(){
        this.value = 0;
        this.best = [
            (localStorage.getItem('bestEasy') || 0),
            (localStorage.getItem('bestMedium') || 0),
            (localStorage.getItem('bestHard') || 0)
        ];
        this.bestIndex = 1;
    }
    draw(){
        
        if(state.currentState == state.gaming){
            c.fillStyle = '#ecf0f1';
            c.font = '30px ARIAL';
            c.fillText(this.value,can.width/2,40);
        }else if(state.currentState == state.gameover){
            c.fillStyle = '#ecf0f1';
            c.font = '27px ARIAL';
            c.fillText(this.value,223,198);
            c.fillText(this.best[this.bestIndex],227,240);
        }
    }
}


let score = new Score();
class NewRecord{
    constructor(){
        this.positionImg =[
            {
                sx : 359,
                sy : 158
            },
            {
                sx : 358,
                sy : 112
            },
            {
                sx : 311,
                sy : 158
            }
        ];
        this.w = 46 ;
        this.h = 45
        this.x = 72 ;
        this.y = 187;
        this.ImgIndex ;
    }
    draw(){
        if(state.currentState == state.gameover){
        if(scoreValue >= score.best[score.bestIndex]){
            c.drawImage(sprite,this.positionImg[this.ImgIndex].sx,this.positionImg[this.ImgIndex].sy,this.w,this.h,this.x,this.y,this.w,this.h);
            c.lineWidth = 5;
            c.fillStyle = '#f39c12';
            c.strokeStyle = '#d35400';
            c.strokeRect(57,13,210,80);
            c.fillRect(57,13,210,80);
            c.beginPath();
            c.fillStyle = '#c0392b';
            c.font = '40px Gubblebum';
            c.fillText('New Record',62,48);
            c.fillText('Obtained!!',77,88);
        }
    }
    }
}

let newrecord = new NewRecord();

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
        this.r
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
    }else if(state.currentState == state.gaming || state.currentState == state.gameover){
        this.speed +=this.g;
        this.y +=this.speed;
    }
    if(this.y + this.h/2 >= can.height - fg.h){
        state.currentState = state.gameover;
        DIE.play();
        this.y = can.height - fg.h - this.h/2;
        this.currentIndex = 1;
    }
    if(state.currentState == state.getready || state.currentState == state.gameover || state.currentState == state.mode){
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

class Mode{
    constructor(){

    }
    draw(){
    if(state.currentState == state.mode){
        c.lineWidth = 5;
        c.fillStyle = '#f39c12';
        c.strokeStyle = '#d35400';
        c.fillRect(can.width/2 - 100,can.height/2 - 80 ,200,50)
        c.strokeRect(can.width/2 - 100,can.height/2 - 80 ,200,50)
        c.beginPath();
        c.fillStyle = '#c0392b';
        c.font = '37px Gubblebum';
        c.fillText('Select Mode',can.width/2 - 93,can.height/2 - 43)
    }
    }

}

let mode = new Mode();
class GameOver{
    constructor(){
        this.sx = 175,
        this.sy = 228,
        this.w = 225,
        this.h = 162,
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
    pipes.draw();
    fg.draw();
    mode.draw()
    getready.draw();
    gameover.draw();
    bird.draw();
    score.draw();
    newrecord.draw();
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