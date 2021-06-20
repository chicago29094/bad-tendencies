
/*==========================================================================
Global Game Settings
===========================================================================*/

const BANDMEMBER_DEFAULT_STATE="Wander";
const BANDMEMBER_STATE_CHANGE_DELAY=4000;
const BANDMEMBER_DIR_CHANGE_DELAY=4000;
const BANDMEMBER_FOLLOW_CHANGE_DELAY=1000;
const BANDMEMBER_PID_MAXHISTORY=20;  // Proportional, Integral, Differential Motion Control
const BANDMEMBER_HEALTH_RECOVERY=1;
const BANDMEMBER_PARTY_RECOVERY=1;
const FOLLOW_DISTANCE=200;
const BOUNCEBACK_FACTOR=3;
const PLAYER_DEFAULT_STATE="Chase";
const PLAYER_HEALTH_RECOVERY=1;
const ANIMATION_FRAME_DELAY=100; // milliseconds
const SPLASH_SCREEN_DELAY=3000; // milliseconds

let GOOD_PLAYFIELD_OBJECT_DROP_RATE=20000; // milliseconds
let BAD_PLAYFIELD_OBJECT_DROP_RATE=20000; // milliseconds
let lastGoodDropTime=0;
let lastBadDropTime=0;


let gameStatus='Splash Screen';
let mainGameLoopIntervalID;
let currentGameLevel="";
let currentLevel=1;
let player1Score=0;
let levelStartTime=0;

// Keyboard key press data structure

const KEY_PRESSED_CYCLE=100; // milliseconds 
const pressedKeySet = new Set();
const currentKeysPressed={
    pressedKeys: pressedKeySet,
    setCreated: 0,
};

// Direction to Character Image State Mapping

const directionToImageState = {
    'N': 'Walk Up',
    'S': 'Walk Down',
    'W': 'Walk Left',
    'E': 'Walk Right',
    ' ': 'Idle Right',
     '': 'Idle Right',
};

// Global Character Objects

let player1 = {};
let player2 = {};
let bandMember1 = {};
let bandMember2 = {};
let bandMember3 = {};
let bandMember4 = {};

// Grab and cache fixed DOM elements

const body = document.querySelector('body');
const gameContainer = document.querySelector('#game-container');
const mediaContainer = document.querySelector('#media-container');

const gameDom = [] ; // Use an array to cache and reference commonly accessed DOM elements

const soundDomLookup = []; // Use an array for fast DOM audio lookups;

/*==========================================================================
Band Member Characters
===========================================================================*/

const mediaSoundsLibrary = [
    {
        "music_score" : {
            "main" : './sounds/clearside_sandblaster.mp3',
        }
    },
    {
        "sound_effect" : {
            "coins" :  './sounds/sfx_coin_cluster3.wav',
            "death1" :  './sounds/sfx_deathscream_human5.wav',
            "death2" :  './sounds/sfx_deathscream_human14.wav',
            "shot1" :  './sounds/sfx_exp_short_hard5.wav',
            "shot2" :  './sounds/sfx_exp_short_soft3.wav',
            "shot3" :  './sounds/sfx_exp_shortest_hard7.wav',
            "impact4" :  './sounds/sfx_exp_various4.wav',
            "low_health" :  './sounds/sfx_lowhealth_alarmloop3.wav',
            "steps1" :  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "steps2" :  './sounds/sfx_movement_footstepsloop4_slow.wav',
            "levelchange" :  './sounds/sfx_sound_neutral7.wav',
            "levelchange" :  './sounds/sfx_sound_shutdown1.wav',
            "fanfare1" :  './sounds/sfx_sounds_fanfare1.wav',
            "impact1" :  './sounds/sfx_sounds_impact1.wav',
            "impact6" :  './sounds/sfx_sounds_impact6.wav',
            "pause" :  './sounds/sfx_sounds_pause4_in.wav',
            "shotgun" :  './sounds/sfx_weapon_shotgun3.wav',         
        }
    },
    {
        "player" : { 
            "Walk Left": './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Right":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Down":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Up":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Die":  './sounds/sfx_deathscream_human14.wav',
            "Dizzy":  './sounds/sfx_movement_ladder3loop.wav',
            "Hurt":  './sounds/sfx_movement_ladder3loop.wav',
            "Throwing Left":  './sounds/sfx_exp_various4.wav',
            "Throwing Right":  './sounds/sfx_exp_various4.wav',
            "Shoot Left":  './sounds/sfx_exp_short_hard5.wav',
            "Shoot Right": './sounds/sfx_exp_short_hard5.wav',
        }
    },
    {
        "bandmember" : { 
            "Walk Left": './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Right":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Down":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Walk Up":  './sounds/sfx_movement_footstepsloop4_fast.wav',
            "Die":  './sounds/sfx_deathscream_human5.wav',
            "Dizzy":  './sounds/sfx_movement_ladder3loop.wav',
            "Hurt":  './sounds/sfx_movement_ladder3loop.wav',
            "Throwing Left":  './sounds/sfx_exp_various4.wav',
            "Throwing Right":  './sounds/sfx_exp_various4.wav',
            "Shoot Left":  './sounds/sfx_weapon_shotgun3.wav',
            "Shoot Right": './sounds/sfx_weapon_shotgun3.wav',
        }
    },

];



