
/*==========================================================================
Global Game Settings
===========================================================================*/

const gameStatus='Splash Screen';
const BANDMEMBER_DEFAULT_STATE="wander";
const PLAYER_DEFAULT_STATE="chase";
const ANIMATION_FRAME_DELAY=100;
let mainGameLoopIntervalID;

// Grab and cache fixed DOM elements

const body = document.querySelector('body');
const gameContainer = document.querySelector('#game-container');

/*==========================================================================
Band Member Characters
===========================================================================*/

const bandMemberCharacters=[
    {
        "name" : 'AXL',
        "id" : "bandchar1",
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image" : '/assets/axl.png',
    },
    {
        "name" : 'Vince',
        "id" : "bandchar2",
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image" : '/assets/vince.png',
    },
    {
        "name" : 'Johnny Fear',
        "id" : "bandchar3",
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image" : '/assets/jonnyfear.png',
    },
    {
        "name" : 'Hans',
        "id" : "bandchar4",
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image" : '/assets/hans.png',
    },
];

const playerCharacters =[
    {
        "name" : 'Player 1',
        "id" : "player1",
        "health" : 100,
        "speed" : 1,
        "image" : {
                    "src": '/assets/player1_64x64.png',
                    "Walk Left": [0, 9, 0],  // Sprite Row, Total Frames, Current Frame
                    "Walk Right": [1, 9, 0],  
                    "Walk Down": [0, 9, 0],
                    "Walk Up": [1, 9, 0],  
                    "Idle": [2, 11,0 ],  
                    "Die": [3, 11, 0],  
                    "Dizzy": [4, 3, 0], 
                    "Hurt": [5, 3, 0],  
                    "Throwing Right": [6, 5, 0], 
                    "Throwing Left": [6, 5, 0],
                    "imageState" : "Walk Left",
                    "lastUpdate" : 0,
        },
    },
];



/*==========================================================================
Game Level Definitions
===========================================================================*/

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
    ['W',' ','S',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
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
        this._sober=bandMemberCharacter.sober;
        this._speed=bandMemberCharacter.speed;
        this._posX=positionX;
        this._posY=positionY;        
        this._state=BANDMEMBER_DEFAULT_STATE;
        this._image=Object.assign({}, bandMemberCharacter.image);
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get sober() { return this._sober; }
    set sober(setSober) { this._sober=setSober; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }

    get posX() { return this._posX; }
    set posX(setPosX) { this._posX=setPosX; }

    get posY() { return this._posY; }
    set posY(setPosY) { this._posY=setPosY; }

    get posXY() { return [this._posX, this.posY];}
    set posXY([setPosX, setPosY]) { this._posX=setPosX; this._posY=setPosY; }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { this._image["imageState"]=setImageState; } 

}

// Player Class

class Player {
    constructor (playerCharacter, setName, positionX, positionY) {
        this._name=setName;
        this._id=playerCharacter.id;
        this._health=playerCharacter.health;
        this._sober=playerCharacter.sober;
        this._speed=playerCharacter.speed;
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
        gameContainer.appendChild(this._imageDiv);
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }

    get posX() { return this._posX; }
    set posX(setPosX) { this._posX=setPosX; }

    get posY() { return this._posY; }
    set posY(setPosY) { this._posY=setPosY; }

    get posXY() { return [this._posX, this.posY];}
    set posXY([setPosX, setPosY]) { this._posX=setPosX; this._posY=setPosY; }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { this._image["imageState"]=setImageState; } 

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

// Display the Game Board

function displayGameBoard(level) {

    const gamePlayfield = document.createElement('div');
    gamePlayfield.setAttribute('id', 'game-playfield');
    gameContainer.appendChild(gamePlayfield);

    for (let i=0; i<level.length; i++) {
        for (let j=0; j<level[i].length; j++) {
            const gameSquare = document.createElement('div');
            gameSquare.setAttribute('class', "game-square");            
            gameSquare.setAttribute('data-gsx', (i).toString());
            gameSquare.setAttribute('data-gsy', (j).toString());
            gameSquare.setAttribute('data-gst', level[i][j]);

            if (level[i][j]==='W') {
                gameSquare.innerHTML=`<p style="background-color:#cccccc">W</p>`;
            }
            else if (level[i][j]===' ') {
                gameSquare.innerHTML=`<p style="background-color:#000000">W</p>`;
            }

            gamePlayfield.appendChild(gameSquare);            
        }
    }    
}

/*==========================================================================
Motion
===========================================================================*/



/*==========================================================================
Collision Detection
===========================================================================*/


/*==========================================================================
Start Bad Tendencies and Initialize a New Game
===========================================================================*/

const promptGameStartId = setTimeout(promptGameStart, 5000);

function promptGameStart() {
    const divSplash = document.querySelector('#outerSplash');

    //gameContainer.removeChild(divSplash);

    const htmlMessage = `<div class="game-instructions">
        <h3>Game Instructions</h3>
           
        <p>You are the band member for the rock band <em><u>Bad Tendencies</u></em>.
        Your job is to get the band members on stage and to keep them out of 
        trouble.  If you get close to a band member they will follow you to
        the stage, unless they are distracted or under the influence.  You 
        can also collect money as you move along, otherwise the band members
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

    displayModalDialog("", body, "500px", "500px", htmlMessage);
}


function startNewGame() {
    displayGameBoard(gameLevel1);
    player1 = new Player(playerCharacters[0], "Harry", 200, 200);

    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);
}

/*==========================================================================
Main Game Loop
===========================================================================*/

function mainGameLoop(event) {

console.log("Starting mainGameLoop");

const htmlMessage = `<p>What's up Harry!!!!</p>`;

// displayModalDialog("", body, "300px", "500px", htmlMessage);

player1.incrementImageAnimation();

clearInterval(mainGameLoopIntervalId);

} 






