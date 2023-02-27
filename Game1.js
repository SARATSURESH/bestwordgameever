let words = [];
let guessesArr = [];
let shuffledChars = [];

//function guessLetter(letter) {
//  let button = document.querySelector(`#alphabets-grid button:nth-of-type(${shuffledChars.indexOf(letter) + 1})`);
//  if (!button.classList.contains("crossed-out")) {
//    document.getElementById("guess").value += letter;
//  }
//}

function startGame() {
  //set up the game
  fetch("https://raw.githubusercontent.com/SARATSURESH/bestwordgameever/main/wordlist.txt")
    .then((response) => response.text())
    .then((data) => {
      words = data.split("\n");
      word = words[Math.floor(Math.random() * words.length)].trim().toUpperCase();
      guesses = 8;
      output = "";
      guesslist = "";
      num1 = 0;
      num2 = 0;
      let alphabetGridHtml = "";
      let alphabetSet = [];
      let alphabetMostCommon = "AESORILTNUDCYMPH";
      let alphabetRemaining="BGKFWVZJXQ";
      let mostCommonLetters=0;
      let wordlettersingrid = 0;

      for (let i = 0; i < word.length; i++) {
        let randomChar = word[i];
        alphabetSet.push(randomChar);
        if (alphabetMostCommon.indexOf(randomChar) >= 0) {
          mostCommonLetters++;
        }  
      }

      //generate 12 letters in the alphabet grid from most common 16 letters
      for (let i = 0; i < (12-mostCommonLetters); i++) {
        let randomIndex = Math.floor(Math.random() * alphabetMostCommon.length);
        let randomChar = alphabetMostCommon[randomIndex];
        if (alphabetSet.indexOf(randomChar) < 0) {
          alphabetSet.push(randomChar);
        } else {
          i--;
        }
      }

      let lettersLeft= 15-alphabetSet.length;

      //generate 4 letters in the alphabet grid from not so common 10 letters

      for (let i = 0; i < lettersLeft+1; i++) {
        let randomIndex = Math.floor(Math.random() * alphabetRemaining.length);
        let randomChar = alphabetRemaining[randomIndex];
        if (alphabetSet.indexOf(randomChar) < 0) {
          alphabetSet.push(randomChar);
        } else {
          i--;
        }
      }

      //generate the alphabet grid from remaining 10 letters


      let loopcount = 16;
      while (loopcount > 0) {
        let randomIndex = Math.floor(Math.random() * 16);
        let randomChar = alphabetSet[randomIndex];
        if (shuffledChars.indexOf(randomChar) < 0) {
          shuffledChars.push(randomChar);
          loopcount--;
        }
      }
      for (let i = 0; i < shuffledChars.length; i++) {
        let randomChar = shuffledChars[i];
        alphabetGridHtml += `<button onclick="guessLetter('${randomChar}')">${randomChar}</button>`;
      }

      //display the game
      document.getElementById("alphabets-grid").innerHTML = alphabetGridHtml;
      document.getElementById("guesses").innerHTML = guesses;
      document.getElementById("output").innerHTML = output;
      document.getElementById("crossout-toggle").addEventListener("click", crossOutLetters);
      document.getElementById("crossout-undo").addEventListener("click", undoCrossOutLetters);
      document.getElementById("hint-button").addEventListener("click", showHint);
    });
}

//function to cross out the letters temporarily
function crossOutLetters() {
  let buttons = document.querySelectorAll("#alphabets-grid button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.classList.add("crossed-out");
      e.target.removeEventListener("click", guessLetter);
    });
  });
}

//function to undo all the crossed out letters
function undoCrossOutLetters() {
  let buttons = document.querySelectorAll("#alphabets-grid button");
  buttons.forEach((button) => {
    button.classList.remove("crossed-out");
    button.addEventListener("click", (e) => {
      e.target.classList.remove("crossed-out");
    });
  });
}    

