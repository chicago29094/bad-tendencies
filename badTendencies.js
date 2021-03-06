
/*==========================================================================
Global Game Settings
===========================================================================*/

const BANDMEMBER_DEFAULT_STATE="Wander";
const BANDMEMBER_STATE_CHANGE_DELAY=4000;
const BANDMEMBER_DIR_CHANGE_DELAY=8000;
const BANDMEMBER_FOLLOW_CHANGE_DELAY=1000;
const BANDMEMBER_MOVE_MAXHISTORY=20;  
const BANDMEMBER_HEALTH_RECOVERY=0.1;
const BANDMEMBER_PARTY_RECOVERY=0.05;
const BANDMEMBER_FIGHT_FACTOR=25;
const BANDMEMBER_COOLDOWN=3000; // milliseconds
const FOLLOW_DISTANCE=200;
const BOUNCEBACK_FACTOR=3;
const PLAYER_DEFAULT_STATE="Chase";
const PLAYER_HEALTH_RECOVERY=1;
const BULLET_DEFAULT_STATE="Moving";
const ANIMATION_FRAME_DELAY=100; // milliseconds
const SPLASH_SCREEN_DELAY=3000; // milliseconds


let GOOD_PLAYFIELD_OBJECT_DROP_RATE=20000; // milliseconds
let WEAPON_PLAYFIELD_OBJECT_DROP_RATE=15000; // milliseconds
let PARTY_PLAYFIELD_OBJECT_DROP_RATE=10000; // milliseconds
let maxPlayfieldCol=0;
let maxPlayfieldRow=0;
let GUN_CHANCE=1.0; 
let BOMB_CHANCE=1.0;
let BEER_CHANCE=1.0;
let DRUGS_CHANCE=1.0;
let WINE_CHANCE=1.0;
let lastGoodDropTime=0;
let lastWeaponDropTime=0;
let lastPartyDropTime=0;
let gameOverFlag=false;
let gameLevelUpFlag=false;
let musicScore='';
let levelModalMusic='level3';

let gameStatus='Splash Screen';
let mainGameLoopIntervalID;
let currentGameLevel="";
let currentLevel=1;
let player1Score=0;
let levelStartTime=0;
let gameStartTime=0;
let levelFrameCounter=0;

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
let bullets = [];

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
            "main1" : './sounds/clearside_sandblaster_edit1.mp3',
            "main2" : './sounds/GIGA_METAL.mp3',
            "main3" : './sounds/SUPER_METAL.mp3',
            "main4" : './sounds/MAXI_METAL.mp3',
            "main5" : './sounds/Thunderclock.mp3',
            "level1" : './sounds/BugaBlue.mp3',
            "level2" : './sounds/Barbara.mp3',
            "level3" : './sounds/happy_clappy.mp3',
            "level4" : './sounds/Liz_Berg.mp3',
        }
    },
    {
        "sound_effect" : {
            "coins" :  './sounds/sfx_coin_cluster3.wav',
            "bigexplosion" : './sounds/sfx_exp_long4.wav',
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
            "thud" :  './sounds/thud.wav',         
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
            "Stage": './sounds/sfx_sound_neutral7.wav',
            "Awesome": './sounds/awesome.wav',
            "Guitar Riff": './sounds/guitarriff.wav',
            "Ha Ha":'./sounds/haha.wav',
            "Oh Ya": './sounds/ohya.wav',
        }
    },

];



const bandMemberCharacters=[
    {
        "name" : 'AXL',
        "id" : "bandMember1",
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
            "Pit Die": [11, 9, 0],  
            "Fire Die": [4, 9, 0],  
            "Bomb Die": [4, 9, 0],  
            "Dizzy": [5, 2, 0], 
            "Hurt": [6, 2, 0],  
            "Throwing Left": [7, 7, 0], 
            "Throwing Right": [8, 7, 0],
            "Shoot Left": [9, 3, 0], 
            "Shoot Right": [10, 3, 0],
            "Hidden": [10, 1, 10],
            "Stage": [10, 1, 10],
            "Stage Hidden": [10, 1, 10],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Thor',
        "id" : "bandMember2",
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
            "Pit Die": [11, 9, 0],  
            "Fire Die": [4, 9, 0],  
            "Bomb Die": [4, 9, 0],  
            "Dizzy": [5, 2, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 7, 0], 
            "Throwing Right": [8, 7, 0],
            "Shoot Left": [9, 3, 0], 
            "Shoot Right": [10, 3, 0],
            "Hidden": [10, 1, 10],
            "Stage": [10, 1, 10],
            "Stage Hidden": [10, 1, 10],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Vince',
        "id" : "bandMember3",
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
            "Pit Die": [11, 9, 0],  
            "Fire Die": [4, 11, 0],  
            "Bomb Die": [4, 11, 0],  
            "Dizzy": [5, 3, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 4, 0], 
            "Throwing Right": [8, 4, 0],
            "Shoot Left": [9, 4, 0], 
            "Shoot Right": [10, 4, 0],
            "Hidden": [10, 1, 10],
            "Stage Hidden": [10, 1, 10],
            "Stage": [10, 1, 10],
            "imageState" : "Idle Right",
            "lastUpdate" : 0,
        },
    },
    {
        "name" : 'Johnny Fear',
        "id" : "bandMember4",
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
            "Pit Die": [11, 9, 0],  
            "Fire Die": [4, 11, 0],  
            "Bomb Die": [4, 11, 0],  
            "Dizzy": [5, 3, 0], 
            "Hurt": [6, 3, 0],  
            "Throwing Left": [7, 5, 0], 
            "Throwing Right": [8, 5, 0],
            "Shoot Left": [9, 4, 0], 
            "Shoot Right": [10, 4, 0],
            "Hidden": [10, 1, 10],
            "Stage Hidden": [11, 2, 23],
            "Stage": [10, 1, 10],
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
                    "Pit Die": [9, 9, 0],  
                    "Fire Die": [4, 11, 0],  
                    "Bomb Die": [4, 11, 0],  
                    "Dizzy": [5, 3, 0], 
                    "Hurt": [6, 3, 0],  
                    "Throwing Right": [7, 5, 0], 
                    "Throwing Left": [8, 5, 0],
                    "Hidden": [8, 1, 10],
                    "Stage Hidden": [8, 1, 10],
                    "Stage": [8, 1, 10],
                    "imageState" : "Idle Right",
                    "lastUpdate" : 0,
        },
    },
];