const bandMemberCharacters=[
    {
        "name" : 'AXL',
        "id" : "bandchar1",
        "health" : 100,
        "party" : 0,
        "speed" : 5,
        "image" : {
            "thumbnail" : './assets/bandmember_262_128.png',
            "src": './assets/bandmember_262_64x64.png',
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
            "Hidden": [10, 0, 0],
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
            "thumbnail" : './assets/bandmember_236_128.png',
            "src": './assets/bandmember_236_64x64.png',
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
            "Hidden": [10, 0, 0],
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
            "thumbnail" : './assets/bandmember_011_128.png',
            "src": './assets/bandmember_011_64x64.png',
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
            "Hidden": [10, 0, 0],
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
            "thumbnail" : './assets/bandmember_003_128.png',
            "src": './assets/bandmember_003_64x64.png',
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
            "Hidden": [10, 0, 0],
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
        "speed" : 8,
        "image" : {
                    "thumbnail" : './assets/player_001_128.png',
                    "src": './assets/player_001_64x64.png',
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
                    "Hidden": [8, 0, 0],
                    "imageState" : "Idle Right",
                    "lastUpdate" : 0,
        },
    },
];



/*==========================================================================
Game Level Definitions
===========================================================================*/

const playFieldAssetsClasses = {
    "W" : `playfield-wall`,
    " " : `playfield-floor`,
    "S" : `playfield-exit`,
    'P' : `playfield-pit`,
    "a" : `playfield-floor`,
    "b" : `playfield-floor`,    
    "c" : `playfield-floor`,    
    "d" : `playfield-floor`,    
    "e" : `playfield-floor`,    
    "f" : `playfield-floor`,    
    "g" : `playfield-floor`,    
    "h" : `playfield-floor`,    
    "i" : `playfield-floor`,
    "j" : `playfield-floor`,
    "i" : `playfield-floor`,
    "k" : `playfield-floor`,
    "l" : `playfield-floor`,
    "m" : `playfield-floor`,
    "n" : `playfield-floor`,
    "o" : `playfield-floor`,
    "p" : `playfield-floor`,    
}

const playFieldObjectImages = {
    "a" : './assets/beer_002.png',
    "b" : './assets/beer_004.png',
    "c" : './assets/bomb2_32.png',
    "d" : './assets/bullet_down.png',
    "e" : './assets/bullet_up.png',
    "f" : './assets/bullet_left.png',
    "g" : './assets/bullet_right.png',
    "h" : './assets/coin2.gif',
    "i" : './assets/explosion_32.gif',
    "j" : './assets/explosion_64.gif',
    "k" : './assets/gem_blue.png',
    "l" : './assets/handgun_left.png',
    "m" : './assets/handgun_right.png',
    "n" : './assets/lighter_pic.gif',
    "o" : './assets/pills_06.png',
    "p" : './assets/wine_002.png',  
    "q" : './assets/flame_32.gif',  
    "r" : './assets/flame_64.gif',  
}

const gameLevel1 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ','P',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ','W','W','W','W','W','W','W',' ','W','W',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W'],
    ['W',' ',' ','W','W','W',' ',' ',' ','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ',' ','W',' ',' ',' ','P',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W',' ',' ',' ','W','W','W','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','S','S',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','S','S',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];


const gameLevel2 = [
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
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ','S','S',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','S','S',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];

const gameLevel3 = [
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
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ','S','S',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','S','S',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];

const gameLevel4 = [
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
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ','S','S',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','S','S',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];


const gameLevel5 = [
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
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ','S','S',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','S','S',' ','W',' ',' ',' ',' ',' ','W'],
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
        this._lastPosX=positionX;
        this._lastPosY=positionY;
        this._state=BANDMEMBER_DEFAULT_STATE;
        this._lastStateChange=Date.now();
        this._lastDirChange=Date.now();     
        this._PIDBuffer=[];  
        this._PIDBufferIndex=0;
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

    get lastStateChange() { return this._lastStateChange; }

    get lastDirChange() { return this._lastDirChange; }

    set lastDirChange(setLastDirChange) { this._lastDirChange=setLastDirChange; }

    get id() { return this._id; }

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
        set state(setState) { 
        if (setState!==this._state) {
            this._lastStateChange=Date.now();
        }
        this._state=setState; 
        if (this._state==='Stage') {
            this._posX=-5000;
            this._posY=-5000;
        }
    }
    
    get image() { return this._image; }
    
    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
        if (this._image["imageState"]!==setImageState) {
            this._image["imageState"]=setImageState; 
            this._image[setImageState][2]=0;
            this._lastDirChange=Date.now();
        }
    } 
    
    updatePIDBuffer ()  { 
        // Keep a history of last n movement differentials in a circular buffer
        if (this._PIDBufferIndex===BANDMEMBER_PID_MAXHISTORY) { 
                this._PIDBufferIndex=0;
        }
        this._PIDBuffer[this._PIDBufferIndex]=Math.sqrt( (this._posX-this._lastPosX)**2 + (this._posY-this._lastPosY)**2 );
        this._lastPosX=this._posX;
        this._lastPosY=this._posY;
        this._PIDBufferIndex++;
    }

    updateVitals ()  { 
        // Update the health and party vitals on each game loop
        this._health=this._health+BANDMEMBER_HEALTH_RECOVERY;
        if (this._health>100) this._health=100;
        this._party=this._party-BANDMEMBER_PARTY_RECOVERY;
        if (this._party<0) this._party=0;
    }
    
     getPIDBufferDiffs() {
        let totalPIDDiffs=0;
        for (let i=0; i<this._PIDBuffer.length; i++) {
            totalPIDDiffs=totalPIDDiffs+this._PIDBuffer[i];
        }
        return totalPIDDiffs;
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

            if (curCol===maxCol) {
                if ( (this._image["imageState"]!=='Die') && 
                    (this._image["imageState"]!=='Shoot Left') && 
                    (this._image["imageState"]!=='Shoot Right') ) {
                        curCol=0;
                }
            }
            else curCol=curCol+1;

            if (this._image["imageState"]==='Hidden') {
                curCol=8;
            }

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
        this._lastStateChange=Date.now();        
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

    get lastStateChange() { return this._lastStateChange; }

    get id() { return this._id; }

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
    set state(setState) { 
        if (setState!==this._state) {
            this._lastStateChange=Date.now();
        }        
        this._state=setState; 
    }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
            if (this._image["imageState"]!==setImageState) {
                this._image["imageState"]=setImageState; 
                this._image[setImageState][2]=0;
            }
    }

    updateVitals ()  { 
        // Update the health vitals on each game loop
        this._health=this._health+BANDMEMBER_HEALTH_RECOVERY;
        if (this._health>100) this._health=100;
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

            if (curCol===maxCol) {
                if ( (this._image["imageState"]!=='Die') && 
                    (this._image["imageState"]!=='Shoot Left') && 
                    (this._image["imageState"]!=='Shoot Right') ) {
                        curCol=0;
                }
            }
            else curCol=curCol+1;

            if (this._image["imageState"]==='Hidden') {
                curCol=8;
            }

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

// Distance Between Game Characters
function distanceBetweenCharacters(character1, character2) {
    return Math.sqrt( (character1.posX-character2.posX)**2 + (character1.posY-character2.posY)**2 );
}

// Return compass direction to follow player
function followDirection(player, character) {

    const currentTime=Date.now();
    if ( (currentTime-character.lastDirChange)<BANDMEMBER_FOLLOW_CHANGE_DELAY ) {
        return character.direction;
    }

    let direction="";
    if ( ( Math.abs(player.posX-character.posX) > Math.abs(player.posY-character.posY) )  ) {
        if (player.posX<character.posX) direction='W';
        else direction='E';
    }
    else {
        if (player.posY<character.posY) direction='N';
        else direction='S';
    }

    const totalDiffs = character.getPIDBufferDiffs();
    //console.log("totalDiffs", totalDiffs);
    const diffRatio = (totalDiffs/BANDMEMBER_PID_MAXHISTORY*character.speed);
    //console.log(character, "diffRatio:", diffRatio);

    if (Math.random()>diffRatio) {
        direction=['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
    }

    return direction;
    
}

// Initialize DOM and cache game sounds 

function loadGameSounds() {

    for ( [num, soundCategory] of Object.entries(mediaSoundsLibrary) ) {

        for ( [soundType, mediaType] of Object.entries(soundCategory) )  {

            soundDomLookup[soundType]=[];
            for ( [sound, media] of Object.entries(mediaType) )  {

                // console.log(soundType, sound, media);

                let soundDom={};
                soundDom=document.createElement('audio');
                mediaContainer.appendChild(soundDom);
                let soundSource=document.createElement('source');
                soundSource.setAttribute('src', media);
                if (media.indexOf('wav')!==-1) soundSource.setAttribute('type', "audio/wav");
                if (media.indexOf('mp3')!==-1) soundSource.setAttribute('type', "audio/mp3");
                soundDom.appendChild(soundSource); 

                soundDomLookup[soundType][sound]=soundDom;
                //soundDomLookup[soundType].push(sound, soundDom);
            }
        }
    }

}

loadGameSounds();

// Play game sounds 

function playSounds(category, sound) {

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
    
    modalWindow.innerHTML = `<div class="close-modal"><img src="./assets/skull_04.png"></div>`;
    modalWindow.innerHTML = modalWindow.innerHTML + htmlMessage;
    underModal.appendChild(modalWindow);

    const closeWindow = document.querySelector('.close-modal');
    closeWindow.addEventListener('click', (event) => {
            // console.log(event.target);
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
            gameSquare.classList.add(playFieldAssetsClasses[level[i][j]]);
            
            if ( (level[i][j]>='a') && (level[i][j]<='p') ) {
                gameSquare.innerHTML=`<img src='${playFieldObjectImages[level[i][j]]}'>`;
            }

            // gameSquare.appendChild(pTag);    
            gamePlayfield.appendChild(gameSquare);            
        }
    }    
}


/*================================================
// Randomly Drop and Display Playfield Objects
=================================================*/

function dropPlayfieldObject(updateType, when) {

    let playfieldObjectType="";
    let currentTime=Date.now();
    let tryX=0;
    let tryY=0;


    if (!when || when!=='Now') {
        if (updateType==="Good") {
            if ((currentTime-lastGoodDropTime)<GOOD_PLAYFIELD_OBJECT_DROP_RATE) {
                return;
            }
            else {
                lastGoodDropTime=currentTime;
            }
        }
        else if (updateType==="Bad") {
            if ((currentTime-lastBadDropTime)<BAD_PLAYFIELD_OBJECT_DROP_RATE) {
                return;
            }
            else {
                lastBadDropTime=currentTime;
            }
        }
        else {
            return;
        }
    }

    tryY=(Math.round(Math.random()*(currentGameLevel.length-1)));
    tryX=(Math.round(Math.random()*(currentGameLevel[tryY].length-1)));

    while ( currentGameLevel[tryY][tryX]!==' ' ) {
        tryY=Math.round(Math.random()*(currentGameLevel.length-1));
        tryX=Math.round(Math.random()*(currentGameLevel[tryY].length-1));
    }

    if (updateType==='Good') {
        playfieldObjectType = ['h', 'k'][Math.round(Math.random()*1)];
    }
    else {
        playfieldObjectType = ['a','b','c','l','m','n','o','p'][Math.round(Math.random()*7)];
    }


    const playfieldImage = document.createElement('img');
    playfieldImage.setAttribute('class', "game-playfield-object");
    playfieldImage.setAttribute('data-gst', playfieldObjectType);
    playfieldImage.setAttribute('src', playFieldObjectImages[playfieldObjectType]);    
    playfieldImage.style.position="absolute";
    playfieldImage.style.left=tryX*32+"px";
    playfieldImage.style.top=tryY*32+"px";
    gameDom["gameContainerPlayfield"].appendChild(playfieldImage);                 
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
Control Player Movement
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
    const willCollide=checkCollisions(player1, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    if (willCollide[0]) {
        if (
            (willCollide[1]["collisionType"]==='Wall') || 
            (willCollide[1]["collisionType"]==='banderMember1') || 
            (willCollide[1]["collisionType"]==='banderMember2') || 
            (willCollide[1]["collisionType"]==='banderMember3') || 
            (willCollide[1]["collisionType"]==='banderMember4') ) {
                //console.log(willCollide[1]["collisionType"]);
                player1.health=player1.health-2;
            }  
    }


    if (player1.direction==='N') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='S') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='W') player1.posX = stepwiseCollisionXY[0];
    if (player1.direction==='E') player1.posX = stepwiseCollisionXY[0];

}


/*==========================================================================
Control Band Member Movement
===========================================================================*/

function moveBandMember(bandMember) {
    
    if ( (bandMember.state==='Stage') || (bandMember.state==='Dead') ) {
        return;
    }

    const currentPosX = bandMember.posX;
    const currentPosY = bandMember.posY;
    const stepwiseCollisionXY = [];
    let newPosX = currentPosX;
    let newPosY = currentPosY;

    let bounceBack=false;

    if (bandMember.direction==='N') newPosY = bandMember.posY - bandMember.speed;
    if (bandMember.direction==='S') newPosY = bandMember.posY + bandMember.speed;
    if (bandMember.direction==='W') newPosX = bandMember.posX - bandMember.speed;
    if (bandMember.direction==='E') newPosX = bandMember.posX + bandMember.speed;
    
    stepwiseCollisionXY[0]=currentPosX;
    stepwiseCollisionXY[1]=currentPosY;
    const willCollide=checkCollisions(bandMember, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    if (willCollide[0]) {
        if ( (willCollide[1]["collisionType"]==='player1') || 
            (willCollide[1]["collisionType"]==='banderMember1') || 
            (willCollide[1]["collisionType"]==='banderMember2') || 
            (willCollide[1]["collisionType"]==='banderMember3') || 
            (willCollide[1]["collisionType"]==='banderMember4') ) {
                //console.log(willCollide[1]["collisionType"]);
                bounceBack=true;
                // bandMember.health=bandMember.health-2;
            }
            else {
                bandMember.lastDirChange=0;
            }
    }

    
    if ( (!willCollide[0]) && (willCollide[1]["collisionType"]==='Stage') ) {
        player1Score=player1Score+1000;
        bandMember.state="Stage";
        bandMember.imageState="Hidden";
    }

    if (bounceBack) {
            
        if (bandMember.direction==='S') newPosY = bandMember.posY - bandMember.speed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='N') newPosY = bandMember.posY + bandMember.speed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='E') newPosX = bandMember.posX - bandMember.speed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='W') newPosX = bandMember.posX + bandMember.speed*BOUNCEBACK_FACTOR;
        
        stepwiseCollisionXY[0]=currentPosX;
        stepwiseCollisionXY[1]=currentPosY;
        const willCollide=checkCollisions(bandMember, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);
    }
 
    if (bandMember.direction==='N') bandMember.posY = stepwiseCollisionXY[1];
    if (bandMember.direction==='S') bandMember.posY = stepwiseCollisionXY[1];
    if (bandMember.direction==='W') bandMember.posX = stepwiseCollisionXY[0];
    if (bandMember.direction==='E') bandMember.posX = stepwiseCollisionXY[0];

}


