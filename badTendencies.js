
/*==========================================================================
Global Game Settings
===========================================================================*/

const gameStatus='Splash Screen';
const BANDMEMBER_DEFAULT_STATE="wander";
const PLAYER_DEFAULT_STATE="chase";
const ANIMATION_FRAME_DELAY=100; // milliseconds
let mainGameLoopIntervalID;
let currentGameLevel="";
let currentLevel=1;

// Keyboard key press data structure
const KEY_PRESSED_CYCLE=100; // milliseconds 
const pressedKeySet = new Set();
const currentKeysPressed={
    pressedKeys: pressedKeySet,
    setCreated: 0,
};


let player1 = {};
let player2 = {};
let bandMember1 = {};
let bandMember2 = {};
let bandMember3 = {};
let bandMember4 = {};

// Grab and cache fixed DOM elements

const body = document.querySelector('body');
const gameContainer = document.querySelector('#game-container');
const gameDom = [] ; // Use an array to cache and reference commonly accessed DOM elements

/*==========================================================================
Band Member Characters
===========================================================================*/

const bandMemberCharacters=[
    {
        "name" : 'AXL',
        "id" : "bandchar1",
        "health" : 100,
        "party" : 0,
        "speed" : 5,
        "image" : {
            "thumbnail" : '/assets/bandmember_262_128.png',
            "src": '/assets/bandmember_262_64x64.png',
            "Walk Left": [0, 9, 0],  // Sprite Row, Total Frames, Current Frame
            "Walk Right": [1, 9, 0],  
            "Walk Down": [0, 9, 0],
            "Walk Up": [1, 9, 0],  
            "Idle Left": [2, 3, 0 ],  
            "Idle Right": [3, 3, 0 ],  
            "Die": [4, 9, 0],  
            "Dizzy": [5, 2, 0], 
            "Hurt": [6, 2, 0],  
            "Throwing Left": [7, 7, 0], 
            "Throwing Right": [8, 7, 0],
            "Shoot Left": [9, 3, 0], 
            "Shoot Right": [10, 3, 0],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Thor',
        "id" : "bandchar2",
        "health" : 100,
        "party" : 0,
        "speed" : 5,
        "image" : {
            "thumbnail" : '/assets/bandmember_236_128.png',
            "src": '/assets/bandmember_236_64x64.png',
            "Walk Left": [0, 7, 0],  // Sprite Row, Total Frames, Current Frame
            "Walk Right": [1, 7, 0],  
            "Walk Down": [0, 7, 0],
            "Walk Up": [1, 7, 0],  
            "Idle Left": [2, 3, 0 ],  
            "Idle Right": [3, 3, 0 ],  
            "Die": [4, 9, 0],  
            "Dizzy": [5, 2, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 7, 0], 
            "Throwing Right": [8, 7, 0],
            "Shoot Left": [9, 3, 0], 
            "Shoot Right": [10, 3, 0],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Vince',
        "id" : "bandchar3",
        "health" : 100,
        "party" : 0,
        "speed" : 5,
        "image" : {
            "thumbnail" : '/assets/bandmember_011_128.png',
            "src": '/assets/bandmember_011_64x64.png',
            "Walk Left": [0, 9, 0],  // Sprite Row, Total Frames, Current Frame
            "Walk Right": [1, 9, 0],  
            "Walk Down": [0, 9, 0],
            "Walk Up": [1, 9, 0],  
            "Idle Left": [2, 3, 0 ],  
            "Idle Right": [3, 3, 0 ],  
            "Die": [4, 11, 0],  
            "Dizzy": [5, 3, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 4, 0], 
            "Throwing Right": [8, 4, 0],
            "Shoot Left": [9, 4, 0], 
            "Shoot Right": [10, 4, 0],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Johnny Fear',
        "id" : "bandchar4",
        "health" : 100,
        "party" : 0,
        "speed" : 5,
        "image" : {
            "thumbnail" : '/assets/bandmember_003_128.png',
            "src": '/assets/bandmember_003_64x64.png',
            "Walk Left": [0, 9, 0],  // Sprite Row, Total Frames, Current Frame
            "Walk Right": [1, 9, 0],  
            "Walk Down": [0, 9, 0],
            "Walk Up": [1, 9, 0],  
            "Idle Left": [2, 3, 0 ],  
            "Idle Right": [3, 3, 0 ],  
            "Die": [4, 11, 0],  
            "Dizzy": [5, 3, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 6, 0], 
            "Throwing Right": [8, 6, 0],
            "Shoot Left": [9, 4, 0], 
            "Shoot Right": [10, 4, 0],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
];

const playerCharacters =[
    {
        "name" : 'Player 1',
        "id" : "player1",
        "health" : 100,
        "speed" : 5,
        "image" : {
                    "thumbnail" : '/assets/player_001_128.png',
                    "src": '/assets/player_001_64x64.png',
                    "Walk Left": [0, 9, 0],  // Sprite Row, Total Frames, Current Frame
                    "Walk Right": [1, 9, 0],  
                    "Walk Down": [0, 9, 0],
                    "Walk Up": [1, 9, 0],  
                    "Idle Right": [2, 1, 0],
                    "Idle Left": [3, 1, 0],  
                    "Die": [4, 11, 0],  
                    "Dizzy": [5, 3, 0], 
                    "Hurt": [6, 3, 0],  
                    "Throwing Right": [7, 5, 0], 
                    "Throwing Left": [8, 5, 0],
                    "imageState" : "Idle Right",
                    "lastUpdate" : 0,
        },
    },
];



/*==========================================================================
Game Level Definitions
===========================================================================*/

// const playFieldAssets = {
//     "W" : `url('/assets/wall_6.png') 0px 0px`,
//     " " : `url('/assets/floor_3.png') 0px 0px`,
//     "S" : `url('/assets/exit_4.png') 0px 0px`,
// }

const playFieldAssets = {
    "W" : `playfield-wall`,
    " " : `playfield-floor`,
    "S" : `playfield-exit`,
}

const gameLevel1 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W',' ','W'],
    ['W',' ',' ','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ','W','W','W','W','W','W','W',' ','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W'],
    ['W',' ',' ','W','W','W',' ',' ',' ','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ','W','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ','W',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ','W',' ','W',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W',' ','W',' ',' ',' ','W','W','W','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','S','S',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','S','S',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];

/*==========================================================================
Classes
===========================================================================*/

// BandMember Class

class BandMember {
    constructor (bandMemberCharacter, positionX, positionY) {
        this._name=bandMemberCharacter.name;
        this._id=bandMemberCharacter.id;
        this._health=bandMemberCharacter.health;
        this._party=bandMemberCharacter.party;
        this._speed=bandMemberCharacter.speed;
        this._direction='';
        this._posX=positionX;
        this._posY=positionY;
        this._state=BANDMEMBER_DEFAULT_STATE;
        this._image=Object.assign({}, bandMemberCharacter.image);

        this._imageDiv=document.createElement("div");
        this._imageDiv.setAttribute('class', 'bandmember-div');
        this._imageDiv.setAttribute('id', this._id);
        this._imageDiv.style.position="absolute";
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
        this._imagePtag=document.createElement("p");
        this._imagePtag.setAttribute('class', "bandmember-ptag");
        this._imagePtag.setAttribute('id', this._id + '-ptag');
        this._imagePtag.style.width="64px";
        this._imagePtag.style.height="64px";
        this._imagePtag.style.background=`url('${this._image.src}') 0px 0px`
        this._imageDiv.appendChild(this._imagePtag);
        gameDom["gameContainerPlayfield"].appendChild(this._imageDiv);        
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get party() { return this._party; }
    set party(setParty) { this._party=setParty; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }
    
    get direction() { return this._direction; }
    set direction(setDirection) { this._direction=setDirection; }

    get posX() { return this._posX; }
    set posX(setPosX) { 
        this._posX=setPosX; 
        this._imageDiv.style.left=this._posX+"px";
    }
        
    get posY() { return this._posY; }
    set posY(setPosY) { 
        this._posY=setPosY; 
        this._imageDiv.style.top=this._posY+"px";
    }

    get posXY() { return [this._posX, this.posY];}
    set posXY([setPosX, setPosY]) { 
        this._posX=setPosX; this._posY=setPosY; 
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
    }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
        if (this._image["imageState"]!==setImageState) {
            this._image["imageState"]=setImageState; 
            this._image[setImageState][2]=0;
        }
    } 

    incrementImageAnimation() {
        const row=this._image[this._image["imageState"]][0];
        const maxCol=this._image[this._image["imageState"]][1];
        let curCol=this._image[this._image["imageState"]][2];
        const lastUpdate=this._image.lastUpdate;
        const currentTime=Date.now();
        let newPosX=0;
        let newPosY=0;

        if ( (currentTime-lastUpdate) > ANIMATION_FRAME_DELAY ) {
            this._image.lastUpdate=currentTime;

            if (curCol===maxCol) curCol=0;
            else curCol=curCol+1;

            this._image[this._image["imageState"]][2]=curCol;

            newPosX=(curCol*-64);
            newPosY=(row*-64);

            this._imagePtag.style.backgroundPosition=`${newPosX}px ${newPosY}px`;
        }
    }

}

// Player Class

class Player {
    constructor (playerCharacter, setName, positionX, positionY) {
        this._name=setName;
        this._id=playerCharacter.id;
        this._health=playerCharacter.health;
        this._party=playerCharacter.party;
        this._speed=playerCharacter.speed;
        this._direction="";
        this._posX=positionX;
        this._posY=positionY;
        this._state=PLAYER_DEFAULT_STATE;
        this._image=Object.assign({}, playerCharacter.image);

        this._imageDiv=document.createElement("div");
        this._imageDiv.setAttribute('class', 'player-div');
        this._imageDiv.setAttribute('id', this._id);
        this._imageDiv.style.position="absolute";
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
        this._imagePtag=document.createElement("p");
        this._imagePtag.setAttribute('class', "player-ptag");
        this._imagePtag.setAttribute('id', this._id + '-ptag');
        this._imagePtag.style.width="64px";
        this._imagePtag.style.height="64px";
        this._imagePtag.style.background=`url('${this._image.src}') 0px 0px`
        this._imageDiv.appendChild(this._imagePtag);
        gameDom["gameContainerPlayfield"].appendChild(this._imageDiv);
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }

    get direction() { return this._direction; }
    set direction(setDirection) { this._direction=setDirection; }

    get posX() { return this._posX; }
    set posX(setPosX) { 
        this._posX=setPosX; 
        this._imageDiv.style.left=this._posX+"px";
    }

    get posY() { return this._posY; }
    set posY(setPosY) { 
        this._posY=setPosY; 
        this._imageDiv.style.top=this._posY+"px";
    }

    get posXY() { return [this._posX, this.posY];}
    set posXY([setPosX, setPosY]) { 
        this._posX=setPosX; this._posY=setPosY; 
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
    }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
            if (this._image["imageState"]!==setImageState) {
                this._image["imageState"]=setImageState; 
                this._image[setImageState][2]=0;
            }
    }

    incrementImageAnimation() {
        const row=this._image[this._image["imageState"]][0];
        const maxCol=this._image[this._image["imageState"]][1];
        let curCol=this._image[this._image["imageState"]][2];
        const lastUpdate=this._image.lastUpdate;
        const currentTime=Date.now();
        let newPosX=0;
        let newPosY=0;

        if ( (currentTime-lastUpdate) > ANIMATION_FRAME_DELAY ) {
            this._image.lastUpdate=currentTime;

            if (curCol===maxCol) curCol=0;
            else curCol=curCol+1;

            this._image[this._image["imageState"]][2]=curCol;

            newPosX=(curCol*-64);
            newPosY=(row*-64);

            this._imagePtag.style.backgroundPosition=`${newPosX}px ${newPosY}px`;
        }
    }
}

/*----------------------------------
// Game Display List
------------------------------------*/

class DisplayList {

    constructor() {
        this._displayObjects = new Set();
    }

    get displayObjects() { return this._displayObjects; }

    add(obj) { this._displayObjects.add(obj); }

    delete(obj) { this._displayObjects.delete(obj); }

    clear() { this._displayObjects.clear(); }

}


/*==========================================================================
Utility Functions
===========================================================================*/

const debug = {
    "console" : {
            "log" : (pthis, str) => {
                    console.log(pthis, str);
            }
    }
}


/*==========================================================================
Display Functions
===========================================================================*/


// Display a modal dialog box

function displayModalDialog(style, target, width, height, htmlMessage) {

    const underModal = document.createElement("div");
    underModal.setAttribute('class', 'under-modal');
    body.appendChild(underModal);

    const modalWindow = document.createElement("div");
    modalWindow.setAttribute('class', 'modal-window');

    if (width!==0)  modalWindow.style.width=width;
    if (height!==0) modalWindow.style.height=height;
    
    modalWindow.innerHTML = `<div class="close-modal"><img src="/assets/skull_04.png"></div>`;
    modalWindow.innerHTML = modalWindow.innerHTML + htmlMessage;
    underModal.appendChild(modalWindow);

    const closeWindow = document.querySelector('.close-modal');
    closeWindow.addEventListener('click', (event) => {
            console.log(event.target);
            body.removeChild(underModal);
        }
    );
}

/*======================================
// Display the Game Board
=======================================*/

function displayGameBoard(level) {

    const gamePlayfield = document.createElement('div');
    gamePlayfield.setAttribute('id', 'game-playfield');
    gameDom["gameContainerPlayfield"].appendChild(gamePlayfield);

    for (let i=0; i<level.length; i++) {
        for (let j=0; j<level[i].length; j++) {
            const gameSquare = document.createElement('div');
            gameSquare.setAttribute('class', "game-square");            
            gameSquare.setAttribute('data-gsy', (i).toString());
            gameSquare.setAttribute('data-gsx', (j).toString());
            gameSquare.setAttribute('data-gst', level[i][j]);

            // const pTag = document.createElement('p');
            gameSquare.classList.add(playFieldAssets[level[i][j]]);
            
            if (level[i][j]==='S') {
                // gameSquare.innerHTML=`<p style="background-color:#cccccc">S</p>`;
            }

            // gameSquare.appendChild(pTag);    
            gamePlayfield.appendChild(gameSquare);            
        }
    }    
}

/*==========================================================================
Keyboard Detection
===========================================================================*/

function handleKeyboardEvents(event) {

const currentTime=Date.now();

if (!event) {
    document.addEventListener('keydown', handleKeyboardEvents);
    return;
}

if (event.type==="keydown") {
    currentKeysPressed.pressedKeys.add(event.key);

    if ( (event.key==="ArrowLeft") || (event.key==="ArrowRight") || 
         (event.key==="ArrowUp") || (event.key==="ArrowDown") ) {
            event.preventDefault();
         }          
}

// console.log(event);
// console.log(event.key);
// console.log(currentKeysPressed.pressedKeys);

return;

}

/*==========================================================================
Motion
===========================================================================*/

function movePlayer1() {


    const currentPosX = player1.posX;
    const currentPosY = player1.posY;
    const stepwiseCollisionXY = [];
    let newPosX = currentPosX;
    let newPosY = currentPosY;

    if (player1.direction==='N') newPosY = player1.posY - player1.speed;
    if (player1.direction==='S') newPosY = player1.posY + player1.speed;
    if (player1.direction==='W') newPosX = player1.posX - player1.speed;
    if (player1.direction==='E') newPosX = player1.posX + player1.speed;
    
    stepwiseCollisionXY[0]=currentPosX;
    stepwiseCollisionXY[1]=currentPosY;
    const willCollide=checkCollisions(currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    if (player1.direction==='N') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='S') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='W') player1.posX = stepwiseCollisionXY[0];
    if (player1.direction==='E') player1.posX = stepwiseCollisionXY[0];

}


/*==========================================================================
Collision Detection
===========================================================================*/

function checkCollisions(currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY) {

    // console.log("Here:00000");
    let stepwiseX=0;
    let stepwiseY=0;

    let collisionResults={
            "collision": false,
            "collisionType": "",
            "isAllowed": true,
    };

    if (currentPosX-newPosX!==0) {
        if (currentPosX<newPosX) {
            let stepwiseX=currentPosX;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            while ( collisionResults.isAllowed && (stepwiseX<newPosX) )  {
                stepwiseX++;
                checkPlayfieldCollisions(stepwiseX+16, currentPosY+8, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseX--;
            }
            stepwiseCollisionXY[0]=stepwiseX;
            stepwiseCollisionXY[1]=newPosY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            if (collisionResults.isAllowed) return false;
            else return true;
        }
        else {
            let stepwiseX=currentPosX;
            while ( collisionResults.isAllowed && (stepwiseX>newPosX) ) {
                stepwiseX--;
                checkPlayfieldCollisions(stepwiseX+16, currentPosY+8, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseX++;
            }
            stepwiseCollisionXY[0]=stepwiseX;
            stepwiseCollisionXY[1]=newPosY;
            if (collisionResults.isAllowed) return false;
            else return true;
        }
    }
    else if (currentPosY-newPosY!==0) {
        if (currentPosY<newPosY) {
            let stepwiseY=currentPosY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            while ( collisionResults.isAllowed && (stepwiseY<newPosY) )  {
                stepwiseY++;
                checkPlayfieldCollisions(currentPosX+16, stepwiseY+8, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseY--;
            }
            stepwiseCollisionXY[0]=newPosX;
            stepwiseCollisionXY[1]=stepwiseY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            if (collisionResults.isAllowed) return false;
            else return true;
        }
        else {
            let stepwiseY=currentPosY;
            while ( collisionResults.isAllowed && (stepwiseY>newPosY) ) {
                stepwiseY--;
                checkPlayfieldCollisions(currentPosX+16, stepwiseY+8, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseY++;
            }
            stepwiseCollisionXY[0]=newPosX;
            stepwiseCollisionXY[1]=stepwiseY;
            if (collisionResults.isAllowed) return false;
            else return true;
        }



    }
    else {
        stepwiseCollisionXY[0, 1]=[newPosX, newPosY];
        return false;
    }

}

/*==================================
// Check Play Field Collisions
====================================*/

function checkPlayfieldCollisions(posX, posY, width, height, collisionResults) {

    collisionResults.collision=false;
    collisionResults.collisionType="";
    collisionResults.isAllowed=true;

    let gameGridStartRow=Math.floor(posY/32)-2; 
    if (gameGridStartRow<0) gameGridStartRow=0;

    let gameGridEndRow=Math.floor(posY/32)+2;
    if (gameGridEndRow>31) gameGridEndRow=31;

    gameGridStartColumn = Math.floor(posX/32)-2;
    if (gameGridStartColumn<0) gameGridStartColumn=0;

    gameGridEndColumn = Math.floor(posX/32)+2;
    if (gameGridEndColumn>31) gameGridEndColumn=31;

    // console.log(`${gameGridStartColumn} ${gameGridEndColumn} ${gameGridStartRow} ${gameGridEndRow} `);

    for (let row=gameGridStartRow; row<=gameGridEndRow; row++) {
        for (let col=gameGridStartColumn; col<=gameGridEndColumn; col++) {

            const gridSquare = document.querySelector(`div[data-gsx='${col}'][data-gsy='${row}']`)
            
            // console.log(`${col} ${row} ${gridSquare}`);
            // gridSquare.style.borderTop="1px solid #ff0000";
            gridPosX=col*32;
            gridPosY=row*32;
            gridWidth=32;
            gridHeight=32;
            
            if (posX < (gridPosX + gridWidth)  && (posX + width) > gridPosX &&
                posY < (gridPosY + gridHeight) && (posY + height) > gridPosY) {
                    if (gridSquare.classList.contains('playfield-wall')) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    collisionResults.collision=true;
                    collisionResults.collisionType="Wall";
                    collisionResults.isAllowed=false;
                    return;
                }

            }
        }
    }
}



/*==========================================================================
Start Bad Tendencies Game and Initialize a New Game
===========================================================================*/

const promptGameStartId = setTimeout(promptGameStart, 1000);

// Prompt Player for Game Start

function promptGameStart() {
    const divSplash = document.querySelector('#outerSplash');

    //gameContainer.removeChild(divSplash);

    const htmlMessage = `<div class="game-instructions">
        <h3>Game Instructions</h3>
           
        <p>You are the band member for the rock band <nobr><em><u>Bad Tendencies</u></em></nobr>.
        Your job is to get the band members on stage and to keep them out of 
        trouble.  If you get close to a band member they will follow you to
        the stage, unless they are distracted or under the influence.  You 
        can collect money as you move along, otherwise the band members
        will grab it and likely waste it to support their Rock-n-Roll 
        lifestyle.  Use the keyboard arrow keys to move around.
        <em>Good Luck!!!</em>.</p>

        <form>
        <label for="playerName">Player's Name</labeL>
        <input type="text" class="nameInput" name="player1" value="" placeholder="Enter Your Name">

        <button id="startGameButton">Start New Game</button>
        </form>
    </div>
    `;

    displayModalDialog("", body, "500px", "", htmlMessage);

    const starGameButton = document.querySelector('#startGameButton');
    startGameButton.addEventListener('click', startNewGame)

}

/*==========================
    Start New Game
===========================*/

function startNewGame(event) {
    event.preventDefault();
    const underModal = document.querySelector("div.under-modal");
    body.removeChild(underModal);

    const divSplash = document.querySelector('#outerSplash');
    gameContainer.removeChild(divSplash);

    gameContainer.style.display="grid";
    gameContainer.style.gridTemplateColumns="128px 1fr 1fr";
    gameContainer.style.gridTemplateRows="100px 75px 1fr";
    gameContainer.style.padding="0";
    gameContainer.style.margin="auto auto";
    gameDom["gameContainer"]=gameContainer;

    const gameContainerHeader=document.createElement('div');
    gameContainerHeader.setAttribute('class', 'game-container-header');
    gameContainerHeader.style.gridColumn="1 / span 3";
    gameContainerHeader.style.gridRow="1 / span 1";
    gameDom["gameContainerHeader"]=gameContainerHeader;
    gameContainer.appendChild(gameContainerHeader);

    // Setup Game Header    
    gameContainerHeader.innerHTML = `
        <h1>Bad Tendencies</h1>
        <div class="header-buttons">
            <div><button id="headerStartGameButton">New Game</button></div>
            <div><button id="headerQuitGameButton">Quit GAME</button></div>
        </div>
    `;
    const headerStartGameButton=gameContainerHeader.querySelector('#headerStartGameButton');
    headerStartGameButton.addEventListener('click', startNewGame);

    const headerQuitGameButton=gameContainerHeader.querySelector('#headerQuitGameButton');
    headerQuitGameButton.addEventListener('click', gameOver);

    const gameContainerScoreboard=document.createElement('div');
    gameContainerScoreboard.setAttribute('class', 'game-container-scoreboard');
    gameContainerScoreboard.style.gridColumn="2 / span 2";
    gameContainerScoreboard.style.gridRow="2 / span 1";
    gameDom["gameContainerScoreboard"]=gameContainerScoreboard;
    gameContainer.appendChild(gameContainerScoreboard);

    const gameContainerCharacters=document.createElement('div');
    gameContainerCharacters.setAttribute('class', 'game-container-characters');
    gameContainerCharacters.style.gridColumn="1 / span 1";
    gameContainerCharacters.style.gridRow="2 / span 2";
    gameContainerCharacters.style.display="flex";
    gameContainerCharacters.style.flexDirection="column";
    gameContainerCharacters.style.justifyContent="start";
    gameContainerCharacters.style.alignItems="center";           
    gameDom["gameContainerCharacters"]=gameContainerCharacters;
    gameContainer.appendChild(gameContainerCharacters);

    const gameContainerBandMember1=document.createElement('div');
    gameContainerBandMember1.setAttribute('class', 'game-container-bandmember1');
    gameDom["gameContainerBandMember1"]=gameContainerBandMember1;
    gameContainerCharacters.appendChild(gameContainerBandMember1);
    
    const gameContainerBandMember2=document.createElement('div');
    gameContainerBandMember2.setAttribute('class', 'game-container-bandmember2');
    gameDom["gameContainerBandMember2"]=gameContainerBandMember2;
    gameContainerCharacters.appendChild(gameContainerBandMember2);
    
    const gameContainerBandMember3=document.createElement('div');
    gameContainerBandMember3.setAttribute('class', 'game-container-bandmember3');
    gameDom["gameContainerBandMember3"]=gameContainerBandMember3;
    gameContainerCharacters.appendChild(gameContainerBandMember3);
    
    const gameContainerBandMember4=document.createElement('div');
    gameContainerBandMember4.setAttribute('class', 'game-container-bandmember4');
    gameDom["gameContainerBandMember4"]=gameContainerBandMember4;
    gameContainerCharacters.appendChild(gameContainerBandMember4);
    
    const gameContainerPlayer1=document.createElement('div');
    gameContainerPlayer1.setAttribute('class', 'game-container-player1');
    gameDom["gameContainerPlayer1"]=gameContainerPlayer1;
    gameContainerCharacters.appendChild(gameContainerPlayer1);
    
    const gameContainerPlayfield=document.createElement('div');
    gameContainerPlayfield.setAttribute('class', 'game-container-playfield');
    gameContainerPlayfield.style.gridColumn="2 / span 2";
    gameContainerPlayfield.style.gridRow="3 / span 1";
    gameContainerPlayfield.style.position="relative";
    gameDom["gameContainerPlayfield"]=gameContainerPlayfield;
    gameContainer.appendChild(gameContainerPlayfield);

    if (currentLevel===1) currentGameLevel=gameLevel1;
    displayGameBoard(currentGameLevel);
    player1 = new Player(playerCharacters[0], "Harry", 250, 250);
    bandMember1 = new BandMember(bandMemberCharacters[0], 250, 250);
    bandMember2 = new BandMember(bandMemberCharacters[1], 350, 350);
    bandMember3 = new BandMember(bandMemberCharacters[2], 450, 450);
    bandMember4 = new BandMember(bandMemberCharacters[3], 550, 550);

    displayCharacterStatus("initialize");

    handleKeyboardEvents("");

    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);
}


/*======================================
    Display Character Status
=======================================*/

function displayCharacterStatus(action) {

    if (action==="initialize") {

        gameDom["gameContainerBandMember1"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${bandMember1.image.thumbnail}" alt="Band Member 1" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="/assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="/assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember1.name}</p>                
            </div>`;

        gameDom["gameContainerBandMember2"].innerHTML = `    
            <div class="bt-character-outer">
                <img src="${bandMember2.image.thumbnail}" alt="Band Member 2" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="/assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="/assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember2.name}</p>
            </div>`;

        gameDom["gameContainerBandMember3"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${bandMember3.image.thumbnail}" alt="Band Member 3" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="/assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="/assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember3.name}</p>
            </div>`;

        gameDom["gameContainerBandMember4"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${bandMember4.image.thumbnail}" alt="Band Member 4" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="/assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="/assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember4.name}</p>
            </div>`;

        gameDom["gameContainerPlayer1"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${player1.image.thumbnail}" alt="Player 1" class="bt-character">
                <div class="bt-character-status-health">
                    <img src="/assets/greenbar.png" class="health-bar">
                </div>
                <p class="bt-character">${player1.name}</p>
            </div>`;
    }

    if (action==="update") {
        const player1HealthBar = gameDom["gameContainerPlayer1"].querySelector('img.health-bar');

        const bandMember1HealthBar = gameDom["gameContainerBandMember1"].querySelector('img.health-bar');
        const bandMember1PartyBar = gameDom["gameContainerBandMember1"].querySelector('img.party-bar');
        
        const bandMember2HealthBar = gameDom["gameContainerBandMember2"].querySelector('img.health-bar');
        const bandMember2PartyBar = gameDom["gameContainerBandMember2"].querySelector('img.party-bar');

        const bandMember3HealthBar = gameDom["gameContainerBandMember3"].querySelector('img.health-bar');
        const bandMember3PartyBar = gameDom["gameContainerBandMember3"].querySelector('img.party-bar');

        const bandMember4HealthBar = gameDom["gameContainerBandMember4"].querySelector('img.health-bar');
        const bandMember4PartyBar = gameDom["gameContainerBandMember4"].querySelector('img.party-bar');

        player1HealthBar.style.width = ((player1.health/100)*120).toString()+"px";

        bandMember1HealthBar.style.width = ((bandMember1.health/100)*120+1).toString()+"px";
        bandMember1PartyBar.style.width = ((bandMember1.party/100)*120+1).toString()+"px";

        bandMember2HealthBar.style.width = ((bandMember2.health/100)*120+1).toString()+"px";
        bandMember2PartyBar.style.width = ((bandMember2.party/100)*120+1).toString()+"px";

        bandMember3HealthBar.style.width = ((bandMember3.health/100)*120+1).toString()+"px";
        bandMember3PartyBar.style.width = ((bandMember3.party/100)*120+1).toString()+"px";

        bandMember4HealthBar.style.width = ((bandMember4.health/100)*120+1).toString()+"px";
        bandMember4PartyBar.style.width = ((bandMember4.party/100)*120+1).toString()+"px";
    }


}

/*==========================
    Game Over
===========================*/

function gameOver() {

}

/*==========================================================================
Main Game Loop
===========================================================================*/

function mainGameLoop(event) {

// console.log("Starting mainGameLoop");

displayCharacterStatus("update");

// First check the player's actions

if (currentKeysPressed.pressedKeys.has('ArrowUp')) { 
    player1.direction='N'; 
    player1.imageState='Walk Up';
}
else if (currentKeysPressed.pressedKeys.has('ArrowDown')) {
    player1.direction='S';
    player1.imageState='Walk Down';
}
else if (currentKeysPressed.pressedKeys.has('ArrowLeft')) {
    player1.direction='W';
    player1.imageState='Walk Left';
}
else if (currentKeysPressed.pressedKeys.has('ArrowRight')) {
    player1.direction='E';
    player1.imageState='Walk Right';
}
else {
    player1.direction='';
    if ( player1.imageState==='Walk Left' || player1.imageState==='Walk Down' || 
        player1.imageState==='Idle Left') {
        player1.imageState='Idle Left';
    }
    else {
        player1.imageState='Idle Right';
    }
}

movePlayer1();
player1.incrementImageAnimation();

bandMember1.incrementImageAnimation();
bandMember2.incrementImageAnimation();
bandMember3.incrementImageAnimation();
bandMember4.incrementImageAnimation();

currentKeysPressed.pressedKeys.clear();

// clearInterval(mainGameLoopIntervalId);

} 