const bulletTypes =[
    {
        "name" : 'Standard Bullet',
        "id" : "bullet1",
        "speed" : 45,
        "image" : {
                    "src": './assets/bullet_001_32x32.png',
                    "Shoot Left": [0, 4, 0],  // Sprite Row, Total Frames, Current Frame
                    "Shoot Right": [1, 4, 0],  
                    "Shoot Down": [3, 4, 0],
                    "Shoot Up": [2, 4, 0],  
                    "Hidden": [4, 4, 0],  
                    "imageState" : "Hidden",
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
    "T" : `playfield-exit-title`,    
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

const overlayImages = {
    "Gun Overlay" : './assets/gun_overlay.png',
    "Bomb Overlay" : './assets/bomb_overlay.png',
    "Lighter Overlay" : './assets/lighter_overlay.png',
    "Flame Overlay" : './assets/flame_overlay64.gif',
    "Explosion Overlay" : './assets/explosion_overlay64.gif',
    "Health Overlay" : './assets/health_overlay.png',
}

const gameLevel1 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ','l',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ','W','W','W','W','W','W','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W'],
    ['W',' ',' ','W','W','W',' ',' ',' ',' ','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ',' ','W',' ',' ',' ','P',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W',' ',' ','W','W',' ',' ',' ','W','W','W','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','T','S',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ','S','S',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];


const gameLevel2 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ','P',' ','W',' ',' ','W','W','W','W',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W'],
    ['W',' ',' ','W','W',' ',' ','W',' ','W','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W'],
    ['W',' ',' ',' ',' ',' ',' ','W','W','W','W',' ',' ','W',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W',' ',' ','W','W','W'],
    ['W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ','W','W','W'],
    ['W',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W'],
    ['W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ','W','W','W','W','W','W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W',' ',' ','W','W','W','W',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','P',' ','W',' ',' ','W',' ',' ','T','S',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','S','S',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];

const gameLevel3 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','P',' ',' ',' ',' ',' ','T','S',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','S','S',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W','W','W','W','W','W','W','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W','W','W','W',' ',' ','W'],
    ['W',' ','P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ',' ','W','W','W','W','W','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ','W','W','W','W','W','W','W','W','W','W','W','W','W',' ',' ',' ',' ','W','W','W','W','W','W',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ','W','W','W','W','W','W','W','W'],
    ['W','W','W','W','W','W','W','W','W',' ',' ',' ','W',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];

const gameLevel4 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','l',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','P',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','P',' ','W'],
    ['W',' ',' ','W','W','W','W','W',' ',' ','W',' ',' ','W','W','W','W','W','W','W',' ',' ','W','W','W','W','W','W',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','P',' ','W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W'],
    ['W',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W','W','W',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ','W',' ',' ',' ','W','P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ','T','S',' ','W','W','W',' ',' ',' ','W','W','W','W','W','W','W',' ',' ',' ',' ',' ','W'],
    ['W',' ','W','W','W','W',' ',' ','W',' ','S','S',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W','l',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W','W',' ',' ','W',' ','m','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W','W','W','W','W','W','W','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W','W','W','W','W',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','P',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W',' ',' ','W','W','W','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W'],
    ['W',' ',' ','P',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
];


const gameLevel5 = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W','l',' ','W','P',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','l',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W','W','W',' ',' ','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W','W','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','W','W',' ',' ','W',' ',' ','W','W','W','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W','W','W','W','W','W','W','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ','m',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ','W',' ',' ','W','W','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W','W','W','W','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','P',' ',' ',' ',' ',' ',' ','W',' ',' ','W','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','m',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W',' ',' ',' ','W',' ',' ','W','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W','T','S',' ','W',' ',' ',' ',' ','W',' ',' ',' ','W','W','W','W','W',' ',' ','W','W','W',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W','S','S',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ','W',' ',' ','W','W','W','W','W','W','W','W','W','W',' ',' ',' ','m',' ',' ','W','W','W','W','W','W','W',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W','m',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
    ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ',' ','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],

];





/*==========================================================================
Classes
===========================================================================*/

/*-------------------------------------------
// BandMember Class
-------------------------------------------*/

class BandMember {
    constructor (bandMemberCharacter, positionX, positionY) {
        this._name=bandMemberCharacter.name;
        this._id=bandMemberCharacter.id;
        this._health=bandMemberCharacter.health;
        this._party=bandMemberCharacter.party;
        this._currentSpeed=1;
        this._maxSpeed=bandMemberCharacter.speed;
        this._direction='';
        this._posX=positionX;
        this._posY=positionY;
        this._state=BANDMEMBER_DEFAULT_STATE;
        this._lastStateChange=Number(Date.now());
        this._lastDirChange=0;
        this._lastDirection='';
        this._lastDirChangeReason='';
        this._hasLighter=0;
        this._hasBomb=0;
        this._hasGun=0;    
        this._gunBullets=0;
        this._cooldown=0;
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
        
        this.actionQueue=new Queue();
    }

    get cooldown() { return this._cooldown; }
    set cooldown(setCooldown) { this._cooldown=Number(Date.now())+setCooldown};

    get hasLighter() { return this._hasLighter; }
    set haslighter(setTimeValue) { this._hasLighter=setTimeValue; }
    
    get hasBomb() { return this._hasBomb; }
    set hasBomb(setTimeValue) { this._hasBomb=setTimeValue; }
    
    get hasGun() { return this._hasGun; }
    set hasGun(setTimeValue) { 
            this._hasGun=setTimeValue;
            this._gunBullets=6;
    }

    get gunBullets() { return this._gunBullets; }
    decrementGunBullets() { 
            this._gunBullets--;
            if (this._gunBullets<=0) {
                this._gunBullets=0;
                this._hasGun=0;
            }
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

    get currentSpeed() { return this._currentSpeed; }
    set currentSpeed(setCurrentSpeed) { 
        if (setCurrentSpeed>this._maxSpeed) this._currentSpeed=this._maxSpeed;
        else this._currentSpeed=setCurrentSpeed; 
    }

    get lastDirection() { return this._lastDirection; }
    set lastDirection(setLastDirection) {
        this._lastDirection=setLastDirection;
    }
    set lastDirChangeReason(setDirChangeReason) {
            this._lastDirChangeReason=setDirChangeReason;
    }

    get direction() { return this._direction; }
    set direction(setDirection) {
            if (this._lastDirection!==this._direction) {
                this._currentSpeed=1;
            }
            this._lastDirection=this._direction;
            this._direction=setDirection; 
    }

    get posX() { return this._posX; }
    set posX(setPosX) { 
        this._posX=setPosX; 
        this._imageDiv.style.left=this._posX+"px";
        if ( (this._currentSpeed) < (this._maxSpeed) ) {
            this._currentSpeed=this._maxSpeed;
        }
        else {
            this._currentSpeed=this._maxSpeed;
        }
    }
        
    get posY() { return this._posY; }
    set posY(setPosY) { 
        this._posY=setPosY; 
        this._imageDiv.style.top=this._posY+"px";
        if ( (this._currentSpeed) < (this._maxSpeed) ) {
            this._currentSpeed=this._maxSpeed;
        }
        else {
            this._currentSpeed=this._maxSpeed;
        }                
    }

    get posXY() { return [this._posX, this.posY];}
    set posXY([setPosX, setPosY]) {         
        this._posX=setPosX; this._posY=setPosY; 
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
        if ( (this._currentSpeed) < (this._maxSpeed) ) {
            this._currentSpeed=this._maxSpeed;
        }
        else {
            this._currentSpeed=this._maxSpeed;
        }                
    }
    
    get state() { return this._state; }
    set state(setState) { 
        if (setState!==this._state) {
            this._lastStateChange=Number(Date.now());
        }
        this._state=setState; 
    }
    
    get image() { return this._image; }
    
    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
        if (this._image["imageState"]!==setImageState) {

            //console.log(this._image["imageState"], setImageState);

            this._image["imageState"]=setImageState; 

            // Do not reset the image animations to the zero frame for special cases
            if ( (setImageState!=='Stage Hidden') && (setImageState!=='Hidden') ) {
                this._image[setImageState][2]=0;
            }

            this._lastDirChange=Number(Date.now());

            if (setImageState==="Fire Die") {
                this.applyEffectOverlay("Flame Overlay")
            }
            if (setImageState==="Bomb Die") {
                this.applyEffectOverlay("Explosion Overlay")
            }            
        }
    } 


    updateVitalsCooldown ()  { 
        // Update the health and party vitals on each game loop
        this._health=this._health+BANDMEMBER_HEALTH_RECOVERY;
        if (this._health>100) this._health=100;
        this._party=this._party-BANDMEMBER_PARTY_RECOVERY;
        if (this._party<0) this._party=0;
        // Check to see if the cooldown period has expired
        if (this.cooldown>0 && this._cooldown<Number(Date.now())) {
            this._cooldown=0;
        }
    }
    

    incrementImageAnimation() {

        const row=this._image[this._image["imageState"]][0];
        const maxCol=this._image[this._image["imageState"]][1];
        let curCol=this._image[this._image["imageState"]][2];
        
        const lastUpdate=this._image.lastUpdate;
        const currentTime=Number(Date.now());
        let newPosX=0;
        let newPosY=0;

        if ( (currentTime-lastUpdate) > ANIMATION_FRAME_DELAY ) {
            this._image.lastUpdate=currentTime;

            if (curCol>=maxCol) {
                if ( (this._image["imageState"]!=='Die') && 
                    (this._image["imageState"]!=='Stage') && 
                    (this._image["imageState"]!=='Stage Hidden') && 
                    (this._image["imageState"]!=='Hidden') && 
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

            // console.log(this._image["imageState"], curCol, row);

            newPosX=(curCol*-64);
            newPosY=(row*-64);      

            this._imagePtag.style.backgroundPosition=`${newPosX}px ${newPosY}px`;
        }
    }

    applyEffectOverlay(overlay) {
        this._effectLayer=document.createElement("img");
        this._effectLayer.setAttribute('class', 'effect-layer-character-overlay');
        this._effectLayer.setAttribute('id', this._id);
        // console.log(overlayImages[overlay]);
        this._effectLayer.setAttribute('src', overlayImages[overlay]);
        this._effectLayer.style.position="absolute";
        this._effectLayer.style.left=this._posX+"px";
        this._effectLayer.style.top=this._posY+"px";
        // this._effectLayer.style.width="64px";
        // this._effectLayer.style.height="64px";
        gameDom["gameContainerPlayfield"].appendChild(this._effectLayer);

        let thisEffectLayer=this._effectLayer;

        setTimeout( ()=> {
            //console.log(this._effectLayer);            
            gameDom["gameContainerPlayfield"].removeChild(thisEffectLayer);
            thisEffectLayer="";
        }, 3000);
    }

    processActionQueue() {

        if (this.actionQueue.isEmpty()) {
            return;
        }
        const action=this.actionQueue.peek();
        const currentTime=Date.now();

        if ( (action.durationType) && (action.durationType==="time") ) {
            if ((currentTime-action.startTime)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else this.actionQueue.dequeue();
        }
        else if ( (action.durationType) && (action.durationType==="frame") ) {
            if ((levelFrameCounter-action.startFrame)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else this.actionQueue.dequeue();
        }
        else if ( (!action.durationType) ) {
            if (action.state) this.state=action.state;
            if (action.imageState) this.imageState=action.imageState;  
            if (action.custom) { action.custom(); }
            this.actionQueue.dequeue();
        }
    }

}

/*------------------------------------------------------
// Player Class
------------------------------------------------------*/

class Player {
    constructor (playerCharacter, setName, positionX, positionY) {
        this._name=setName;
        this._id=playerCharacter.id;
        this._health=playerCharacter.health;
        this._party=playerCharacter.party;
        this._currentSpeed=1;
        this._maxSpeed=playerCharacter.speed;
        this._direction="";
        this._posX=positionX;
        this._posY=positionY;
        this._state=PLAYER_DEFAULT_STATE;
        this._lastStateChange=Number(Date.now());        
        this._image=Object.assign({}, playerCharacter.image);

        this._imageDiv=document.createElement("div");
        this._imageDiv.setAttribute('class', 'player-div');
        this._imageDiv.setAttribute('id', this._id);
        this._imageDiv.style.position="absolute";
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
        //this._imageDiv.style.border="1px solid #00ff00";
        this._imagePtag=document.createElement("p");
        this._imagePtag.setAttribute('class', "player-ptag");
        this._imagePtag.setAttribute('id', this._id + '-ptag');
        this._imagePtag.style.width="64px";
        this._imagePtag.style.height="64px";
        this._imagePtag.style.background=`url('${this._image.src}') 0px 0px`
        this._imageDiv.appendChild(this._imagePtag);
        gameDom["gameContainerPlayfield"].appendChild(this._imageDiv);

        this.actionQueue=new Queue();
    }

    get lastStateChange() { return this._lastStateChange; }

    get id() { return this._id; }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get currentSpeed() { return this._currentSpeed; }
    set currentSpeed(setCurrentSpeed) { 
        if (setCurrentSpeed>this._maxSpeed) this._currentSpeed=this._maxSpeed;
        else this._currentSpeed=setCurrentSpeed; 
    }

    get direction() { return this._direction; }
    set direction(setDirection) {
        if (this._lastDirection!==this._direction) {
            this._currentSpeed=1;
        }
        this._lastDirection=this._direction;
        this._direction=setDirection; 
    }    
    
    get posX() { return this._posX; }
    set posX(setPosX) { 
        this._posX=setPosX; 
        this._imageDiv.style.left=this._posX+"px";
        // console.log(`${this._imageDiv.style.left}`);
        if ( (this._currentSpeed) < (this._maxSpeed) ) {
            this._currentSpeed=this._maxSpeed;
        }
        else {
            this._currentSpeed=this._maxSpeed;
        }        
    }

    get posY() { return this._posY; }
    set posY(setPosY) { 
        this._posY=setPosY; 
        this._imageDiv.style.top=this._posY+"px";
        if ( (this._currentSpeed) < (this._maxSpeed) ) {
            this._currentSpeed=this._maxSpeed;
        }
        else {
            this._currentSpeed=this._maxSpeed;
        }                
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
            this._lastStateChange=Number(Date.now());
        }        
        this._state=setState; 
    }

    get image() { return this._image; }

    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
            if (this._image["imageState"]!==setImageState) {
                this._image["imageState"]=setImageState; 

                // Do not reset the image animations to the zero frame for special cases
                if ( (setImageState!=='Hidden') ) {
                    this._image[setImageState][2]=0;
                }

                if (setImageState==="Fire Die") {
                    this.applyEffectOverlay("Flame Overlay")
                }
                if (setImageState==="Bomb Die") {
                    this.applyEffectOverlay("Explosion Overlay")
                }     
            }
    }

    applyEffectOverlay(overlay) {
        this._effectLayer=document.createElement("img");
        this._effectLayer.setAttribute('class', 'effect-layer-character-overlay');
        this._effectLayer.setAttribute('id', this._id);
        this._effectLayer.setAttribute('src', overlayImages[overlay]);
        this._effectLayer.style.position="absolute";
        this._effectLayer.style.left=this._posX+"px";
        this._effectLayer.style.top=this._posY+"px";
        // this._effectLayer.style.width="64px";
        // this._effectLayer.style.height="64px";
        gameDom["gameContainerPlayfield"].appendChild(this._effectLayer);

        let thisEffectLayer = this._effectLayer;

        setTimeout( ()=> {
            // console.log(this._effectLayer);
            gameDom["gameContainerPlayfield"].removeChild(thisEffectLayer);
            thisEffectLayer="";
        }, 3000);
    }    

    updateVitalsCooldown ()  { 
        // Update the health vitals on each game loop
        this._health=this._health+BANDMEMBER_HEALTH_RECOVERY;
        if (this._health>100) this._health=100;
    }

    incrementImageAnimation() {
 
        const row=this._image[this._image["imageState"]][0];
        const maxCol=this._image[this._image["imageState"]][1];
        let curCol=this._image[this._image["imageState"]][2];
        const lastUpdate=this._image.lastUpdate;
        const currentTime=Number(Date.now());
        let newPosX=0;
        let newPosY=0;

        if ( (currentTime-lastUpdate) > ANIMATION_FRAME_DELAY ) {


            this._image.lastUpdate=currentTime;

            if (curCol>=maxCol) {
                if (    (this._image["imageState"]!=='Die') && 
                        (this._image["imageState"]!=='Pit Die') &&
                        (this._image["imageState"]!=='Hidden') && 
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

    processActionQueue() {

        if (this.actionQueue.isEmpty()) {
            return;
        }

        const action=this.actionQueue.peek();
        const currentTime=Date.now();
 
        if ( (action.durationType) && (action.durationType==="time") ) {

            if ((currentTime-action.startTime)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else {
                    this.actionQueue.dequeue();
            }
        }
        else if ( (action.durationType) && (action.durationType==="frame") ) {
            if ((levelFrameCounter-action.startFrame)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else {
                    this.actionQueue.dequeue();
            }
        }
        else if ( (!action.durationType) ) {
            if (action.state) this.state=action.state;
            if (action.imageState) this.imageState=action.imageState;  
            if (action.custom) { action.custom(); }
            this.actionQueue.dequeue();
        }
    }

}


/*-------------------------------------------
// Bullet Class
-------------------------------------------*/

class Bullet {
    constructor (bullet, direction, positionX, positionY) {
        this._id=`${bullet.id}-${levelFrameCounter}+${Math.round(Math.random()*100000)}`;
        this._currentSpeed=bullet.speed;
        this._maxSpeed=bullet.speed;
        this._direction=direction;
        this._posX=positionX;
        this._posY=positionY;
        this._state=BULLET_DEFAULT_STATE;
        this._lastStateChange=Number(Date.now());
        this._image=Object.assign({}, bullet.image);

        this._imageDiv=document.createElement("div");
        this._imageDiv.setAttribute('class', 'bullet-div');
        this._imageDiv.setAttribute('id', this._id);
        this._imageDiv.style.position="absolute";
        this._imageDiv.style.left=this._posX+"px";
        this._imageDiv.style.top=this._posY+"px";
        this._imagePtag=document.createElement("p");
        this._imagePtag.setAttribute('class', "bullet-ptag");
        this._imagePtag.setAttribute('id', this._id + '-ptag');
        this._imagePtag.style.width="32px";
        this._imagePtag.style.height="32px";
        this._imagePtag.style.background=`url('${this._image.src}') 0px 0px`
        this._imageDiv.appendChild(this._imagePtag);
        gameDom["gameContainerPlayfield"].appendChild(this._imageDiv);    
        
        this.actionQueue=new Queue();
    }

    deleteFromGameDom() {
        this._state='Collided';
        this._imageState='Hidden';
        gameDom["gameContainerPlayfield"].removeChild(this._imageDiv);
    }

    get lastStateChange() { return this._lastStateChange; }

    get id() { return this._id; }

    get currentSpeed() { return this._currentSpeed; }
    set currentSpeed(setCurrentSpeed) { 
        if (setCurrentSpeed>this._maxSpeed) this._currentSpeed=this._maxSpeed;
        else this._currentSpeed=setCurrentSpeed; 
    }

    get direction() { return this._direction; }
    set direction(setDirection) {
        if (this._lastDirection!==this._direction) {
            this._currentSpeed=1;
        }
        this._lastDirection=this._direction;
        this._direction=setDirection; 
    }    

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
            this._lastStateChange=Number(Date.now());
        }
        this._state=setState; 
    }

    get image() { return this._image; }
    
    get imageState() { return this._image["imageState"]}
    set imageState(setImageState) { 
        if (this._image["imageState"]!==setImageState) {
            this._image["imageState"]=setImageState; 

            // Do not reset the image animations to the zero frame for special cases
            if ( (setImageState!=='Hidden') ) {
                this._image[setImageState][2]=0;
            }

            this._lastDirChange=Number(Date.now());
        }
    }     

    applyEffectOverlay(overlay) {
        this._effectLayer=document.createElement("img");
        this._effectLayer.setAttribute('class', 'effect-layer-character-overlay');
        this._effectLayer.setAttribute('id', this._id);
        this._effectLayer.setAttribute('src', overlayImages[overlay]);
        this._effectLayer.style.position="absolute";
        this._effectLayer.style.left=this._posX+"px";
        this._effectLayer.style.top=this._posY+"px";
        // this._effectLayer.style.width="64px";
        // this._effectLayer.style.height="64px";
        gameDom["gameContainerPlayfield"].appendChild(this._effectLayer);

        let thisEffectLayer = this._effectLayer;

        setTimeout( ()=> {
            // console.log(this._effectLayer);
            gameDom["gameContainerPlayfield"].removeChild(thisEffectLayer);
            thisEffectLayer="";
        }, 3000);
    }    

    incrementImageAnimation() {
        const row=this._image[this._image["imageState"]][0];
        const maxCol=this._image[this._image["imageState"]][1];
        let curCol=this._image[this._image["imageState"]][2];
        const lastUpdate=this._image.lastUpdate;
        const currentTime=Number(Date.now());
        let newPosX=0;
        let newPosY=0;

        if ( (currentTime-lastUpdate) > ANIMATION_FRAME_DELAY ) {
            this._image.lastUpdate=currentTime;

            if (curCol=>maxCol) {
                if ((this._image["imageState"]!=='Shoot Left') && 
                    (this._image["imageState"]!=='Hidden') && 
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

    processActionQueue() {
        if (this.actionQueue.isEmpty()) {
            return;
        }

        const action=this.actionQueue.peek();
        const currentTime=Date.now();
 
        if ( (action.durationType) && (action.durationType==="time") ) {
            if ((currentTime-action.startTime)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else this.actionQueue.dequeue();
        }
        else if ( (action.durationType) && (action.durationType==="frame") ) {
            if ((levelFrameCounter-action.startFrame)<=action.duration) {
                if (action.state) this.state=action.state;
                if (action.imageState) this.imageState=action.imageState;
            }
            else this.actionQueue.dequeue();
        }
        else if ( (!action.durationType) ) {
            if (action.state) this.state=action.state;
            if (action.imageState) this.imageState=action.imageState;
            if (action.custom) { action.custom(); }  
            this.actionQueue.dequeue();
        }
    }

}

/*-------------------------------------------
// Queue Abstract Data Structure Class
-------------------------------------------*/

class Queue {
    constructor () {
        this._queue=[];
    }

    enqueue(element) {
        this._queue.push(element);
    }

    add(element) {
        this.enqueue(element);
    }

    dequeue() {
        return this._queue.shift();
    }

    remove() {
        return dequeue();
    }

    peek() {
        if (this._queue.length===0) return null;
        else return this._queue[0];
    }

    length() {
        return this._queue.length;
    }

    size() {
        return this.length();
    }

    isEmpty() {
        if (this._queue.length===0) return true;
        else return false;
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

// Distance Between Game Characters
function distanceBetweenCharacters(character1, character2) {
    return Math.sqrt( (character1.posX-character2.posX)**2 + (character1.posY-character2.posY)**2 );
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
            }
        }
    }

}

/*===========================================
Return Array of Living Band Members
===========================================*/

function livingBandMembers() {
    const theLiving=[];

    if ( (bandMember1.state!=="Dead") && (bandMember1.health>0) )  theLiving.push(bandMember1);
    if ( (bandMember2.state!=="Dead") && (bandMember2.health>0) )  theLiving.push(bandMember2);
    if ( (bandMember3.state!=="Dead") && (bandMember3.health>0) )  theLiving.push(bandMember3);
    if ( (bandMember4.state!=="Dead") && (bandMember4.health>0) )  theLiving.push(bandMember4);

    return theLiving;
}

/*=========================================
// Control game sounds and music
=========================================*/

function soundController(action, actionModifier, category, sound, volumeLevel) {


    try {
        if ( ( (action==="playdistinct" || action==="PlayDistinct")) && 
                  ( (actionModifier==="reset") || (actionModifier==="Reset") ) ) {
                        soundDomLookup[category][sound].setAttribute("data-is-playing-distinct", "false");
        }
        else if (action==="playdistinct" || action==="PlayDistinct") {
            if ( (!soundDomLookup[category][sound].dataset.isPlayingDistinct) || 
                 ((soundDomLookup[category][sound].dataset.isPlayingDistinct) && 
                 (soundDomLookup[category][sound].dataset.isPlayingDistinct!=='true') ) ) {

                soundDomLookup[category][sound].setAttribute("data-is-playing-distinct", "true");
                soundDomLookup[category][sound].play();
                soundDomLookup[category][sound].volume=volumeLevel;

                if (actionModifier==="loop" || actionModifier==="Loop") {
                    soundDomLookup[category][sound].loop=true;
                }
            }
        }
        else if (action==="play" || action==="Play") {
            soundDomLookup[category][sound].play();
            soundDomLookup[category][sound].volume=volumeLevel;
            if (actionModifier==="loop" || actionModifier==="Loop") {
                soundDomLookup[category][sound].loop=true;
            }
        }
        else if (action==="pause" || action==="Pause") {
            soundDomLookup[category][sound].pause();
        }
        else if (action==="resume" || action==="Resume") {
            soundDomLookup[category][sound].resume();
        }
        else if (action==="stop" || action==="Stop") {
            soundDomLookup[category][sound].pause();
        }
    }
    catch(error) {
        console.log(error);
    }
}

/*=========================================
  soundVolume Event Controller
=========================================*/

function handleSoundVolume(event) {
    
    const volumeSlider = document.querySelector('#music-volume-input');

    let volumeLevel = (volumeSlider.value/100);

    soundController("play", "", "music_score", musicScore, volumeLevel)

}

/*==============================================
  Randomly select empty playfield grid square
===============================================*/

function randomPlayfieldSquare(characterPosArray) {

let tryX=0;
let tryY=0;
let cleanSpot=false;

doContinue: do {
    tryY=(Math.round(Math.random()*(currentGameLevel.length-1)));
    tryX=(Math.round(Math.random()*(currentGameLevel[tryY].length-1)));
        
    if ((currentGameLevel[tryY][tryX]!==' ') ||  
        (currentGameLevel[tryY][tryX+1]!==' ') || 
        (currentGameLevel[tryY+1][tryX]!==' ') || 
        (currentGameLevel[tryY+1][tryX+1]!==' ')) {
            continue doContinue; 
    }

    for (let i=0; i<characterPosArray.length; i++) {
        let posX=characterPosArray[i][0];
        let posY=characterPosArray[i][1];

        if (collides(posX*32+16, posY*32+12, 32, 47, tryX*32+16, tryY*32+12, 32, 47)) {
            continue doContinue;
        }
    }
    cleanSpot=true;

} while (cleanSpot===false)

return [tryX, tryY];

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

    const randomKey = Math.round(Math.random()*100000000);
    
    modalWindow.innerHTML = `<div class="close-modal close-key-${randomKey}"><img src="./assets/skull_04.png"></div>`;
    modalWindow.innerHTML = modalWindow.innerHTML + htmlMessage;
    underModal.appendChild(modalWindow);

    const closeWindow = document.querySelector(`.close-modal.close-key-${randomKey}`);
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

    // Game levels after level 1 need the previous game board cleared and replaced
    if (currentLevel>1) {
        const previousGamePlayfield = document.querySelector('#game-playfield');
        gameDom["gameContainerPlayfield"].removeChild(previousGamePlayfield);

        const previousGamePlayfieldObjects = document.querySelectorAll('.game-playfield-object');

        // Remove the playField object matching DOM elements
        previousGamePlayfieldObjects.forEach( (element, index) => {
            element.remove();
        });
    }

    const gamePlayfield = document.createElement('div');
    gamePlayfield.setAttribute('id', 'game-playfield');
    gameDom["gameContainerPlayfield"].appendChild(gamePlayfield);

    // maxPlayfieldRow is a global variable used to reference the maximum playfield row
    maxPlayfieldRow=level.length-1;

    for (let i=0; i<=maxPlayfieldRow; i++) {
        for (let j=0; j<level[i].length; j++) {

            // maxPlayfieldCol is a global variable used to reference the maximum playfield column
            if (j>=maxPlayfieldCol) maxPlayfieldCol=j;

            const gameSquare = document.createElement('div');
            gameSquare.setAttribute('class', "game-square");            
            gameSquare.setAttribute('data-gsy', (i).toString());
            gameSquare.setAttribute('data-gsx', (j).toString());
            gameSquare.setAttribute('data-gst', level[i][j]);

            // const pTag = document.createElement('p');
            gameSquare.classList.add(playFieldAssetsClasses[level[i][j]]);
            
            if ( (level[i][j]>='a') && (level[i][j]<='p') ) {
                gameSquare.innerHTML=`<img src='${playFieldObjectImages[level[i][j]]}' data-gsy="${(i).toString()}" data-gsx="${(j).toString()}" data-gst="${level[i][j]}">`;
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
    let currentTime=Number(Date.now());
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
        else if (updateType==="Weapon") {
            if ((currentTime-lastWeaponDropTime)<WEAPON_PLAYFIELD_OBJECT_DROP_RATE) {
                return;
            }
            else {
                lastWeaponDropTime=currentTime;
            }
        }
        else if (updateType==="Party") {
            if ((currentTime-lastPartyDropTime)<PARTY_PLAYFIELD_OBJECT_DROP_RATE) {
                return;
            }
            else {
                lastPartyDropTime=currentTime;
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
    else if (updateType==='Weapon') {
        playfieldObjectType = ['c','l','m','n'][Math.round(Math.random()*3)];
    }
    else {
        playfieldObjectType = ['a','b','o','p'][Math.round(Math.random()*3)];
    }


    const playfieldImage = document.createElement('img');
    playfieldImage.setAttribute('class', "game-playfield-object");
    playfieldImage.setAttribute('data-gsx', tryX);
    playfieldImage.setAttribute('data-gsy', tryY); 
    playfieldImage.setAttribute('data-gst', playfieldObjectType);
    playfieldImage.setAttribute('src', playFieldObjectImages[playfieldObjectType]);    
    playfieldImage.style.position="absolute";
    playfieldImage.style.left=tryX*32+"px";
    playfieldImage.style.top=tryY*32+"px";
    gameDom["gameContainerPlayfield"].appendChild(playfieldImage); 
    currentGameLevel[tryY][tryX]=playfieldObjectType;          
}


/*==========================================================================
Keyboard Detection
===========================================================================*/

function handleKeyboardEvents(event) {

const currentTime=Number(Date.now());

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

    // console.log(`movePlayer1 ${player1.currentSpeed}`);

    if (player1.direction==='N') newPosY = player1.posY - player1.currentSpeed;
    if (player1.direction==='S') newPosY = player1.posY + player1.currentSpeed;
    if (player1.direction==='W') newPosX = player1.posX - player1.currentSpeed;
    if (player1.direction==='E') newPosX = player1.posX + player1.currentSpeed;
    
    stepwiseCollisionXY[0]=currentPosX;
    stepwiseCollisionXY[1]=currentPosY;
    const blockMovement=checkCollisions(player1, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    //console.log(blockMovement[0], blockMovement[1]);

    if (blockMovement[0]) {
        if ( (blockMovement[1]["collisionType"]==='Wall') || 
             (blockMovement[1]["collisionType"]==='bandMember1') || 
             (blockMovement[1]["collisionType"]==='bandMember2') || 
             (blockMovement[1]["collisionType"]==='bandMember3') || 
             (blockMovement[1]["collisionType"]==='bandMember4') ) {
                // console.log(blockMovement[1]["collisionType"]);
                soundController("play", "once", "sound_effect", "impact6", 1);
                player1.health=player1.health-0.5;
        }
    }

    if (!blockMovement[0]) {
        if ( (blockMovement[1]["collisionType"]==='Pit') ) {
        
            player1.health=0;
            player1.posX=blockMovement[1].collisionGridCol*32-16;
            player1.posY=blockMovement[1].collisionGridRow*32-32;
            soundController("play", "once", "player", "Die", 1);    
            player1.state="Dead";
            player1.imageState="Pit Die";
            return;
        }
    }


    if ( (!blockMovement[0]) && (blockMovement[1]["collision"]===true) ) {
            processPlayfieldInteractions(player1, blockMovement[1], blockMovement[1]["collisionType"]);
    }

    if (player1.direction==='N') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='S') player1.posY = stepwiseCollisionXY[1];
    if (player1.direction==='W') player1.posX = stepwiseCollisionXY[0];
    if (player1.direction==='E') player1.posX = stepwiseCollisionXY[0];

}



/*==========================================================================
Control Band Member Movement
===========================================================================*/

function moveBandMember(bandMember, actionType, checkDirection, collisionResults) {

    if ( (bandMember.state==='Stage') || (bandMember.state==='Dead') ) {

        if (actionType==="CheckOnly") {
            collisionResults.collision=false;
            collisionResults.collisionType="";
            collisionResults.collisionDomRef="";
            collisionResults.collisionDomObjType="";
            collisionResults.collisionDomObjType="";
            collisionResults.collisionGridCol="";
            collisionResults.collisionGridRow="";
            collisionResults.isAllowed=true;
        }

        return;
    }

    const currentPosX = bandMember.posX;
    const currentPosY = bandMember.posY;
    const stepwiseCollisionXY = [];
    let newPosX = currentPosX;
    let newPosY = currentPosY;

    let bounceBack=false;

    if (actionType!=="CheckOnly") {
        if (bandMember.direction==='N') newPosY = bandMember.posY - bandMember.currentSpeed;
        if (bandMember.direction==='S') newPosY = bandMember.posY + bandMember.currentSpeed;
        if (bandMember.direction==='W') newPosX = bandMember.posX - bandMember.currentSpeed;
        if (bandMember.direction==='E') newPosX = bandMember.posX + bandMember.currentSpeed;
    }
    else {
        if (checkDirection==='N') newPosY = bandMember.posY - bandMember.currentSpeed;
        if (checkDirection==='S') newPosY = bandMember.posY + bandMember.currentSpeed;
        if (checkDirection==='W') newPosX = bandMember.posX - bandMember.currentSpeed;
        if (checkDirection==='E') newPosX = bandMember.posX + bandMember.currentSpeed;        
    }

    stepwiseCollisionXY[0]=currentPosX;
    stepwiseCollisionXY[1]=currentPosY;
    const blockMovement=checkCollisions(bandMember, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    if (blockMovement[0]) {
        if ((blockMovement[1]["collisionType"]==='player1') || 
            (blockMovement[1]["collisionType"]==='bandMember1') || 
            (blockMovement[1]["collisionType"]==='bandMember2') || 
            (blockMovement[1]["collisionType"]==='bandMember3') || 
            (blockMovement[1]["collisionType"]==='bandMember4') ) {

                if ( (bandMember.party>BANDMEMBER_FIGHT_FACTOR) && (bandMember.cooldown===0) ) {  
                    const currentTime=Date.now();
                    if (bandMember.direction==='W') {

                        // console.log("Throwing Left");

                        bandMember.actionQueue.enqueue( { "state": "Fight", "imageState": "Throwing Left", "durationType": "time", "duration":  1000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

                        bandMember.actionQueue.enqueue( {"state": bandMember.state, "imageState": bandMember.imageState});

                        bandMember.actionQueue.enqueue( { custom: () => { 
                            bandMember.cooldown=BANDMEMBER_COOLDOWN;
                        } } );

                        soundController("play", "once", "bandmember", "Throwing Left", 1);

                        if (blockMovement[1]["collisionType"]==='player1')  { player1.health=player1.health-1; }
                        if (blockMovement[1]["collisionType"]==='bandMember1') bandMember1.health=bandMember1.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember2') bandMember2.health=bandMember2.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember3') bandMember3.health=bandMember3.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember4') bandMember4.health=bandMember4.health-1;
                    }              
                    else if (bandMember.direction==='E') {

                        // console.log("Throwing Right");

                        bandMember.actionQueue.enqueue( { "state": "Fight", "imageState": "Throwing Right", "durationType": "time", "duration":  1000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

                        bandMember.actionQueue.enqueue( {"state": bandMember.state, "imageState": bandMember.imageState});

                        bandMember.actionQueue.enqueue( { custom: () => { 
                            bandMember.cooldown=BANDMEMBER_COOLDOWN;
                        } } );

                        soundController("play", "once", "bandmember", "Throwing Right", 1);

                        if (blockMovement[1]["collisionType"]==='player1') { player1.health=player1.health-1; }
                        if (blockMovement[1]["collisionType"]==='bandMember1') bandMember1.health=bandMember1.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember2') bandMember2.health=bandMember2.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember3') bandMember3.health=bandMember3.health-1;
                        if (blockMovement[1]["collisionType"]==='bandMember4') bandMember4.health=bandMember4.health-1;
                    }
                    else {
                        bounceBack=true;
                        if (blockMovement[1]["collisionType"]==='player1') {
                            player1.health=player1.health-0.5;
                        }                        
                    }
                }
                else {
                    bounceBack=true;
                    if (blockMovement[1]["collisionType"]==='player1') {
                        player1.health=player1.health-0.5;
                    }
                }

            }
            else {
                if (actionType!=="CheckOnly") {
                    bandMember.lastDirChange=0;
                    if (blockMovement[1]["collisionType"]==='Wall')  {
                        bandMember.lastDirection=bandMember.direction;
                        bandMember.lastDirChangeReason='Wall';
                    }
                    else if (blockMovement[1]["collisionType"]==='Pit')  {
                        bandMember.lastDirection=bandMember.direction;
                        bandMember.lastDirChangeReason='Pit';
                    }
                }
            }
    }

    if ( (actionType!=="CheckOnly") && (!blockMovement[0]) && (blockMovement[1]["collision"]===true) ) {
        processPlayfieldInteractions(bandMember, blockMovement[1], blockMovement[1]["collisionType"]);
    }

    if ( (actionType!=="CheckOnly") && (bounceBack) ) {
            
        if (bandMember.direction==='S') newPosY = bandMember.posY - bandMember.currentSpeed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='N') newPosY = bandMember.posY + bandMember.currentSpeed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='E') newPosX = bandMember.posX - bandMember.currentSpeed*BOUNCEBACK_FACTOR;
        if (bandMember.direction==='W') newPosX = bandMember.posX + bandMember.currentSpeed*BOUNCEBACK_FACTOR;
        
        stepwiseCollisionXY[0]=currentPosX;
        stepwiseCollisionXY[1]=currentPosY;
        const blockMovement=checkCollisions(bandMember, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);
    }
 
    if (actionType!=="CheckOnly") {
        if (bandMember.direction==='N') bandMember.posY = stepwiseCollisionXY[1];
        if (bandMember.direction==='S') bandMember.posY = stepwiseCollisionXY[1];
        if (bandMember.direction==='W') bandMember.posX = stepwiseCollisionXY[0];
        if (bandMember.direction==='E') bandMember.posX = stepwiseCollisionXY[0];
    }

    if (actionType==="CheckOnly") {
        collisionResults.collision=blockMovement[1].collision;
        collisionResults.collisionType=blockMovement[1].collisionType;
        collisionResults.collisionDomRef=blockMovement[1].collisionDomRef;
        collisionResults.collisionDomObjType=blockMovement[1].collisionDomObjType;
        collisionResults.collisionDomObjType=blockMovement[1].collisionDomObjType;
        collisionResults.collisionGridCol=blockMovement[1].collisionGridCol;
        collisionResults.collisionGridRow=blockMovement[1].collisionGridRow;
        collisionResults.isAllowed=blockMovement[1].isAllowed;
    }



}




/*==========================================================================
 Return compass direction for band member to follow player
===========================================================================*/

function followDirection(player, character) {

    const currentTime=Number(Date.now());
    let direction="";
    let checkCollisionResults={};
    let failedDirections="";
    let remainingDirections=[];

    if ( (currentTime-character.lastDirChange)<BANDMEMBER_FOLLOW_CHANGE_DELAY ) {
        return character.direction;
    }

    if ( ( Math.abs(player.posX-character.posX) > Math.abs(player.posY-character.posY) )  ) {
        if (player.posX<character.posX) direction='W';
        else direction='E';
    }
    else {
        if (player.posY<character.posY) direction='N';
        else direction='S';
    }

    moveBandMember(character, "CheckOnly", direction, checkCollisionResults);

    if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
        return direction;
    }
    else {
        failedDirections=failedDirections+direction;
    }

    if ( ( Math.abs(player.posX-character.posX) > Math.abs(player.posY-character.posY) )  ) {
        if (player.posY<character.posY) direction='N';
        else direction='S';           
    }
    else {
        if (player.posX<character.posX) direction='W';
        else direction='E';
    }
    
    moveBandMember(character, "CheckOnly", direction, checkCollisionResults);

    if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
        return direction;
    }
    else {
        failedDirections=failedDirections+direction;
    }
    
    if (failedDirections.indexOf('N')===-1) remainingDirections.push('N');
    if (failedDirections.indexOf('S')===-1) remainingDirections.push('S');
    if (failedDirections.indexOf('W')===-1) remainingDirections.push('W');
    if (failedDirections.indexOf('E')===-1) remainingDirections.push('E');
    
    direction=remainingDirections[Math.round(Math.random()*(remainingDirections.length-1))];

    moveBandMember(character, "CheckOnly", direction, checkCollisionResults);

    if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
        return direction;
    }
    else {
        failedDirections=failedDirections+direction;
    }
    
    remainingDirections=[];
    if (failedDirections.indexOf('N')===-1) remainingDirections.push('N');
    if (failedDirections.indexOf('S')===-1) remainingDirections.push('S');
    if (failedDirections.indexOf('W')===-1) remainingDirections.push('W');
    if (failedDirections.indexOf('E')===-1) remainingDirections.push('E');

    direction=remainingDirections[Math.round(Math.random()*(remainingDirections.length-1))];

    if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
        return direction;
    }
    else {
        return ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
    }    
}



/*==========================================================================
Process Playfield Object Interactions
===========================================================================*/

function processPlayfieldInteractions(character, collision, collisionType) {

    const currentTime=Date.now();

    if (character.id==="player1") {
        //console.log(collision, collisionType);
        if (collisionType==="Beer") {
            player1Score+=25;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Bomb") {
            player1Score+=50;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Coin") {
            player1Score+=100;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Gem") {
            player1Score+=250;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Handgun") {
            player1Score+=175;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }        
        else if (collisionType==="Lighter") {
            player1Score+=50;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }                        
        else if (collisionType==="Pills") {
            player1Score+=50;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Wine") {
            player1Score+=250;
            soundController("play", "once", "sound_effect", "coins", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }       
    }

    else {  // Band Member playfield collisions

        if (collisionType==="Stage") {
            player1Score=player1Score+1000;
            soundController("play", "once", "sound_effect", "coins", 1);
            soundController("play", "once", "bandmember", "Stage", 1);
            character.state="Stage";
            character.imageState='Stage Hidden';

           character.actionQueue.enqueue( { "state": "Stage", "imageState": "Stage Hidden", "durationType": "time", "duration":  1000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

            bandMember.actionQueue.enqueue( { custom: () => { 
                    character.posX=-5000;
                    character.posY=-5000;
                    character.state="Stage";
                    character.imageState='Stage Hidden';                    
                } } );
    
            character.state='Stage';   
            character.imageState='Stage Hidden';            

        }

        if (collisionType==="Pit") {
            // character.posX=collision.collisionGridCol*32;
            // character.posY=collision.collisionGridRow*32;
            soundController("play", "once", "bandmember", "Die", 1);
            character.state='Dead';
            character.health=0;
            character.party=0;
            character.imageState='Pit Die';
        }

        else if (collisionType==="Beer") {
            const pick=[0,1,2,3][Math.round(Math.random()*3)];
            if (pick===0) soundController("play", "once", "bandmember", "Awesome", 1);
            if (pick===1) soundController("play", "once", "bandmember", "Guitar Riff", 1);
            if (pick===2) soundController("play", "once", "bandmember", "Ha Ha", 1);
            if (pick===3) soundController("play", "once", "bandmember", "Oh Ya", 1);
            character.health=character.health-5;
            character.party=character.party+20;
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';

            soundController("play", "once", "bandmember", "Dizzy", 1);

            character.actionQueue.enqueue( { "state": "Dizzy", "imageState": "Dizzy", "durationType": "time", "duration":  4000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

            character.actionQueue.enqueue( {"state": character.state, "imageState": character.imageState});
        }
        else if (collisionType==="Bomb") {
            if (character.hasBomb===0) {
                soundController("play", "once", "bandmember", "Oh Ya", 1);
                character.hasBomb=Number(Date.now());
                collision.collisionDomRef.remove();
                currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
            }
        }
        else if (collisionType==="Coin") {
            soundController("play", "once", "bandmember", "Ha Ha", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Gem") {
            soundController("play", "once", "bandmember", "Ha Ha", 1);
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
        }
        else if (collisionType==="Handgun") {
            if (character.hasGun===0) {
                soundController("play", "once", "bandmember", "Ha Ha", 1);
                character.hasGun=Number(Date.now());
                collision.collisionDomRef.remove();
                currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
            }
        }        
        else if (collisionType==="Lighter") {
            if (character.hasLighter===0) {
                soundController("play", "once", "bandmember", "Oh Ya", 1);
                character.haslighter=Number(Date.now());
                collision.collisionDomRef.remove();
                currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';
            }
        }                        
        else if (collisionType==="Pills") {
            const pick=[0,1,2,3][Math.round(Math.random()*3)];
            if (pick===0) soundController("play", "once", "bandmember", "Awesome", 1);
            if (pick===1) soundController("play", "once", "bandmember", "Guitar Riff", 1);
            if (pick===2) soundController("play", "once", "bandmember", "Ha Ha", 1);
            if (pick===3) soundController("play", "once", "bandmember", "Oh Ya", 1);
            character.health=character.health-20;
            character.party=character.party+50;
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';

            soundController("play", "once", "bandmember", "Dizzy", 1);

            character.actionQueue.enqueue( { "state": "Dizzy", "imageState": "Dizzy", "durationType": "time", "duration":  5000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

            character.actionQueue.enqueue( {"state": character.state, "imageState": character.imageState});
        }
        else if (collisionType==="Wine") {
            const pick=[0,1,2,3][Math.round(Math.random()*3)];
            if (pick===0) soundController("play", "once", "bandmember", "Awesome", 1);
            if (pick===1) soundController("play", "once", "bandmember", "Guitar Riff", 1);
            if (pick===2) soundController("play", "once", "bandmember", "Ha Ha", 1);
            if (pick===3) soundController("play", "once", "bandmember", "Oh Ya", 1);
            character.health=character.health-10;
            character.party=character.party+30;
            collision.collisionDomRef.remove();
            currentGameLevel[collision.collisionGridRow][collision.collisionGridCol]=' ';

            soundController("play", "once", "bandmember", "Dizzy", 1);

            character.actionQueue.enqueue( { "state": "Dizzy", "imageState": "Dizzy", "durationType": "time", "duration":  4000, "startTime": currentTime, "startFrame": levelFrameCounter,} );

            character.actionQueue.enqueue( {"state": character.state, "imageState": character.imageState} );
        }               
    }

}



/*==========================================================================
Collision Detection
===========================================================================*/

function checkCollisions(gameCharacter, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY) {

    let stepwiseX=0;
    let stepwiseY=0;

    let collisionResults={
            "collision": false,
            "collisionType": "",
            "collisionDomRef": "",
            "collisionDomObjType" : "",
            "collisionGridCol": "",
            "collisionGridRow": "",
            "isAllowed": true,
    };

    if (currentPosX-newPosX!==0) {
        if (currentPosX<newPosX) {
            let stepwiseX=currentPosX;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            while ( collisionResults.isAllowed && (stepwiseX<newPosX) )  {
                stepwiseX++;
                checkPlayfieldCollisions(gameCharacter, stepwiseX+16, currentPosY+12, 32, 47, collisionResults);
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
                checkPlayfieldCollisions(gameCharacter, stepwiseX+16, currentPosY+12, 32, 47, collisionResults);
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
                checkPlayfieldCollisions(gameCharacter, currentPosX+16, stepwiseY+12, 32, 47, collisionResults);
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
                checkPlayfieldCollisions(gameCharacter, currentPosX+16, stepwiseY+12, 32, 47, collisionResults);
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

    let returnFlag=false;

    collisionResults.collision=false;
    collisionResults.collisionType="";
    collisionResults.isAllowed=true;

    let gameGridStartRow=Math.floor(posY/32)-2; 
    if (gameGridStartRow<0) gameGridStartRow=0;

    let gameGridEndRow=Math.floor(posY/32)+2;
    if (gameGridEndRow>maxPlayfieldRow) gameGridEndRow=maxPlayfieldRow;

    gameGridStartColumn = Math.floor(posX/32)-2;
    if (gameGridStartColumn<0) gameGridStartColumn=0;

    gameGridEndColumn = Math.floor(posX/32)+2;
    if (gameGridEndColumn>maxPlayfieldCol) gameGridEndColumn=maxPlayfieldCol;

    // console.log(`${gameGridStartColumn} ${gameGridEndColumn} ${gameGridStartRow} ${gameGridEndRow} `);
    // Iterate through surrounding playfield squares to see if we will collide with a wall, exit, or pit

    for (let row=gameGridStartRow; row<=gameGridEndRow; row++) {
        for (let col=gameGridStartColumn; col<=gameGridEndColumn; col++) {

            const gridSquare = document.querySelector(`div[data-gsx='${col}'][data-gsy='${row}']`)
            const squareHas = currentGameLevel[row][col];

            // console.log(`${col} ${row} ${gridSquare}`);
            // gridSquare.style.borderTop="1px solid #ff0000";
            gridPosX=col*32;
            gridPosY=row*32;
            gridWidth=32;
            gridHeight=32;

            // Store position so this object may be processed or removed from the playfield faster
            collisionResults.collisionGridCol=col;
            collisionResults.collisionGridRow=row;
            collisionResults.collisionDomObjType=squareHas;

            if (collides(posX, posY, width, height, gridPosX, gridPosY, gridWidth, gridHeight)) {
                
                if (gridSquare.classList.contains('playfield-wall')) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    collisionResults.collision=true;
                    collisionResults.collisionType="Wall";
                    collisionResults.isAllowed=false;
                    return;
                }
                else if ( (gridSquare.classList.contains('playfield-exit')) || (gridSquare.classList.contains('playfield-exit-title')) ) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    collisionResults.collision=true;
                    collisionResults.collisionType="Stage";
                    collisionResults.isAllowed=true;
                    return;
                }
                else if (gridSquare.classList.contains('playfield-pit')) {
                    // gridSquare.style.borderTop="1px solid #00ff00";
                    if (collides(posX, posY+26, width, height/2, gridPosX, gridPosY, gridWidth, gridHeight)) {
                        collisionResults.collision=true;
                        collisionResults.collisionType="Pit";
                        collisionResults.isAllowed=true;
                        return;
                    }
                }
                
            }
        }
    }

    // Next check to see if this movement will collide with any other game character 

    if ( (gameCharacter.id!==player1.id) && (player1.health>0) && 
        (collides(posX, posY, width, height, player1.posX+16, player1.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="player1";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember1.id) && (bandMember1.health>0) &&  
        (collides(posX, posY, width, height, bandMember1.posX+16, bandMember1.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember1";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember2.id) && (bandMember2.health>0) && 
        (collides(posX, posY, width, height, bandMember2.posX+16, bandMember2.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember2";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember3.id) && (bandMember3.health>0) && 
        (collides(posX, posY, width, height, bandMember3.posX+16, bandMember3.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember3";
        collisionResults.isAllowed=false;
        return;
    }
    if ( (gameCharacter.id!==bandMember4.id) && (bandMember4.health>0) && 
        (collides(posX, posY, width, height, bandMember4.posX+16, bandMember4.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember4";
        collisionResults.isAllowed=false;
        return;
    }

    /* So far the move is allowed, but we must now iterate through surrounding playfield squares to see if the character will collide with a special playfield action item */

    for (let row=gameGridStartRow; row<=gameGridEndRow; row++) {
        for (let col=gameGridStartColumn; col<=gameGridEndColumn; col++) {

            const gridSquare = document.querySelector(`div[data-gsx='${col}'][data-gsy='${row}']`)
            const squareHas = currentGameLevel[row][col];

            // console.log(`${col} ${row} ${gridSquare}`);
            // gridSquare.style.borderTop="1px solid #ff0000";
            gridPosX=col*32;
            gridPosY=row*32;
            gridWidth=32;
            gridHeight=32;

            // Store position so this object may be processed or removed from the playfield faster
            collisionResults.collisionGridCol=col;
            collisionResults.collisionGridRow=row;
            collisionResults.collisionDomObjType=squareHas;

            if (collides(posX, posY, width, height, gridPosX, gridPosY, gridWidth, gridHeight)) {

                returnFlag=false;
                if ( squareHas==='a' || squareHas==='b' ) { 
                    collisionResults.collisionType="Beer";      
                    returnFlag=true;
                }
                else if ( squareHas==='c' ) {
                    collisionResults.collisionType="Bomb";
                    returnFlag=true;
                }
                else if ( squareHas==='h' ) {
                    collisionResults.collisionType="Coin";
                    returnFlag=true;
                }
                else if ( squareHas==='k' ) { 
                    collisionResults.collisionType="Gem";
                    returnFlag=true;
                }
                else if ( squareHas==='l' || squareHas==='m' ) { 
                    collisionResults.collisionType="Handgun";
                    returnFlag=true;
                }
                else if ( squareHas==='n' ) {
                    collisionResults.collisionType="Lighter";
                    returnFlag=true;
                }
                else if ( squareHas==='o' ) {
                    collisionResults.collisionType="Pills";
                    returnFlag=true;
                }
                else if ( squareHas==='p' ) { 
                    collisionResults.collisionType="Wine";  
                    returnFlag=true; 
                }

                if (returnFlag===true) {
                    collisionResults.collision=true;
                    collisionResults.isAllowed=true;
                    const domElement = gameDom["gameContainerPlayfield"].querySelector(`img[data-gsx='${collisionResults.collisionGridCol}'][data-gsy='${collisionResults.collisionGridRow}'][data-gst='${collisionResults.collisionDomObjType}']`);
                    collisionResults.collisionDomRef=domElement;
                    return;
                }
                
            }
        }
    }
}



/*==========================================================================
Control Bullet Movement and Collision Detection
===========================================================================*/

function moveBullet(bullet, actionType, checkDirection, collisionResults) {

    if ( (bullet.state==='Collided') ) {
        return;
    }

    const currentPosX = bullet.posX;
    const currentPosY = bullet.posY;
    const stepwiseCollisionXY = [];
    let newPosX = currentPosX;
    let newPosY = currentPosY;

    if (bullet.direction==='N') newPosY = bullet.posY - bullet.currentSpeed;
    if (bullet.direction==='S') newPosY = bullet.posY + bullet.currentSpeed;
    if (bullet.direction==='W') newPosX = bullet.posX - bullet.currentSpeed;
    if (bullet.direction==='E') newPosX = bullet.posX + bullet.currentSpeed;
  
    stepwiseCollisionXY[0]=currentPosX;
    stepwiseCollisionXY[1]=currentPosY;
    const blockMovement=checkBulletCollisions(bullet, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY);

    if (blockMovement[0]) {
        bullet.lastDirChange=0;
        if (blockMovement[1]["collisionType"]==='Wall')  {
            bullet.deleteFromGameDom();
            for (index=0; index<bullets.length; index++) {
                if (bullets[index]===bullet)  {
                    bullets.splice(index, 1);
                }
            }
            return;
        }
    }

    if (blockMovement[1]) {
        let removeBulletFlag=false;

        if ( (blockMovement[1]["collisionType"]==='player1') ) {
            soundController('play', 'once', 'sound_effect', 'death2', 1);
            player1.health=0;
            removeBulletFlag=true;
        } 

        if ( (blockMovement[1]["collisionType"]==='bandMember1') ) {
            soundController('play', 'once', 'sound_effect', 'death2',1 );
            bandMember1.health=0;
            removeBulletFlag=true;
        } 

        if ( (blockMovement[1]["collisionType"]==='bandMember2') ) {
            soundController('play', 'once', 'sound_effect', 'death2', 1);
            bandMember2.health=0;
            removeBulletFlag=true;
        } 

        if ( (blockMovement[1]["collisionType"]==='bandMember3') ) {
            soundController('play', 'once', 'sound_effect', 'death2', 1);
            bandMember3.health=0;
            removeBulletFlag=true;
        } 

        if ( (blockMovement[1]["collisionType"]==='bandMember4') ) {
            soundController('play', 'once', 'sound_effect', 'death2', 1);
            bandMember4.health=0;
            removeBulletFlag=true;
        } 

        if (removeBulletFlag===true) {
            bullet.deleteFromGameDom();
            for (index=0; index<bullets.length; index++) {
                if (bullets[index]===bullet)  {
                    bullets.splice(index, 1);
                }
            }            
        }

    }
 
    if (bullet.direction==='N') bullet.posY = stepwiseCollisionXY[1];
    if (bullet.direction==='S') bullet.posY = stepwiseCollisionXY[1];
    if (bullet.direction==='W') bullet.posX = stepwiseCollisionXY[0];
    if (bullet.direction==='E') bullet.posX = stepwiseCollisionXY[0];

}

/*==========================================================================
Collision Detection
===========================================================================*/

function checkBulletCollisions(bullet, currentPosX, currentPosY, newPosX, newPosY, stepwiseCollisionXY) {

    let stepwiseX=0;
    let stepwiseY=0;

    let collisionResults={
            "collision": false,
            "collisionType": "",
            "collisionDomRef": "",
            "collisionDomObjType" : "",
            "collisionGridCol": "",
            "collisionGridRow": "",
            "isAllowed": true,
    };

    if (currentPosX-newPosX!==0) {
        if (currentPosX<newPosX) {
            let stepwiseX=currentPosX;
            // console.log(`${stepwiseX} - ${stepwiseCollisionXY}`);
            while ( collisionResults.isAllowed && (stepwiseX<newPosX) )  {
                stepwiseX++;
                checkBulletPlayfieldCollisions(bullet, stepwiseX+5, currentPosY+12, 25, 9, collisionResults);
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
                checkBulletPlayfieldCollisions(bullet, stepwiseX+5, currentPosY+12, 25, 9, collisionResults);
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
                checkBulletPlayfieldCollisions(bullet, currentPosX+5, stepwiseY+12, 25, 9, collisionResults);
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
                checkBulletPlayfieldCollisions(bullet, currentPosX+5, stepwiseY+12, 25, 9, collisionResults);
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

function checkBulletPlayfieldCollisions(bullet, posX, posY, width, height, collisionResults) {

    let returnFlag=false;

    collisionResults.collision=false;
    collisionResults.collisionType="";
    collisionResults.isAllowed=true;

    let gameGridStartRow=Math.floor(posY/32)-2; 
    if (gameGridStartRow<0) gameGridStartRow=0;

    let gameGridEndRow=Math.floor(posY/32)+2;
    if (gameGridEndRow>maxPlayfieldRow) gameGridEndRow=maxPlayfieldRow;

    gameGridStartColumn = Math.floor(posX/32)-2;
    if (gameGridStartColumn<0) gameGridStartColumn=0;

    gameGridEndColumn = Math.floor(posX/32)+2;
    if (gameGridEndColumn>maxPlayfieldCol) gameGridEndColumn=maxPlayfieldCol;

    // console.log(`${gameGridStartColumn} ${gameGridEndColumn} ${gameGridStartRow} ${gameGridEndRow} `);
    // Iterate through surrounding playfield squares to see if we will collide with a wall, exit, or pit

    for (let row=gameGridStartRow; row<=gameGridEndRow; row++) {
        for (let col=gameGridStartColumn; col<=gameGridEndColumn; col++) {

            const gridSquare = document.querySelector(`div[data-gsx='${col}'][data-gsy='${row}']`)
            const squareHas = currentGameLevel[row][col];

            // console.log(`${col} ${row} ${gridSquare}`);
            // gridSquare.style.borderTop="1px solid #ff0000";
            gridPosX=col*32;
            gridPosY=row*32;
            gridWidth=32;
            gridHeight=32;

            // Store position so this object may be processed or removed from the playfield faster
            collisionResults.collisionGridCol=col;
            collisionResults.collisionGridRow=row;
            collisionResults.collisionDomObjType=squareHas;

            if (collides(posX, posY, width, height, gridPosX, gridPosY, gridWidth, gridHeight)) {
                
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

    // Next check to see if this movement will collide with any other game character 

    if ( (bullet.id!==player1.id) && (player1.health>0) && 
        (collides(posX, posY, width, height, player1.posX+16, player1.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="player1";
        collisionResults.isAllowed=true;
        return;
    }
    if ( (bullet.id!==bandMember1.id) && (bandMember1.health>0) &&  
        (collides(posX, posY, width, height, bandMember1.posX+16, bandMember1.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember1";
        collisionResults.isAllowed=true;
        return;
    }
    if ( (bullet.id!==bandMember2.id) && (bandMember2.health>0) && 
        (collides(posX, posY, width, height, bandMember2.posX+16, bandMember2.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember2";
        collisionResults.isAllowed=true;
        return;
    }
    if ( (bullet.id!==bandMember3.id) && (bandMember3.health>0) && 
        (collides(posX, posY, width, height, bandMember3.posX+16, bandMember3.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember3";
        collisionResults.isAllowed=true;
        return;
    }
    if ( (bullet.id!==bandMember4.id) && (bandMember4.health>0) && 
        (collides(posX, posY, width, height, bandMember4.posX+16, bandMember4.posY+12, 32, 47)) ) {
        collisionResults.collision=true;
        collisionResults.collisionType="bandMember4";
        collisionResults.isAllowed=true;
        return;
    }

}


/*=============================================================================================
// Check Line of Sight Object Detection with optional distance parameter 
==============================================================================================*/

function lineOfSight(bandMember, distance) {

// Approximation of center of character sprite used for line of site playfield searches

if ( (bandMember.posX<0) || (bandMember.posX>=1024) ) return [];
if ( (bandMember.posY<0) || (bandMember.posY>=1024) ) return [];

let hitDistance=0;

const currentPosX = bandMember.posX+16+(32/2);
const currentPosY = bandMember.posY+12+(47/2);
const currentGridRow = Math.floor(currentPosY/32);
const currentGridCol = Math.floor(currentPosX/32);

const player1GridCol=Math.floor((player1.posX+16+(32/2))/32);
const player1GridRow=Math.floor((player1.posY+12+(47/2))/32);

const bandMember1GridCol=Math.floor((bandMember1.posX+16+(32/2))/32);
const bandMember1GridRow=Math.floor((bandMember1.posY+12+(47/2))/32);

const bandMember2GridCol=Math.floor((bandMember2.posX+16+(32/2))/32);
const bandMember2GridRow=Math.floor((bandMember2.posY+12+(47/2))/32);

const bandMember3GridCol=Math.floor((bandMember3.posX+16+(32/2))/32);
const bandMember3GridRow=Math.floor((bandMember3.posY+12+(47/2))/32);

const bandMember4GridCol=Math.floor((bandMember4.posX+16+(32/2))/32);
const bandMember4GridRow=Math.floor((bandMember4.posY+12+(47/2))/32);

let lineOfSightHitResults=[];
let hitFlag=false;
let hitType="";

// Check North
hitFlag=false;
hitType="";
hitDistance=0;
for (let row=currentGridRow; row>=0; row--) {
    let squareHas = currentGameLevel[row][currentGridCol];
    hitDistance=currentGridRow-row;

    if (squareHas==='P') squareHas=' ';
    if (squareHas==='d') squareHas=' ';
    if (squareHas==='e') squareHas=' ';
    if (squareHas==='f') squareHas=' ';
    if (squareHas==='g') squareHas=' ';
    if (squareHas==='i') squareHas=' ';
    if (squareHas==='j') squareHas=' ';
    if (squareHas==='q') squareHas=' ';
    if (squareHas==='r') squareHas=' ';

    if ( (bandMember.hasBomb>0) && (squareHas==='c') ) squareHas=' ';
    if ( (bandMember.hasGun>0) && ( (squareHas==='l') || (squareHas==='m') ) ) squareHas=' ';
    if ( (bandMember.hasLighter>0) && (squareHas==='n') ) squareHas=' ';
    
    if (squareHas==='W') { hitFlag=false; hitType="Wall"; break; }
    if (squareHas!==' ') { hitFlag=true; hitType=squareHas; break; }
 
    if ( (player1GridCol===currentGridCol) && (player1GridRow===row) ) {
        hitFlag=true; hitType="player1"; break; }

    if ( (bandMember.party>BANDMEMBER_FIGHT_FACTOR) && (bandMember.cooldown===0) ) {    
        if ( (bandMember.id!=="bandMember1") && (bandMember1GridCol===currentGridCol) && (bandMember1GridRow===row) ) {
            hitFlag=true; hitType="bandMember1"; break; }
        if ( (bandMember.id!=="bandMember2") &&  (bandMember2GridCol===currentGridCol) && (bandMember2GridRow===row) ) {
            hitFlag=true; hitType="bandMember2"; break; }
        if (  (bandMember.id!=="bandMember3") && (bandMember3GridCol===currentGridCol) && (bandMember3GridRow===row) ) {
            hitFlag=true; hitType="bandMember3"; break; }
        if (  (bandMember.id!=="bandMember4") && (bandMember4GridCol===currentGridCol) && (bandMember4GridRow===row) ) {
            hitFlag=true; hitType="bandMember4"; break; }
    }
}


if ( ( (hitFlag) && (!distance) ) ||  ( (hitFlag) && (distance) && (hitDistance<=distance) ) ) {
    if (hitDistance>0) lineOfSightHitResults.push({ "direction": "N", "type": hitType, "distance": hitDistance});
}

// Check South
hitFlag=false;
hitType="";
for (let row=currentGridRow; row<=maxPlayfieldRow; row++) {
    let squareHas = currentGameLevel[row][currentGridCol];
    hitDistance=row-currentGridRow;

    if (squareHas==='P') squareHas=' ';
    if (squareHas==='d') squareHas=' ';
    if (squareHas==='e') squareHas=' ';
    if (squareHas==='f') squareHas=' ';
    if (squareHas==='g') squareHas=' ';
    if (squareHas==='i') squareHas=' ';
    if (squareHas==='j') squareHas=' ';
    if (squareHas==='q') squareHas=' ';
    if (squareHas==='r') squareHas=' ';

    if ( (bandMember.hasBomb>0) && (squareHas==='c') ) squareHas=' ';
    if ( (bandMember.hasGun>0) && ( (squareHas==='l') || (squareHas==='m') ) ) squareHas=' ';
    if ( (bandMember.hasLighter>0) && (squareHas==='n') ) squareHas=' ';

    if (squareHas==='W') { hitFlag=false; hitType="Wall"; break; }
    if ( (squareHas!=='P') && (squareHas!==' ') ) { hitFlag=true; hitType=squareHas; break; }
 
    if ( (player1GridCol===currentGridCol) && (player1GridRow===row) ) {
        hitFlag=true; hitType="player1"; break; }

    if (bandMember.party>BANDMEMBER_FIGHT_FACTOR) {        
        if ( (bandMember.id!=="bandMember1") && (bandMember1GridCol===currentGridCol) && (bandMember1GridRow===row) ) {
            hitFlag=true; hitType="bandMember1"; break; }
        if ( (bandMember.id!=="bandMember2") &&  (bandMember2GridCol===currentGridCol) && (bandMember2GridRow===row) ) {
            hitFlag=true; hitType="bandMember2"; break; }
        if (  (bandMember.id!=="bandMember3") && (bandMember3GridCol===currentGridCol) && (bandMember3GridRow===row) ) {
            hitFlag=true; hitType="bandMember3"; break; }
        if (  (bandMember.id!=="bandMember4") && (bandMember4GridCol===currentGridCol) && (bandMember4GridRow===row) ) {
            hitFlag=true; hitType="bandMember4"; break; }
    }
}

if ( ( (hitFlag) && (!distance) ) ||  ( (hitFlag) && (distance) && (hitDistance<=distance) ) ) {
    if (hitDistance>0) lineOfSightHitResults.push({ "direction": "S", "type": hitType,  "distance": hitDistance});
}

// Check West
hitFlag=false;
hitType="";
for (let col=currentGridCol; col>=0; col--) {
    let squareHas = currentGameLevel[currentGridRow][col];
    hitDistance=currentGridCol-col;

    if (squareHas==='P') squareHas=' ';
    if (squareHas==='d') squareHas=' ';
    if (squareHas==='e') squareHas=' ';
    if (squareHas==='f') squareHas=' ';
    if (squareHas==='g') squareHas=' ';
    if (squareHas==='i') squareHas=' ';
    if (squareHas==='j') squareHas=' ';
    if (squareHas==='q') squareHas=' ';
    if (squareHas==='r') squareHas=' ';

    if ( (bandMember.hasBomb>0) && (squareHas==='c') ) squareHas=' ';
    if ( (bandMember.hasGun>0) && ( (squareHas==='l') || (squareHas==='m') ) ) squareHas=' ';
    if ( (bandMember.hasLighter>0) && (squareHas==='n') ) squareHas=' ';

    if (squareHas==='W') { hitFlag=false; hitType="Wall"; break; }
    if ( (squareHas!=='P') && (squareHas!==' ') ) { hitFlag=true; hitType=squareHas; break; }
 
    if ( (player1GridCol===col) && (player1GridRow===currentGridRow) ) {
        hitFlag=true; hitType="player1"; break; }

    if (bandMember.party>BANDMEMBER_FIGHT_FACTOR) {        
        if ( (bandMember.id!=="bandMember1") && (bandMember1GridCol===col) && (bandMember1GridRow===currentGridRow) ) {
        hitFlag=true; hitType="bandMember1"; break; }
        if ( (bandMember.id!=="bandMember2") &&  (bandMember2GridCol===col) && (bandMember2GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember2"; break; }
        if (  (bandMember.id!=="bandMember3") && (bandMember3GridCol===col) && (bandMember3GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember3"; break; }
        if (  (bandMember.id!=="bandMember4") && (bandMember4GridCol===col) && (bandMember4GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember4"; break; }
    }
}

if ( ( (hitFlag) && (!distance) ) ||  ( (hitFlag) && (distance) && (hitDistance<=distance) ) ) { 
    if (hitDistance>0) lineOfSightHitResults.push({ "direction": "W", "type": hitType,  "distance": hitDistance});
}

// Check East
hitFlag=false;
hitType="";
for (let col=currentGridCol; col<=maxPlayfieldCol; col++) {
    let squareHas = currentGameLevel[currentGridRow][col];
    hitDistance=col-currentGridCol;

    if (squareHas==='P') squareHas=' ';
    if (squareHas==='d') squareHas=' ';
    if (squareHas==='e') squareHas=' ';
    if (squareHas==='f') squareHas=' ';
    if (squareHas==='g') squareHas=' ';
    if (squareHas==='i') squareHas=' ';
    if (squareHas==='j') squareHas=' ';
    if (squareHas==='q') squareHas=' ';
    if (squareHas==='r') squareHas=' ';

    if ( (bandMember.hasBomb>0) && (squareHas==='c') ) squareHas=' ';
    if ( (bandMember.hasGun>0) && ( (squareHas==='l') || (squareHas==='m') ) ) squareHas=' ';
    if ( (bandMember.hasLighter>0) && (squareHas==='n') ) squareHas=' ';

    if (squareHas==='W') { hitFlag=false; hitType="Wall"; break; }
    if ( (squareHas!=='P') && (squareHas!==' ') ) { hitFlag=true; hitType=squareHas; break; }
 
    if ( (player1GridCol===col) && (player1GridRow===currentGridRow) ) {
        hitFlag=true; hitType="player1"; break; }

    if (bandMember.party>BANDMEMBER_FIGHT_FACTOR) {        
        if ( (bandMember.id!=="bandMember1") && (bandMember1GridCol===col) && (bandMember1GridRow===currentGridRow) ) {
        hitFlag=true; hitType="bandMember1"; break; }
        if ( (bandMember.id!=="bandMember2") &&  (bandMember2GridCol===col) && (bandMember2GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember2"; break; }
        if (  (bandMember.id!=="bandMember3") && (bandMember3GridCol===col) && (bandMember3GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember3"; break; }
        if (  (bandMember.id!=="bandMember4") && (bandMember4GridCol===col) && (bandMember4GridRow===currentGridRow) ) {
            hitFlag=true; hitType="bandMember4"; break; }
    }
}

if ( ( (hitFlag) && (!distance) ) ||  ( (hitFlag) && (distance) && (hitDistance<=distance) ) ) { 
    if (hitDistance>0) lineOfSightHitResults.push({ "direction": "E", "type": hitType,  "distance": hitDistance});
}

return lineOfSightHitResults;

}


/*=============================================================================================
// Analyze Line of Sight Object Detection results and choose a direction to move 
==============================================================================================*/

function analyzeLOS(bandMember, losResults) {

const currentTime=Number(Date.now());
let direction="";
let checkCollisionResults={};
let failedDirections="";
let remainingDirections=[];


const rankedCompArray = ['S', 'player1', 'bandMember1', 'bandMember2', 'bandMember3', "bandMember4",
'o', 'p', 'a', 'b', 'l', 'm', 'n', 'c', 'h', 'k'];

for (playfieldObject of rankedCompArray ) {
    for (let i=0; i<losResults.length && (direction===""); i++) {
        if (losResults[i].type===playfieldObject) {            
            direction=losResults[i].direction;
            break;
        }
    }    
}

// console.log(`1. character=[${bandMember.name}] direction=[${direction}] remainingDirections=[${remainingDirections}] failedDirections=[${failedDirections}]`)
// console.log(losResults);
// console.log("analyze", direction);

if (direction==="") direction=['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];

moveBandMember(bandMember, "CheckOnly", direction, checkCollisionResults);

if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
    return direction;
}
else {
    failedDirections=failedDirections+direction;
}

if (failedDirections.indexOf('N')===-1) remainingDirections.push('N');
if (failedDirections.indexOf('S')===-1) remainingDirections.push('S');
if (failedDirections.indexOf('W')===-1) remainingDirections.push('W');
if (failedDirections.indexOf('E')===-1) remainingDirections.push('E');

direction=remainingDirections[Math.round(Math.random()*(remainingDirections.length-1))];

moveBandMember(bandMember, "CheckOnly", direction, checkCollisionResults);

if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
    if (direction!="") return direction;
}
else {
    failedDirections=failedDirections+direction;
}

remainingDirections=[];
if (failedDirections.indexOf('N')===-1) remainingDirections.push('N');
if (failedDirections.indexOf('S')===-1) remainingDirections.push('S');
if (failedDirections.indexOf('W')===-1) remainingDirections.push('W');
if (failedDirections.indexOf('E')===-1) remainingDirections.push('E');

direction=remainingDirections[Math.round(Math.random()*(remainingDirections.length-1))];

moveBandMember(bandMember, "CheckOnly", direction, checkCollisionResults);

if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
    return direction;
}
else {
    failedDirections=failedDirections+direction;
}

remainingDirections=[];
if (failedDirections.indexOf('N')===-1) remainingDirections.push('N');
if (failedDirections.indexOf('S')===-1) remainingDirections.push('S');
if (failedDirections.indexOf('W')===-1) remainingDirections.push('W');
if (failedDirections.indexOf('E')===-1) remainingDirections.push('E');

direction=remainingDirections[Math.round(Math.random()*(remainingDirections.length-1))];

moveBandMember(bandMember, "CheckOnly", direction, checkCollisionResults);

if ( (checkCollisionResults.collisionType!=='Wall') && (checkCollisionResults.collisionType!=='Pit') ) {
    return direction;
}
else {
    return ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
}      


}

/*=============================================================================================
// Check overlap collision between two bounding boxes, returns boolean true upon collision
==============================================================================================*/

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

    // Play the game modal background music
    soundController("stop", "loop", "music_score", musicScore, 1);
    levelModalMusic=['level1', 'level2', 'level3', 'level4'][Math.round(Math.random()*3)];
    soundController("play", "loop", "music_score", levelModalMusic, 1);

    //gameContainer.removeChild(divSplash);
    if (currentLevel===5) {
        
        const timeOnCurrentGame=(Math.floor((Number(Date.now())-gameStartTime)/1000));
        const timeOnCurrentGameStr=(timeOnCurrentGame).toString().padStart(4, '0');
        const player1ScoreStr=(player1Score).toString().padStart(6, '0');
    
        const htmlMessage = `<div class="game-instructions">
            <h2>You Won</h2>
            <h3>You Finished Level 5</h3>
        
            <div class="bt-gameover-outer">

            <div class="bt-gameover-item">                    
                 <p>LEVEL: <span class="game-value">${currentLevel}</span></p> 
            </div>

            <div class="bt-gameover-item">                    
                 <p><nobr>PLAYER: <span class="game-value">${player1.name}</span></nobr></p>
            </div>

            <div class="bt-gameover-item">                    
                 <p>SCORE: <span class="game-value">${player1ScoreStr}</span></p>
            </div>

            <div class="bt-gameover-item">                    
                 <p>TIME: <span class="game-value"><nobr>${timeOnCurrentGameStr}</nobr></span></p>
            </div>
            </div>
    
            <p class="start-new-game">You can click below to start a new game.</p>

            <button id="startGameButton">Start New Game</button>
            
        </div>
        `;

        displayModalDialog("", body, "500px", "", htmlMessage);

        const startGameButton = document.querySelector('#startGameButton');
        startGameButton.addEventListener('click', () => {
            soundController("stop", "loop", "music_score", levelModalMusic, 1);
            window.location="index.html";
        } );

    }
    else {
        let stageCount=0;
        let deadCount=0;
        let memToken1='';
        let memToken2='';
        let messageToken1='';

        for (bandmember of [bandMember1, bandMember2, bandMember3, bandMember4]) {
            if (bandmember.state==='Dead') deadCount++;
            if ( (bandmember.state==='Stage') || (bandmember.state==='Stage Hidden') ) stageCount++;
        }

        if (stageCount!=1) memToken1='members'; 
        else memToken1='member';

        if (deadCount!=1) memToken2='members'; 
        else memToken2='member';

        if (deadCount>0) {
            messageToken=`Luckily, the band doctor can revive them for the next round, but try to 
            be more careful. `;
        }
        else {
            messageToken=`Nice work, but the next round is going to get harder. `
        }

        const htmlMessage = `<div class="game-instructions">
            <h3>You Finished Level ${currentLevel}</h3>
            
            <p>You led <u>${stageCount}</u> band ${memToken1} to the stage for their performance and 
            <u>${deadCount}</u> ${memToken2} of the band <nobr>Bad Tendencies</nobr> died during that level. ${messageToken} Click below to start the next level.</p>

             <button id="nextLevelButton">Start Next Level</button>
            
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

const promptGameStartId = setTimeout(promptGameStart, 3000);

// Prompt Player for Game Start

function promptGameStart() {
    const divSplash = document.querySelector('#outerSplash');

    //gameContainer.removeChild(divSplash);

    const htmlMessage = `<div class="game-instructions">
        <h3>Game Instructions</h3>
           
        <p>You are the band manager for the rock band <nobr><em><u>Bad Tendencies</u></em></nobr>.
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

    loadGameSounds();

    soundController("stop", "loop", "music_score", levelModalMusic, 1);

    const player1TextInput = document.querySelector('.nameInput');
    let player1Name="Player 1";

    if (player1TextInput && player1TextInput.value) {
        player1Name = player1TextInput.value;
        if (player1Name.length>20) {
            player1Name = player1Name.slice(1, 20);
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
            <div>
                <label for="volume" id="music-volume">Music</label>
                <input type="range" name="volume" min="0" max="100" id="music-volume-input">
            </div>                        
        </div>
    `;
    const headerStartGameButton=gameContainerHeader.querySelector('#headerStartGameButton');
    headerStartGameButton.addEventListener('click', () => {
        soundController("stop", "loop", "music_score", levelModalMusic, 1);
        window.location='index.html';
    } );

    const headerQuitGameButton=gameContainerHeader.querySelector('#headerQuitGameButton');
    headerQuitGameButton.addEventListener('click', gameOver);

    const headerMusicVolume=gameContainerHeader.querySelector('#music-volume-input');
    headerMusicVolume.addEventListener('click', handleSoundVolume);

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

    let randX=0;
    let randY=0;
    let characterPosArray=[];

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    player1 = new Player(playerCharacters[0], player1Name, randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember1 = new BandMember(bandMemberCharacters[0], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember2 = new BandMember(bandMemberCharacters[1], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember3 = new BandMember(bandMemberCharacters[2], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember4 = new BandMember(bandMemberCharacters[3], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    displayCharacterStatus("initialize");

    handleKeyboardEvents("");

    levelStartTime=Number(Date.now());
    gameStartTime=levelStartTime;
    levelFrameCounter=0;
    gameOverFlag=false;
    gameLevelUpFlag=false;
    
    // Play the game background music
    musicScore=['main1', 'main2', 'main3', 'main4', 'main5'][Math.round(Math.random()*4)];
    soundController("play", "loop", "music_score", musicScore, 1);

    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);
}


/*=============================
    Start Next Level of Game
==============================*/

function startNextLevel(event) {

    event.preventDefault();

    soundController("stop", "loop", "music_score", levelModalMusic, 1);    

    const player1Name = player1.name;

    // Increase the difficulty
    GOOD_PLAYFIELD_OBJECT_DROP_RATE=GOOD_PLAYFIELD_OBJECT_DROP_RATE*1.2; // milliseconds
    WEAPON_PLAYFIELD_OBJECT_DROP_RATE=WEAPON_PLAYFIELD_OBJECT_DROP_RATE*.8; // milliseconds
    PARTY_PLAYFIELD_OBJECT_DROP_RATE=PARTY_PLAYFIELD_OBJECT_DROP_RATE*.8; // milliseconds
   
    const underModal = document.querySelector("div.under-modal");
    body.removeChild(underModal);
    
    currentLevel=currentLevel+1;

    if (currentLevel===1) currentGameLevel=gameLevel1;
    if (currentLevel===2) currentGameLevel=gameLevel2;
    if (currentLevel===3) currentGameLevel=gameLevel3;
    if (currentLevel===4) currentGameLevel=gameLevel4;
    if (currentLevel===5) currentGameLevel=gameLevel5;

   /*=== Optional Level Adjustments - Character Speed, Party Level ====*/

   for (bandmember of bandMemberCharacters) {
        // bandmember.currentSpeed=bandmember.currentSpeed+1;
        if (currentLevel===2) bandmember.party=20;
        if (currentLevel===3) bandmember.party=30;
        if (currentLevel===4) bandmember.party=40;
        if (currentLevel===5) bandmember.party=50;
    }

    for (player of playerCharacters) {
        // player.currentSpeed=player.currentSpeed+1;
    }

/*=============================*/


    displayGameBoard(currentGameLevel);

    const player1Div = document.querySelector('#player1');
    const bandMember1Div = document.querySelector('#bandMember1');
    const bandMember2Div = document.querySelector('#bandMember2');
    const bandMember3Div = document.querySelector('#bandMember3');
    const bandMember4Div = document.querySelector('#bandMember4');
    
    gameDom["gameContainerPlayfield"].removeChild(player1Div);
    gameDom["gameContainerPlayfield"].removeChild(bandMember1Div);
    gameDom["gameContainerPlayfield"].removeChild(bandMember2Div);
    gameDom["gameContainerPlayfield"].removeChild(bandMember3Div);
    gameDom["gameContainerPlayfield"].removeChild(bandMember4Div);

    let randX=0;
    let randY=0;
    let characterPosArray=[];

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    player1 = new Player(playerCharacters[0], player1Name, randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember1 = new BandMember(bandMemberCharacters[0], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember2 = new BandMember(bandMemberCharacters[1], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember3 = new BandMember(bandMemberCharacters[2], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    [randX, randY] = randomPlayfieldSquare(characterPosArray);
    bandMember4 = new BandMember(bandMemberCharacters[3], randX*32, randY*32);
    characterPosArray.push([randX, randY]);

    displayCharacterStatus("initialize");   

    handleKeyboardEvents("");

    levelStartTime=Number(Date.now());
    levelFrameCounter=0;
    gameOverFlag=false;
    gameLevelUpFlag=false;
    
    // Play the game background music
    musicScore=['main1', 'main2', 'main3', 'main4', 'main5'][Math.round(Math.random()*4)];
    soundController("play", "loop", "music_score", musicScore, 1);

    mainGameLoopIntervalId = window.setInterval(mainGameLoop, 100);
}


/*======================================
    Display Scoreboard Status
=======================================*/

function displayScoreBoard() {

    let localPlayer1Name="";
    const timeOnCurrentGame=(Math.floor((Number(Date.now())-gameStartTime)/100));
    const timeOnCurrentGameStr=(timeOnCurrentGame).toString().padStart(4, '0');
    const player1ScoreStr=(player1Score).toString().padStart(5, '0');

    gameDom["gameContainerScoreboard"].innerHTML = `
    <div class="bt-scoreboard-outer">
        <div class="bt-scoreboard-item-level">                    
             <p>LEVEL: <span class="scoreboard-value">${currentLevel}</span></p> 
        </div>
        <div class="bt-scoreboard-item-player">                    
             <p><nobr>PLAYER: <span class="scoreboard-value">${player1.name}</span></nobr></p>
        </div>
        <div class="bt-scoreboard-item-score">                    
             <p>SCORE: <span class="scoreboard-value">${player1ScoreStr}</span></p>
        </div>
        <div class="bt-scoreboard-item-time">                    
             <p>TIME: <span class="scoreboard-value"><nobr>${timeOnCurrentGameStr}</nobr></span></p>
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
                <img src="${overlayImages['Gun Overlay']}" alt="Gun" class="bt-character-overlay gun${bandMember1.id}">
                <img src="${overlayImages['Bomb Overlay']}" alt="Bomb" class="bt-character-overlay bomb${bandMember1.id}">
                <img src="${overlayImages['Lighter Overlay']}" alt="Lighter" class="bt-character-overlay lighter${bandMember1.id}">
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
                <img src="${overlayImages['Gun Overlay']}" alt="Gun" class="bt-character-overlay gun${bandMember2.id}">
                <img src="${overlayImages['Bomb Overlay']}" alt="Bomb" class="bt-character-overlay bomb${bandMember2.id}">
                <img src="${overlayImages['Lighter Overlay']}" alt="Lighter" class="bt-character-overlay lighter${bandMember2.id}">
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
                <img src="${overlayImages['Gun Overlay']}" alt="Gun" class="bt-character-overlay gun${bandMember3.id}">
                <img src="${overlayImages['Bomb Overlay']}" alt="Bomb" class="bt-character-overlay bomb${bandMember3.id}">
                <img src="${overlayImages['Lighter Overlay']}" alt="Lighter" class="bt-character-overlay lighter${bandMember3.id}">
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
                <img src="${overlayImages['Gun Overlay']}" alt="Gun" class="bt-character-overlay gun${bandMember4.id}">
                <img src="${overlayImages['Bomb Overlay']}" alt="Bomb" class="bt-character-overlay bomb${bandMember4.id}">
                <img src="${overlayImages['Lighter Overlay']}" alt="Lighter" class="bt-character-overlay lighter${bandMember4.id}">
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
                <img src="${overlayImages['Health Overlay']}" alt="Health Warning" class="bt-character-underlay healthPlayer1">
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

        if (player1.health<=25)   { 
            const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-underlay.healthPlayer1`); 
            overlayTarget.style.visibility="visible";
        } else {
            const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-underlay.healthPlayer1`); 
            overlayTarget.style.visibility="hidden";
        }

        bandMember1HealthBar.style.width = ((bandMember1.health/100)*120+1).toString()+"px";
        bandMember1PartyBar.style.width = ((bandMember1.party/100)*120+1).toString()+"px";

        bandMember2HealthBar.style.width = ((bandMember2.health/100)*120+1).toString()+"px";
        bandMember2PartyBar.style.width = ((bandMember2.party/100)*120+1).toString()+"px";

        bandMember3HealthBar.style.width = ((bandMember3.health/100)*120+1).toString()+"px";
        bandMember3PartyBar.style.width = ((bandMember3.party/100)*120+1).toString()+"px";

        bandMember4HealthBar.style.width = ((bandMember4.health/100)*120+1).toString()+"px";
        bandMember4PartyBar.style.width = ((bandMember4.party/100)*120+1).toString()+"px";

        // Hide or display each band member's possession of a gun, bomb, or lighter
        for (bandMember of [bandMember1, bandMember2, bandMember3, bandMember4] )
        {
            // console.log(bandMember);
            if (bandMember.hasGun>0)   { 
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.gun${bandMember.id}`); 
                overlayTarget.style.visibility="visible";
            }
            else {
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.gun${bandMember.id}`); 
                overlayTarget.style.visibility="hidden";
            }
            if (bandMember.hasBomb>0)   { 
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.bomb${bandMember.id}`); 
                overlayTarget.style.visibility="visible";
            }
            else {
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.bomb${bandMember.id}`); 
                overlayTarget.style.visibility="hidden";
            }
            if (bandMember.hasLighter>0)   { 
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.lighter${bandMember.id}`); 
                overlayTarget.style.visibility="visible";
            }
            else {
                const overlayTarget = gameDom["gameContainerCharacters"].querySelector(`img.bt-character-overlay.lighter${bandMember.id}`); 
                overlayTarget.style.visibility="hidden";
            }
        }


    }


}

/*==========================
    Game Over
===========================*/

function gameOver() {
    
    const divSplash = document.querySelector('#outerSplash');

    soundController("stop", "loop", "music_score", levelModalMusic, 1);

    // Play the game modal background music
    soundController("stop", "loop", "music_score", musicScore, 1);
    levelModalMusic=['level1', 'level2', 'level3', 'level4'][Math.round(Math.random()*3)];
    soundController("play", "loop", "music_score", levelModalMusic, 1);    

    //gameContainer.removeChild(divSplash);
    const timeOnCurrentGame=(Math.floor((Number(Date.now())-gameStartTime)/1000));
    const timeOnCurrentGameStr=(timeOnCurrentGame).toString().padStart(4, '0');
    const player1ScoreStr=(player1Score).toString().padStart(6, '0');

    const htmlMessage = `<div class="game-instructions">
        <h3>Game Over</h3>
    
        <div class="bt-gameover-outer">

        <div class="bt-gameover-item">                    
             <p>LEVEL: <span class="game-value">${currentLevel}</span></p> 
        </div>

        <div class="bt-gameover-item">                    
             <p><nobr>PLAYER: <span class="game-value">${player1.name}</span></nobr></p>
        </div>

        <div class="bt-gameover-item">                    
             <p>SCORE: <span class="game-value">${player1ScoreStr}</span></p>
        </div>

        <div class="bt-gameover-item">                    
             <p>TIME: <span class="game-value"><nobr>${timeOnCurrentGameStr}</nobr></span></p>
        </div>
        </div>

        <button id="startGameButton">Start New Game</button>
        <p class="game-credits-link"><a href="#" id="gameCreditsLink">Bad Tendencies Game Credits</a></p>
        
    </div>
    `;

    displayModalDialog("", body, "500px", "", htmlMessage);

    const starGameButton = document.querySelector('#startGameButton');
    startGameButton.addEventListener('click', () => {
        soundController("stop", "loop", "music_score", levelModalMusic, 1);    
        window.location="index.html";
    } );   
    
    const displayCredits = document.querySelector('#gameCreditsLink');
    displayCredits.addEventListener('click', displayGameCredits);
}

/*==========================
    Game Credits
===========================*/

function displayGameCredits(event) {

    const htmlMessage = `<div class="game-credits-modal">
    <h3>Game Credits</h3>

    <p>
        <span class="ckey">Developer:</span> 
        <span class="cvalue">Harry Anastopoulos</span>
    </p>

    <p>
        <span class="ckey">Technologies Used:</span> 
        <span class="cvalue">HTML 5, CSS2/3, JavaScript ES6</span>
    </p>

    <p>
        <span class="ckey">Graphics and Audio Tools:</span> 
        <span class="cvalue">Adobe Photoshop, Audacity</span>
    </p>

    <p>
        <span class="ckey">Fonts:</span> 
        <span class="cvalue">MyFonts: Graveblade-Regular, Hedgerow-Regular; Google Fonts: Bevan, Saira Stencil, UniFraktur;
        Webfont: Graveblade-Regular by Typodermic
        URL: <a href="https://www.myfonts.com/fonts/typodermic/graveblade/regular/" target="_blank">https://www.myfonts.com/fonts/typodermic/graveblade/regular/</a>
        Copyright: Copyright (c) 2008-2010 Typodermic Fonts. This font is not freely distributable. Visit typodermic.com for more info.
        Webfont: Hedgerow-Regular by Typodermic
        URL: <a href="https://www.myfonts.com/fonts/typodermic/hedgerow/regular/" target="_blank">https://www.myfonts.com/fonts/typodermic/hedgerow/regular/</a>
        Copyright: Copyright (c) 2008-2021 Typodermic Fonts Inc. All rights reserved.</span>
    </p>

    <p>
        <span class="ckey">Sprites and Graphic Media:</span> 
        <span class="cvalue">OpenGameArt.org <a href="https://www.opengameart.org" target="_blank">https://www.opengameart.org</a>, PARPG on OpenGameArt.org, MedicineStorm on OpenGameArt.org, Tin Tachyon on OpenGameArt.org;</span>
    </p>

    <p>
        <span class="ckey">Sound Effects and Music:</span> 
        <span class="cvalue">Chosic, Loyalty Freak Music: 
        <a href="https://www.chosic.com/" target="_blank">https://www.chosic.com/</a></span>; Clearside, <a href="https://www.clearsidemusic.com/" target="_blank">https://www.clearsidemusic.com/</a>, <a href="" target="_blank">https://www.soundcloud.com/clearside</a>, Clearside Sandblaster; "The Essential Retro Video Game Sound Effects Collection" by Juhani Junkala <a href="https://www.youtube.com/watch?v=dbACpSy9FWY" target="_blank">https://www.youtube.com/watch?v=dbACpSy9FWY</a>, juhani.junkala@musician.org;</span>
    </p>

    <p class="copyright-modal">&copy; Copyright 2021, Harry Anastopoulos, All RIghts Reserved.  No claim is made against the copyright rights of any of the respective copyright holders for the Creative Commons audio, media, music, sound effects, sprites, or graphics utilized in this open source game project.</p>

    </div>
    `;

    displayModalDialog("", body, "700px", "", htmlMessage);

}


/*==================================================================================================
Main Game Loop
===================================================================================================*/

function mainGameLoop(event) {

// Utilized for the display of elapsed time and timed interaction based on elapsed time in seconds
const currentTime=Number(Date.now());

// Utilized to control action queues and timed interactions based on game frames
levelFrameCounter++;

// console.log("Starting mainGameLoop");

// Update the health and other status items of the game characters
displayCharacterStatus("update");

// Display the Scoreboard header
displayScoreBoard();

// Check if the player is Dead
if (player1.health<=0) {
    player1.health=0;

    soundController("playdistinct", "once", "player", "Die", 1);
    soundController("stop", "loop", "sound_effect", "low_health", 1);

    if (player1.state!=='Dead') {
        player1.state='Dead';
        player1.imageState='Die';
    }

    player1.incrementImageAnimation();

    if ( (currentTime-player1.lastStateChange)>3000 )
    {
        soundController("playdistinct", "reset", "player", "Die", 1);
        gameStatus="Game Over";
        clearInterval(mainGameLoopIntervalId);
        gameOver();
        return;
    }
    else {
        return;
    }
}
if ( (player1.health>0) && (player1.health<35) ) {
    soundController("play", "loop", "sound_effect", "low_health", (1-(player1.health/35)) );
}
else 
{
    soundController("stop", "loop", "sound_effect", "low_health", 1);
}

// Check to See if All Band Members Have Died, Which is a Game Over scenario
if  ( (bandMember1.state==="Dead") && (bandMember2.state==="Dead") && 
      (bandMember3.state==="Dead") && (bandMember4.state==="Dead") ) {

    // If all band members are dead, wait 3 seconds before proceeding to allow for animations and 
    // sounds to play and complete.
    if (gameOverFlag===false) {
        gameOverFlag=true;
        setTimeout( ()=>{
                clearInterval(mainGameLoopIntervalId); 
                gameOver();
        }, 3000);
    }
}
// Check to See if All Band Members Have Entered the Stage
else if  (    ( (bandMember1.state==="Stage") || (bandMember1.state==="Dead") ) && 
         ( (bandMember2.state==="Stage") || (bandMember2.state==="Dead") ) && 
         ( (bandMember3.state==="Stage") || (bandMember3.state==="Dead") ) && 
         ( (bandMember4.state==="Stage") || (bandMember4.state==="Dead") ) ) {
    // If we have completed the level, wait 3 seconds before proceeding to allow for animations and 
    // sounds to play and complete.
    if (gameLevelUpFlag===false) {
        gameLevelUpFlag=true;
        setTimeout( ()=>{
                clearInterval(mainGameLoopIntervalId); 
                gameLevelUp();
        }, 3000);
    }
}


// Next check the player's keyboard actions
if (currentKeysPressed.pressedKeys.has('ArrowUp')) { 
    player1.direction='N'; 
    player1.state='Walk Up';
    player1.imageState="Walk Up"
}
else if (currentKeysPressed.pressedKeys.has('ArrowDown')) {
    player1.direction='S';
    player1.state='Walk Down';
    player1.imageState="Walk Down"
}
else if (currentKeysPressed.pressedKeys.has('ArrowLeft')) {
    player1.direction='W';
    player1.state='Walk Left';
    player1.imageState='Walk Left';
}
else if (currentKeysPressed.pressedKeys.has('ArrowRight')) {
    player1.direction='E';
    player1.state='Walk Right';
    player1.imageState="Walk Right"
}
else {
    player1.direction='';
    if ( player1.state==='Walk Left' || player1.state==='Walk Down' || 
        player1.state==='Idle Left') {
        player1.state='Idle Left';
        player1.imageState="Idle Left"
    }
    else {
        player1.state='Idle Right';
        player1.imageState='Idle Right';
    }
}

movePlayer1();

// Check to see if any band members should be Dead

for (let bandMember of [bandMember1, bandMember2, bandMember3, bandMember4] ) {
    if (bandMember.health<=0) {
        bandMember.health=0;
        bandMember.party=0;

        if (bandMember.state!=='Dead') {
            bandMember.state='Dead';   
            bandMember.imageState="Die";            
            soundController("play", "", "bandmember", "Die", 1);
    
            bandMember.actionQueue.enqueue( { "state": "Dead", "imageState": "Die", "durationType": "time", "duration":  2000, "startTime": currentTime, "startFrame": levelFrameCounter,} );
        }

        bandMember.actionQueue.enqueue( { custom: () => { 
                bandMember.posX=-5000;
                bandMember.posY=-5000;
                bandMember.state='Dead';
                bandMember.imageState="Die";
        } } );


    }
}

// Check line of site interactions for Band Members
const bandMember1LOS=lineOfSight(bandMember1, "");
const bandMember2LOS=lineOfSight(bandMember2, "");
const bandMember3LOS=lineOfSight(bandMember3, "");
const bandMember4LOS=lineOfSight(bandMember4, "");

// if (bandMember1LOS.length>0) console.log("BM1", bandMember1LOS);
// if (bandMember2LOS.length>0) console.log("BM2", bandMember2LOS);
// if (bandMember3LOS.length>0) console.log("BM3", bandMember3LOS);
// if (bandMember4LOS.length>0) console.log("BM4", bandMember4LOS);

// Check for gun, lighter, bomb interactions 
// Random deaths can occur based on bandMembers' "party" intoxication level 


for (let bandMember of livingBandMembers()) {

    if (bandMember.hasLighter>0) {
        if (Math.random()<(bandMember.party/200)) {
            bandMember.health=0;
            bandMember.party=0;
            bandMember.state="Dead";
            bandMember.imageState="Fire Die";
            soundController("play", "", "sound_effect", "death2", 1);
        }
    }

    if (bandMember.hasBomb>0) {
        if (Math.random()<(bandMember.party/200)) {
            bandMember.health=0;
            bandMember.party=0;
            bandMember.state="Dead";
            bandMember.imageState="Bomb Die";
            soundController("play", "", "sound_effect", "death1", 1);
            soundController("play", "", "sound_effect", "bigexplosion", 1);
        }
    }

    if ( (bandMember.hasGun>0) && (bandMember.gunBullets>0) && (bandMember.cooldown===0) ) {
        if (bandMember===bandMember1) bandMemberLOS=bandMember1LOS;
        else if (bandMember===bandMember2) bandMemberLOS=bandMember2LOS;
        else if (bandMember===bandMember3) bandMemberLOS=bandMember3LOS;
        else if (bandMember===bandMember4) bandMemberLOS=bandMember4LOS;

        if (bandMemberLOS.length>0) {

            let gunTarget=false;

            bandMemberLOS.sort( (losA, losB) => {
                return [-1, 0, 1][Math.round(Math.random()*2)];
            } );

            let index=0;
            for (let i=0; i<bandMemberLOS.length; i++) {
                if ( (bandMemberLOS[i].direction!=='W') && (bandMemberLOS[i].direction!=='E') ) {
                    continue;
                }
                index=i;
                if (bandMemberLOS[i].type==="bandMember1") gunTarget=true;
                if (bandMemberLOS[i].type==="bandMember2") gunTarget=true;
                if (bandMemberLOS[i].type==="bandMember3") gunTarget=true;
                if (bandMemberLOS[i].type==="bandMember4") gunTarget=true;
                if (bandMemberLOS[i].type==="player1") gunTarget=true;
                if (gunTarget) break;
            }

            if ( (gunTarget) && (Math.random()<(bandMember.party/200)) ) {
        
                if (bandMemberLOS[index].direction==='W') {
                    bandMember.actionQueue.enqueue( { "state": "Shoot Left", "imageState": "Shoot Left", "durationType": "frame", "duration":  5, "startTime": currentTime, "startFrame": levelFrameCounter,} );
                    bandMember.actionQueue.enqueue( { "state": "Wander", "imageState": "Walk Left"} );
                }
                else if (bandMemberLOS[index].direction==='E') { 
                    const currentState=bandMember.state;
                    const currentImageState=bandMember.imageState;                    
                    bandMember.actionQueue.enqueue( { "state": "Shoot Right", "imageState": "Shoot Right", "durationType": "frame", "duration":  5, "startTime": currentTime, "startFrame": levelFrameCounter,} );
                    bandMember.actionQueue.enqueue( { "state": "Wander", "imageState": "Walk Right"} );
                }
                soundController("play", "", "sound_effect", "shotgun", 1);
                bandMember.cooldown=BANDMEMBER_COOLDOWN;
                bandMember.decrementGunBullets();

                const newBullet = new Bullet(bulletTypes[0], bandMemberLOS[index].direction, bandMember.posX, bandMember.posY);
                bullets.push(newBullet);
            }
        }
    }    
}


// Check to see if any band members should change in or out of the follow state

for (let bandMember of livingBandMembers()) {

    if ( (bandMember.state==='Follow') && (distanceBetweenCharacters(player1, bandMember)>FOLLOW_DISTANCE) ) {
        bandMember.state='Wander';
    }
    else if ( (bandMember.state==='Wander') && (distanceBetweenCharacters(player1, bandMember)<FOLLOW_DISTANCE) ) {
        bandMember.state='Follow';
    }
}


// Process band members that are in the follow state

for (let bandMember of livingBandMembers()) {
    if (bandMember.state==='Follow') {
        const direction=followDirection(player1, bandMember);
        bandMember.direction=direction;
        bandMember.imageState=directionToImageState[direction];
        moveBandMember(bandMember, "", "", "");
    }
}


// Process the band members that are in the Wander state

for (let bandMember of livingBandMembers()) {
    // console.log(bandMember);
    let bandMemberLOS={};

    if (bandMember===bandMember1) bandMemberLOS=bandMember1LOS;
    else if (bandMember===bandMember2) bandMemberLOS=bandMember2LOS;
    else if (bandMember===bandMember3) bandMemberLOS=bandMember3LOS;
    else if (bandMember===bandMember4) bandMemberLOS=bandMember4LOS;

    if (bandMember.state==='Wander') {
        if ( (bandMemberLOS.length>0) /*&& ( (currentTime-bandMember.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )*/ ) {
            const losDirection=analyzeLOS(bandMember, bandMemberLOS);
            bandMember.direction=losDirection;
            bandMember.imageState=directionToImageState[losDirection];
        }
        else if ( (currentTime-bandMember.lastDirChange)>BANDMEMBER_DIR_CHANGE_DELAY )
        {
            const randomDirection = ['N', 'S', 'W', 'E'][Math.round(Math.random()*3)];
            bandMember.direction=randomDirection;
            bandMember.imageState=directionToImageState[randomDirection];
        }    
        moveBandMember(bandMember, "", "", "");
    }
}

// Next, process character actionQueues
player1.processActionQueue();
bandMember1.processActionQueue();
bandMember2.processActionQueue();
bandMember3.processActionQueue();
bandMember4.processActionQueue();


// Next, update animations as necessary
player1.incrementImageAnimation();
bandMember1.incrementImageAnimation();
bandMember2.incrementImageAnimation();
bandMember3.incrementImageAnimation();
bandMember4.incrementImageAnimation();

// Process, bullet animations and movements 
for (let i=0; i<bullets.length; i++) {
    //console.log(bullets[i])
    bullets[i].processActionQueue();
    bullets[i].incrementImageAnimation();
    moveBullet(bullets[i]);
}


//Next, update player and band member health and party levels
if ( (player1.state!=="Dead") && (player1.health>0) ) player1.updateVitalsCooldown();
if ( (bandMember1!=="Dead") && (bandMember1.health>0) ) bandMember1.updateVitalsCooldown();
if ( (bandMember2!=="Dead") && (bandMember2.health>0) ) bandMember2.updateVitalsCooldown();
if ( (bandMember3!=="Dead") && (bandMember3.health>0) ) bandMember3.updateVitalsCooldown();
if ( (bandMember4!=="Dead") && (bandMember4.health>0) ) bandMember4.updateVitalsCooldown();

// Randomly drop playFIeld objects onto game board
dropPlayfieldObject("Good");
dropPlayfieldObject("Weapon");
dropPlayfieldObject("Party");

// Cleared the cached Set of keyboard clicks.
currentKeysPressed.pressedKeys.clear();

// Only uncomment the following line if single game loop debugging is necessary
// clearInterval(mainGameLoopIntervalId);

} 

/*==============================================================================*/