/*==========================================================================
Collision Detection
===========================================================================*/

function checkCollisions(gameCharacter, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY) {

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
                checkPlayfieldCollisions(gameCharacter, stepwiseX+16, currentPosY+12, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseX--;
            }
            stepwiseCollisionXY[0]=stepwiseX;
            stepwiseCollisionXY[1]=newPosY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            if (collisionResults.isAllowed) return [false,collisionResults];
            else return [true,collisionResults];
        }
        else {
            let stepwiseX=currentPosX;
            while ( collisionResults.isAllowed && (stepwiseX>newPosX) ) {
                stepwiseX--;
                checkPlayfieldCollisions(gameCharacter, stepwiseX+16, currentPosY+12, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseX++;
            }
            stepwiseCollisionXY[0]=stepwiseX;
            stepwiseCollisionXY[1]=newPosY;
            if (collisionResults.isAllowed) return [false,collisionResults];
            else return [true,collisionResults];
        }
    }
    else if (currentPosY-newPosY!==0) {
        if (currentPosY<newPosY) {
            let stepwiseY=currentPosY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            while ( collisionResults.isAllowed && (stepwiseY<newPosY) )  {
                stepwiseY++;
                checkPlayfieldCollisions(gameCharacter, currentPosX+16, stepwiseY+12, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseY--;
            }
            stepwiseCollisionXY[0]=newPosX;
            stepwiseCollisionXY[1]=stepwiseY;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            if (collisionResults.isAllowed) return [false,collisionResults];
            else return [true,collisionResults];
        }
        else {
            let stepwiseY=currentPosY;
            while ( collisionResults.isAllowed && (stepwiseY>newPosY) ) {
                stepwiseY--;
                checkPlayfieldCollisions(gameCharacter, currentPosX+16, stepwiseY+12, 32, 52, collisionResults);
            }
            if (!collisionResults.isAllowed) {
                stepwiseY++;
            }
            stepwiseCollisionXY[0]=newPosX;
            stepwiseCollisionXY[1]=stepwiseY;
            if (collisionResults.isAllowed) return [false,collisionResults];
            else return [true,collisionResults];
        }

    }
    else {
        stepwiseCollisionXY[0, 1]=[newPosX, newPosY];
        return [false,collisionResults];
    }

}