//function to check the guess
function checkGuess() {
  // get the guess from the input
  let guess = document.getElementById("guess").value.toUpperCase();
  let targetWord = word.toUpperCase();

  let checkvalid="";
  checkvalid=guess.trim().toLowerCase()+"\r";
  let isValid=words.includes(checkvalid);

  // check if the guess is valid
  if (!isValid) {
    const popup = document.createElement("div");
    popup.innerHTML = `"${guess}" is not a valid word.`;
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#f44336";
    popup.style.color = "white";
    popup.style.padding = "10px";
    popup.style.borderRadius = "5px";
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
      }, 1000);
      let guessInput = document.getElementById("guess");
      if (guessInput) {
        guessInput.value = "";
      }
            return;
  }

  let isRepeated=guessesArr.some(guessObj => guessObj.guess === guess);

  // check if the guess is repeated
  if (isRepeated) {
    const popup = document.createElement("div");
    popup.innerHTML = `You have already guesssed the word"${guess}"`;
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#f44336";
    popup.style.color = "white";
    popup.style.padding = "10px";
    popup.style.borderRadius = "5px";
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
      }, 1000);
      let guessInput = document.getElementById("guess");
  if (guessInput) {
    guessInput.value = "";
  }
            return;
  }


  // check if the guess is correct
  if (guess === targetWord) {
    output = `You Win! ${targetWord} is the right word`;
  } else {
    // check how many characters are correct
    num1 = 0;
    num2 = 0;
    let usedIndexes = new Set();
    let positionLetters = [];
    let incorrectPositionLetters= [];
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        num1++;
        usedIndexes.add(i);
        positionLetters.push(guess[i]);
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (usedIndexes.has(i)) continue;
      let matchIndex = targetWord.indexOf(guess[i]);
      if (matchIndex !== -1 && !usedIndexes.has(matchIndex)) {
        num2++;
        usedIndexes.add(matchIndex);
        incorrectPositionLetters.push(guess[i]);
      }
    }

    // update the output
    let outputArr = Array.from({ length: 5 }, (_, i) => {
      if (guess[i] === targetWord[i]) {
        return `<span class="correct">${guess[i]}</span>`;
      } else if (usedIndexes.has(i)) {
        return `<span class="incorrect">${guess[i]}</span>`;
      } else {
        return guess[i];
      }
    });
    output = outputArr.join(" ");
    
    // add the guess to the guesses array
    guessesArr.push({
      guessNo: guessesArr.length + 1,
      guess: guess,
      correctLetters: `${num1}C`,
      incorrectLetters: `${num2}I`,
      correctPositionLetters: positionLetters,
      incorrectPositionLetters: incorrectPositionLetters
    });
    
    guesses--;

    if (guessesArr.length >= 4) {
      document.getElementById("hint-button").removeAttribute("hidden");
    }
  }

  // display the game
  document.getElementById("guesses").innerHTML = guesses;
  document.getElementById("output").innerHTML = output;
  
  // display the guesses array
  let guessListHtml = "";
  for (let guessObj of guessesArr) {
    guessListHtml += `<span>${guessObj.guess}</span> <span class="correct">${guessObj.correctLetters}</span> <span class="incorrect">${guessObj.incorrectLetters}</span><br>`;
  }
  document.getElementById("guesslist").innerHTML = guessListHtml;

  // clear the guess input
  let guessInput = document.getElementById("guess");
  if (guessInput) {
    guessInput.value = "";
  }

  // check if the game is over
  if (guesses === 0) {
    document.getElementById("output").innerHTML = `Game Over! The word was ${word}.`;
    document.getElementById("guess").disabled = true;
  }
}

function showHint() {
  debugger;
  let guessesSoFar = guessesArr.length;
  var guessNumber = prompt(`Which guess do you want a hint for? (Enter a number between 1 and ${guessesSoFar})`);
  if (guessNumber != null) {
    let guessArr = guessesArr[guessNumber - 1];
    let correctPositionLetters=guessArr.correctPositionLetters;
    let wrongPositionLetters=guessArr.incorrectPositionLetters;
    let hintMessage = `The letters in correct position in your guess (${guessArr.guess}) are ${correctPositionLetters} and the letters in incorrect position are ${wrongPositionLetters}`;  
    alert(hintMessage);
  }
  }


   //set up the game on page load
    window.onload = startGame;
