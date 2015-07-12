var banker = {
	offerDeal: function(cases,turn) {
		var sum = 0; 
		for (var i=0; i<cases.length; i++) {
			sum+=cases[i].dollarValue;
		}
		var average = sum/(cases.length-1);
		//offer increases based on how far into the game the player is, as well as average $ amount left in play
		var offer = Math.floor((average * turn)/10);
		return offer;
	}
}; 

function Case(number, dollarValue) {
	this.number = number;
	this.dollarValue = dollarValue; 
}

function Cases() {
	this.casesInPlay = fillCases();
	this.caseHeld = this.casesInPlay[Math.floor(Math.random()*10)];
	function fillCases() {
		var cases = [],
			values = shuffle([1, 10, 2000, 10000, 25000, 50000, 75000, 200000, 500000, 1000000]);
		for (var i=1; i<=10; i++) {
			cases.push(new Case(i, values[i-1]));
		}	
		return cases;
	};
	this.findCase = function(num) {
		var foundAtIndex = "";
		for (var i=0; i<this.casesInPlay.length; i++) {
			if (this.casesInPlay[i].number == num) {
				foundAtIndex = i;
			}
		}
		return foundAtIndex;
	};
	this.checkValidforRemoval = function(num) {
		return (this.findCase(num)==true && num!=this.caseHeld.number);
	}
	this.removeCase = function(num) {
		this.casesInPlay.splice(this.findCase(num),1); 
		return this.casesInPlay;
	};
	this.displayValues = function() {
		console.log("The remaining values are:");
		for (var i=0; i< this.casesInPlay.length; i++) {
			console.log(separateComma(this.casesInPlay[i].dollarValue));
		}
		return "";
	};
	this.displayNumbers = function() {
		console.log("The cases remaining in play are:");
		for (var i=0; i< this.casesInPlay.length; i++) {
		//don't display case number of case that's held by the player	
			if (this.casesInPlay[i].number!=this.caseHeld.number) {
				console.log(this.casesInPlay[i].number);
			}	
		}
		return "";
	};
};

function Player(cases) {
	this.cases = cases; 
	this.caseHeld = cases.caseHeld;
	this.acceptDeal = function() {
		console.log("Game over - you accepted the banker's deal! If you had opened your case instead, you would have received", separateComma(this.caseHeld.dollarValue));
	};
	this.rejectDeal = function(num) {
		//find value of chosen case -- since we're removing many cases from array, index of case is NOT always equal to its number
		var removedValue = this.cases.casesInPlay[this.cases.findCase(num)].dollarValue;
		console.log("\nThis case contained", separateComma(removedValue), "dollars. \n");
		this.cases.removeCase(num);
	};
};

function Game() {
	this.turn = 1;
	this.cases = new Cases();
	this.player = new Player(this.cases); 
	var caseHeld = this.cases.caseHeld;
	this.play = function() {
		console.log("Welcome to Deal or No Deal! You have been assigned case number", caseHeld.number, "which contains one of the dollar amounts below \n");
		var gameOver = false;
		//allows for command line interaction
		var getYesNo = require("cli-interact").getYesNo;
		var getNum = require("cli-interact").getInteger;
		while (!gameOver) {
			console.log(this.cases.displayValues());
			//end game if all cases have been removed from play, user keeps value in original case
			if (this.turn==10) {
				console.log("Game over! You won", separateComma(caseHeld.dollarValue));
				gameOver = true;
			} else {
				//banker generates an offer
				console.log("Banker offers", separateComma(banker.offerDeal(this.cases.casesInPlay, this.turn)));
				var answer = getYesNo("Would you like to take the deal?");
				//user accepts offer and ends game
				if (answer==true) {
					this.player.acceptDeal();
					gameOver = true;
				} 
				//user rejects offer and continues to remove cases from play
				else {
					this.cases.displayNumbers();
					var numChoice = getNum("Choose a case to remove from play: ");
					this.player.rejectDeal(numChoice);
					this.turn++;
				}
			}	
		}		
	}
}

//helper function to nicely display the dollar values 
function separateComma(number) {
   var reverseNum = String(number).split('').reverse(),
   		chunks=[];  
   for (var i=0; i < reverseNum.length; i+=3) {
     chunks.push(reverseNum.slice(i, i+3).reverse().join(''));
   }   
  var results = chunks.reverse().join();    
  return results;
 }

//helper function for shuffling dollar values in the cases array. Uses Fisher-Yates algorithm to randomly swap elements, starting at the end of an array
function shuffle(array){
 	for (var i = array.length -1; i>=0; i--) {
 		var randomIndex = Math.floor(Math.random()*(i+1));
 		var randomElement = array[randomIndex];
 		array[randomIndex] = array[i];
 		array[i] = randomElement;
 	}
 	return array;
}

game = new Game();
game.play();