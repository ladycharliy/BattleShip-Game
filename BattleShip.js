var model = {
    boardSize: 7,		//each row and column have indexes from 0-6
    numShips: 3,		//number of ships on the board
    shipLength: 3,		//each ship has length of 3 cells
    shipsSunk: 0,		//counts how many ships were sunk

    //an array to hold the location and state of each ship
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],



//a method for shooting and checking results
//palyer firing on computer's fleet
    fire: function(guess) {
        //a loop to choose a choose (0-indexed, 1st or 2nd ship)
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];		//chooses a particular ship
            var index = ship.locations.indexOf(guess);

            // here's an improvement! Check to see if the ship
            // has already been hit, message the user, and return true.
            if (ship.hits[index] === "hit") {
                //shows a message to user that they have already hit the particular cell
                view.displayMessage("Oops, you already hit that location!");
                return true;

                //if user didn't choose the cell before:
            } else if (index >= 0) {
                ship.hits[index] = "hit";		//adding "hit" element to the hits array of the ship
                view.displayHit(guess);		//displays a ship on page
                view.displayMessage("HIT!");		//shows message to user


                //checks if the ship is unk
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");		//displays the message to user
                    this.shipsSunk++;		//incrementing the number of sunk ships

                }
                return true;
            }
        }
        view.displayMiss(guess);		//displays "MISS" on page
        view.displayMessage("You missed.");		//shows message to user

        return false;
    },

    //checking if ship is sunk
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;		//if all elements in ship.hits equals to "hit": the ship is sunk
    },

    //generate computer's ship placement
    generateShipLocations: function() {
        var locations;		//variable to hols a location for a ship
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();		//a generateShip() method call
            } while (this.collision(locations));
            this.ships[i].locations = locations;		//adding to the ships array
        }
        console.log("Ships array: ");		//checking everything in the console
        console.log(this.ships);		//logs the array of ships to the console
    },

    //generate the computer's ships
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;		//variables to hold rows and cols of each ship

        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));	//check if ship is out of bounds/off board
        } else { // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));	//check if ship is out of bounds/off board
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];		//an array to hold the whole location
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    //make sure ships don't overlap
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {	//checks if the position of the new ship appears in existing ship locations
                if (ship.locations.indexOf(locations[j]) >= 0) {	//if indexOf the location appears in the array, then collision
                    return true;
                }
            }
        }
        return false;		//no collision otherwise
    }

};

//controls the view of the web page
var view = {
    // displays a message 'HIT', 'MISS' or 'You sunk my battleship' after player's shot
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");	//getting access to message area
        messageArea.innerHTML = msg;	//changing the text in message area
    },

    // displays a picture of the ship on the cell (HTML) if user's guess is correct
    displayHit: function(location) {
        var cell = document.getElementById(location);	//chooses the cell using the entered location
        cell.setAttribute("class", "hit");		//adding the picture of the ship to the cell on page
    },

    // displays 'MISS' on the cell (HTML) if user's guess was wrong
    displayMiss: function(location) {
        var cell = document.getElementById(location);	//chooses the cell using the entered location
        cell.setAttribute("class", "miss");	//adding the picture with "MISS" to the cell on page
    }

};

var controller = {
    guesses: 0,		//the total number of player's guesses

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;	//incrementing the number of player's guesses
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                // display this message when all ships are sunk
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}


// helper function to parse a guess from the user

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    // checks whether an input is correct
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");	// if it's incorrect, displays this message
    } else {
        var firstChar = guess.charAt(0).toUpperCase();	// getting the character entered -converts to upper case (user don't have to worry about the case)
        var row = alphabet.indexOf(firstChar);		// converting a letter to the number using alphabet array
        var column = guess.charAt(1);		// stores the second number

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");	// handles an incorrect inputs
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");	// handles cases when row and column < 0 or >= 7 as coordinates only from 0 to 6
        } else {
            return row + column;	// returns an entered coordinates
        }
    }
    return null;
}


// event handlers for the user to fire on computer's board

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");	// a variable to hold <input id="guessInput">
    var guess = guessInput.value.toUpperCase();	// guess equals to user's input

    controller.processGuess(guess);	// we pass guess to controller and process it there

    guessInput.value = "";	// cleans the input field, so the user won't have to do it manually each time
}


// event handler for the 'Enter' key
// we pass event (e) to a function
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");	// a variable to hold <input id="fireButton">

    // in IE9 and earlier, the event object doesn't get passed
    // to the event handler correctly, so we use window.event instead.
    e = e || window.event;

    // fires when 'Enter' pressed
    if (e.keyCode === 13) {
        fireButton.click();	// the result is the same as we clicked it with a mouse
        return false;	// stops the execution
    }
    /*//trying AI click-turn
    self.robot.shoot();*/
}


// init - called when the page has completed loading
    window.onload = init;

// links all event handlers to buttons/keys and generates locations of the ships
function init() {
    // Fire! button onclick handler
    var fireButton = document.getElementById("fireButton");	// a variable to hold <input id="fireButton">
    fireButton.onclick = handleFireButton;	// if a user clicks the 'Fire!' button, executes handleFireButton()

    // handle "return" key press
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;	// if a user press 'Enter', executes handleKeyPress()

    // place the ships on the game board
    model.generateShipLocations();
}

    /*function Bot(){}
    Bot.prototype.play = function(turn) {

    }
*/