/*==================================
// Check Play Field Collisions
====================================*/

function checkPlayfieldCollisions(gameCharacter, posX, posY, width, height, collisionResults) {

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
    // Iterate through surrounding playfield squares to see if we will collide with a wall

    for (let row=gameGridStartRow; row<=gameGridEndRow; row++) {
        for (let col=gameGridStartColumn; col<=gameGridEndColumn; col++) {

            const gridSquare = document.querySelector(`div[data-gsx='${col}'][data-gsy='${row}']`)
            
            // console.log(`${col} ${row} ${gridSquare}`);
            // gridSquare.style.borderTop="1px solid #ff0000";
            gridPosX=col*32;
            gridPosY=row*32;
            gridWidth=32;
            gridHeight=32;
            
            if (collides(posX, posY, width, height, gridPosX, gridPosY, gridWidth, gridHeight)) {
                if (gridSquare.classList.contains('playfield-wall')) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    collisionResults.collision=true;
                    collisionResults.collisionType="Wall";
                    collisionResults.isAllowed=false;
                    return;
                }
                else if (gridSquare.classList.contains('playfield-exit')) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    collisionResults.collision=true;
                    collisionResults.collisionType="Stage";
                    collisionResults.isAllowed=true;
                    return;
                }                
            }
        }
    }

    // console.log("Here:00000");
    // console.log(posX, posY, width, height, bandMember1.posX, bandMember1.posY, 32, 52);
    // console.log(collides(posX, posY, width, height, bandMember1.posX, bandMember1.posY, 32, 52));

    // Next check to see if this movement will collide with any other game character 

    if ( (gameCharacter.id!==player1.id) && (player1.health>0) && 
        (collides(posX, posY, width, height, player1.posX+16, player1.posY+12, 32, 52)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="player1";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember1.id) && (bandMember1.health>0) &&  
        (collides(posX, posY, width, height, bandMember1.posX+16, bandMember1.posY+12, 32, 52)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember1";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember2.id) && (bandMember2.health>0) && 
        (collides(posX, posY, width, height, bandMember2.posX+16, bandMember2.posY+12, 32, 52)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember2";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember3.id) && (bandMember3.health>0) && 
        (collides(posX, posY, width, height, bandMember3.posX+16, bandMember3.posY+12, 32, 52)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember3";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember4.id) && (bandMember4.health>0) && 
        (collides(posX, posY, width, height, bandMember4.posX+16, bandMember4.posY+12, 32, 52)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember4";
        collisionResults.isAllowed=false;
        return;
    }
}


// Check overlap collision between two bounding boxes, returns boolean true upon collision

function collides(posX1, posY1, width1, height1, posX2, posY2, width2, height2) {

    if (posX1 < (posX2 + width2)  && (posX1 + width1) > posX2 &&
    posY1 < (posY2 + height2) && (posY1 + height1) > posY2) {
        return true;
    } else {
        return false;
    }
}


/*==========================================================================
Start New Game Level
===========================================================================*/

function gameLevelUp() {
    const divSplash = document.querySelector('#outerSplash');

    //gameContainer.removeChild(divSplash);
    if (currentLevel===6) {
        
        currentLevel--;

        const timeOnCurrentLevel=(Math.floor((Date.now()-levelStartTime)/1000));
        const timeOnCurrentLevelStr=(timeOnCurrentLevel).toString().padStart(4, '0');
        const player1ScoreStr=(player1Score).toString().padStart(6, '0');
    
        const htmlMessage = `<div class="game-instructions">
            <h3>You Won - You Finished Level 5</h3>
        
            <div class="bt-gameover-outer">
            <div class="bt-gameover-item">                    
                 <p>LEVEL: <span class="scoreboard-value">${currentLevel}</span></p> 
            </div>
            <div class="bt-gameover-item">                    
                 <p>PLAYER: <span class="scoreboard-value">${player1.name}</span></p>
            </div>
            <div class="bt-gameover-item">                    
                 <p>SCORE: <span class="scoreboard-value">${player1ScoreStr}</span></p>
            </div>
            <div class="bt-gameover-item fixed">                    
                 <p>TIME: <span class="scoreboard-value"><nobr>${timeOnCurrentLevelStr}</nobr></span></p>
            </div>
            </div>
    
            <p>You can click below to start a new game.</p>

            <form>
            <button id="startGameButton">Start New Game</button>
            </form>
        </div>
        `;

        displayModalDialog("", body, "500px", "", htmlMessage);

        const starGameButton = document.querySelector('#startGameButton');
        startGameButton.addEventListener('click', () => {window.location="index.html";} );

    }
    else {

        const htmlMessage = `<div class="game-instructions">
            <h3>You Finished Level ${currentLevel-1}</h3>
            
            <p>You led the band members to the stage and kept damage to a minimum.  
            Click below to start the next level.</p>

            <form>
                <button id="nextLevelButton">Start Next Level</button>
            </form>
        </div>
        `;

        displayModalDialog("", body, "500px", "", htmlMessage);

        const nextLevelButton = document.querySelector('#nextLevelButton');
        nextLevelButton.addEventListener('click', startNextLevel);
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

    const player1TextInput = document.querySelector('.nameInput');
    let player1Name="Player 1";

    if (player1TextInput && player1TextInput.value) {
        player1Name = player1TextInput.value;
        if (player1Name.length>30) {
            player1Name = player1Name.slice(1, 30);
        }
    }

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
    headerStartGameButton.addEventListener('click', () => {window.location='index.html';} );

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

    player1 = new Player(playerCharacters[0], player1Name, 290, 250);
    bandMember1 = new BandMember(bandMemberCharacters[0], 250, 250);
    bandMember2 = new BandMember(bandMemberCharacters[1], 320, 350);
    bandMember3 = new BandMember(bandMemberCharacters[2], 450, 420);
    bandMember4 = new BandMember(bandMemberCharacters[3], 600, 550);

    displayCharacterStatus("initialize");

    handleKeyboardEvents("");

    levelStartTime=Date.now();

    console.log(soundDomLookup);
    soundDomLookup["player"]["Die"].play();

    console.log("Here:0001");


    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);
}


/*=============================
    Start Next Level of Game
==============================*/

function startNextLevel(event) {
    event.preventDefault();
    
    let player1Name=player1.name;

    const underModal = document.querySelector("div.under-modal");
    body.removeChild(underModal);

    if (currentLevel===1) currentGameLevel=gameLevel1;
    if (currentLevel===2) currentGameLevel=gameLevel2;
    if (currentLevel===3) currentGameLevel=gameLevel3;
    if (currentLevel===4) currentGameLevel=gameLevel4;
    if (currentLevel===5) currentGameLevel=gameLevel5;

    const previousPlayfield = document.querySelector('#game-playfield');

    if (previousPlayfield) {
        gameDom["gameContainerPlayfield"].removeChild(previousPlayfield);
    }

    displayGameBoard(currentGameLevel);

    player1 = new Player(playerCharacters[0], player1Name, 290, 250);
    bandMember1 = new BandMember(bandMemberCharacters[0], 250, 250);
    bandMember2 = new BandMember(bandMemberCharacters[1], 320, 350);
    bandMember3 = new BandMember(bandMemberCharacters[2], 450, 420);
    bandMember4 = new BandMember(bandMemberCharacters[3], 600, 550);

    displayCharacterStatus("initialize");

    handleKeyboardEvents("");

    levelStartTime=Date.now();


    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);

}


/*======================================
    Display Scoreboard Status
=======================================*/

function displayScoreBoard() {

    const timeOnCurrentLevel=(Math.floor((Date.now()-levelStartTime)/1000));
    const timeOnCurrentLevelStr=(timeOnCurrentLevel).toString().padStart(4, '0');
    const player1ScoreStr=(player1Score).toString().padStart(6, '0');

    gameDom["gameContainerScoreboard"].innerHTML = `
    <div class="bt-scoreboard-outer">
        <div class="bt-scoreboard-item">                    
             <p>LEVEL: <span class="scoreboard-value">${currentLevel}</span></p> 
        </div>
        <div class="bt-scoreboard-item">                    
             <p>PLAYER: <span class="scoreboard-value">${player1.name}</span></p>
        </div>
        <div class="bt-scoreboard-item">                    
             <p>SCORE: <span class="scoreboard-value">${player1ScoreStr}</span></p>
        </div>
        <div class="bt-scoreboard-item fixed">                    
             <p>TIME: <span class="scoreboard-value"><nobr>${timeOnCurrentLevelStr}</nobr></span></p>
        </div>
    </div>`;
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
                    <img src="./assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="./assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember1.name}</p>                
            </div>`;

        gameDom["gameContainerBandMember2"].innerHTML = `    
            <div class="bt-character-outer">
                <img src="${bandMember2.image.thumbnail}" alt="Band Member 2" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="./assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="./assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember2.name}</p>
            </div>`;

        gameDom["gameContainerBandMember3"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${bandMember3.image.thumbnail}" alt="Band Member 3" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="./assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="./assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember3.name}</p>
            </div>`;

        gameDom["gameContainerBandMember4"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${bandMember4.image.thumbnail}" alt="Band Member 4" class="bt-character">
                <div class="bt-character-status-health">                    
                    <img src="./assets/greenbar.png" class="health-bar">
                </div>
                <div class="bt-character-status-party">
                    <img src="./assets/redbar.png" class="party-bar">
                </div>
                <p class="bt-character">${bandMember4.name}</p>
            </div>`;

        gameDom["gameContainerPlayer1"].innerHTML = `
            <div class="bt-character-outer">
                <img src="${player1.image.thumbnail}" alt="Player 1" class="bt-character">
                <div class="bt-character-status-health">
                    <img src="./assets/greenbar.png" class="health-bar">
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
    const divSplash = document.querySelector('#outerSplash');

    //gameContainer.removeChild(divSplash);
    const timeOnCurrentLevel=(Math.floor((Date.now()-levelStartTime)/1000));
    const timeOnCurrentLevelStr=(timeOnCurrentLevel).toString().padStart(4, '0');
    const player1ScoreStr=(player1Score).toString().padStart(6, '0');

    const htmlMessage = `<div class="game-instructions">
        <h3>Game Over</h3>
    
        <div class="bt-gameover-outer">
        <div class="bt-gameover-item">                    
             <p>LEVEL: <span class="scoreboard-value">${currentLevel}</span></p> 
        </div>
        <div class="bt-gameover-item">                    
             <p>PLAYER: <span class="scoreboard-value">${player1.name}</span></p>
        </div>
        <div class="bt-gameover-item">                    
             <p>SCORE: <span class="scoreboard-value">${player1ScoreStr}</span></p>
        </div>
        <div class="bt-gameover-item fixed">                    
             <p>TIME: <span class="scoreboard-value"><nobr>${timeOnCurrentLevelStr}</nobr></span></p>
        </div>
        </div>

        <form>
        <button id="startGameButton">Start New Game</button>
        </form>
    </div>
    `;

    displayModalDialog("", body, "500px", "", htmlMessage);

    const starGameButton = document.querySelector('#startGameButton');
    startGameButton.addEventListener('click', () => {window.location="index.html";} );    
}

/*==========================================================================
Main Game Loop
===========================================================================*/

function mainGameLoop(event) {

const currentTime=Date.now();

// console.log("Starting mainGameLoop");

// Update the health and other status items of the game characters
displayCharacterStatus("update");

// DIsplay the Scoreboard header

displayScoreBoard();

// Check is the player is Dead

if (player1.health<=0) {
    player1.health=0;
    player1.state='Dead';
    player1.imageState='Die';
    player1.incrementImageAnimation();

    if ( (currentTime-player1.lastStateChange)>3000 )
    {
        gameStatus="Game Over";
        clearInterval(mainGameLoopIntervalId);
        gameOver();
        return;
    }
    else {
        return;
    }
}

// Check to See if All Band Members Have Entered the Stage

if  (   ( (bandMember1.state==="Stage") || (bandMember1.state==="Dead") ) && 
        ( (bandMember2.state==="Stage") || (bandMember2.state==="Dead") ) && 
        ( (bandMember3.state==="Stage") || (bandMember3.state==="Dead") ) && 
        ( (bandMember4.state==="Stage") || (bandMember4.state==="Dead") )  
    ) {
    clearInterval(mainGameLoopIntervalId);
    currentLevel=currentLevel+1;
    gameLevelUp();
    return;
}


// Next check the player's keyboard actions
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

// Check to see if any band members should be Dead

if (bandMember1.health<=0) {
    bandMember1.health=0;
    bandMember1.state='Dead';
    bandMember1.imageState='Die';    
}

if (bandMember2.health<=0) {
    bandMember2.health=0;
    bandMember2.state='Dead';
    bandMember2.imageState='Die';    
}

if (bandMember3.health<=0) {
    bandMember3.health=0;
    bandMember3.state='Dead';
    bandMember3.imageState='Die';    
}

if (bandMember4.health<=0) {
    bandMember4.health=0;
    bandMember4.state='Dead';
    bandMember4.imageState='Die';    
}

// Check to see if any band members should change in or out of the follow state

if ( (bandMember1.state==='Follow') && (distanceBetweenCharacters(player1, bandMember1)>FOLLOW_DISTANCE) ) {
    bandMember1.state='Wander';
}
else if ( (bandMember1.state!=='Follow') && (distanceBetweenCharacters(player1, bandMember1)<FOLLOW_DISTANCE) ) {
    bandMember1.state='Follow';
}

if ( (bandMember2.state==='Follow') && (distanceBetweenCharacters(player1, bandMember2)>FOLLOW_DISTANCE) ) {
    bandMember2.state='Wander';
}
else if ( (bandMember2.state!=='Follow') && (distanceBetweenCharacters(player1, bandMember2)<FOLLOW_DISTANCE) ) {
    bandMember2.state='Follow';
}

if ( (bandMember3.state==='Follow') && (distanceBetweenCharacters(player1, bandMember3)>FOLLOW_DISTANCE) ) {
    bandMember3.state='Wander';
}
else if ( (bandMember3.state!=='Follow') && (distanceBetweenCharacters(player1, bandMember3)<FOLLOW_DISTANCE) ) {
    bandMember3.state='Follow';
}

if ( (bandMember4.state==='Follow') && (distanceBetweenCharacters(player1, bandMember4)>FOLLOW_DISTANCE) ) {
    bandMember4.state='Wander';
}
else if ( (bandMember4.state!=='Follow') && (distanceBetweenCharacters(player1, bandMember4)<FOLLOW_DISTANCE) ) {
    bandMember4.state='Follow';
}

// Process band members that are in the follow state

if (bandMember1.state==='Follow') {
    const direction=followDirection(player1, bandMember1);
    bandMember1.direction=direction;
    bandMember1.imageState=directionToImageState[direction];
    moveBandMember(bandMember1);
}
if (bandMember2.state==='Follow') {
    const direction=followDirection(player1, bandMember2);
    bandMember2.direction=direction;
    bandMember2.imageState=directionToImageState[direction];
    moveBandMember(bandMember2);
}
if (bandMember3.state==='Follow') {
    const direction=followDirection(player1, bandMember3);
    bandMember3.direction=direction;
    bandMember3.imageState=directionToImageState[direction];
    moveBandMember(bandMember3);
}
if (bandMember4.state==='Follow') {
    const direction=followDirection(player1, bandMember4);
    bandMember4.direction=direction;
    bandMember4.imageState=directionToImageState[direction];
    moveBandMember(bandMember4);
}


// Process the band members that are in the Wander state

if (bandMember1.state==='Wander') {
    if ( (currentTime-bandMember1.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )
    {
        const randomDirection = ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
        bandMember1.direction=randomDirection;
        bandMember1.imageState=directionToImageState[randomDirection];
    }    
    moveBandMember(bandMember1);
}

if (bandMember2.state==='Wander') {
    if ( (currentTime-bandMember2.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )
    {
        const randomDirection = ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
        bandMember2.direction=randomDirection;
        bandMember2.imageState=directionToImageState[randomDirection];
    }    
    moveBandMember(bandMember2);
}

if (bandMember3.state==='Wander') {
    if ( (currentTime-bandMember3.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )
    {
        const randomDirection = ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
        bandMember3.direction=randomDirection;
        bandMember3.imageState=directionToImageState[randomDirection];
    }    
    moveBandMember(bandMember3);
}

if (bandMember4.state==='Wander') {
    if ( (currentTime-bandMember4.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )
    {
        const randomDirection = ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
        bandMember4.direction=randomDirection;
        bandMember4.imageState=directionToImageState[randomDirection];
    }    
    moveBandMember(bandMember4);
}


// Next, update animations as necessary
player1.incrementImageAnimation();
bandMember1.incrementImageAnimation();
bandMember2.incrementImageAnimation();
bandMember3.incrementImageAnimation();
bandMember4.incrementImageAnimation();

// Next, update PID buffers
bandMember1.updatePIDBuffer();
bandMember2.updatePIDBuffer();
bandMember3.updatePIDBuffer();
bandMember4.updatePIDBuffer();

//Next, update player and band member health and party levels
player1.updateVitals();
bandMember1.updateVitals();
bandMember2.updateVitals();
bandMember3.updateVitals();
bandMember4.updateVitals();

// Randomly drop playFIeld objects onto game board
dropPlayfieldObject("Good");
dropPlayfieldObject("Bad");

// Cleared the cached Set of keyboard clicks.
currentKeysPressed.pressedKeys.clear();

// Only uncomment the following line if single game loop debugging is necessary
// clearInterval(mainGameLoopIntervalId);

} 

/*==============================================================================*/









