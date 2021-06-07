
/*==========================================================================
Global Game Settings
===========================================================================*/

const gameStatus='Splash Screen';
const BANDMEMBER_DEFAULT_STATE="wander";
const PLAYER_DEFAULT_STATE="chase";

/*==========================================================================
Band Member Characters
===========================================================================*/

const bandMemberCharacters=[
    {
        "name" : 'AXL',
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image_up" : '/assets/axl_up',
        "image_down" : '/assets/axl_down',
        "image_left" : '/assets/axl_left',
        "image_right" : '/assets/axl_right',
        "image_die" : '/assets/axl_die',
    },
    {
        "name" : 'Vince',
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image_up" : '/assets/vince_up',
        "image_down" : '/assets/vince_down',
        "image_left" : '/assets/vince_left',
        "image_right" : '/assets/vince_right',
        "image_die" : '/assets/vince_die',
    },
    {
        "name" : 'Johnny Fear',
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image_up" : '/assets/jonnyfear_up',
        "image_down" : '/assets/jonnyfear_down',
        "image_left" : '/assets/jonnyfear_left',
        "image_right" : '/assets/jonnyfear_right',
        "image_die" : '/assets/jonnyfear_die',
    },
    {
        "name" : 'Hans',
        "health" : 100,
        "sober" : 100,
        "speed" : 1,
        "image_up" : '/assets/hans_up',
        "image_down" : '/assets/hans_down',
        "image_left" : '/assets/hans_left',
        "image_right" : '/assets/hans_right',
        "image_die" : '/assets/hans_die',
    },
];

const playerCharacters =[
    {
        "name" : 'Player 1',
        "health" : 100,
        "speed" : 1,
        "image_up" : '/assets/player1_up',
        "image_down" : '/assets/player1_down',
        "image_left" : '/assets/player1_left',
        "image_right" : '/assets/player1_right',
        "image_die" : '/assets/player1_die',
    },
];



/*==========================================================================
Game Level Definitions
===========================================================================*/

const gameLevel1[][] = [
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
    constructor (bandMemberCharacter) {
        this._name=bandMemberCharacter.name;
        this._health=bandMemberCharacter.health;
        this._sober=bandMemberCharacter.sober;
        this._speed=bandMemberCharacter.speed;
        this._state=BANDMEMBER_DEFAULT_STATE;
        this._image=bandMemberCharacter.image_left;
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get sober() { return this._sober; }
    set sober(setSober) { this._sober=setSober; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }
}

// Player Class

class Player {
    constructor (playerCharacter, setName) {
        this._name=setName;
        this._health=playerCharacter.health;
        this._sober=playerCharacter.sober;
        this._speed=playerCharacter.speed;
        this._state=PLAYER_DEFAULT_STATE;
        this._image=playerCharacter.image_right;
    }

    get name() { return this._name; }
    set name(setName) { this._name=setName; }

    get health() { return this._health; }
    set health(setHealth) { this._health=setHealth; }

    get speed() { return this._speed; }
    set speed(setSpeed) { this._speed=setSpeed; }

    get state() { return this._state; }
    set state(setState) { this._state=setState; }

    get image() { return this._image; }
}


/*==========================================================================
Utility Functions
===========================================================================*/



/*==========================================================================
Display Functions
===========================================================================*/



/*==========================================================================
Motion
===========================================================================*/



/*==========================================================================
Collision Detection
===========================================================================*/


/*==========================================================================
Initialize a New Game
===========================================================================*/


/*==========================================================================
Main Game Loop
===========================================================================*/





