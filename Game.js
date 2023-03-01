let words = [];
let guessesArr = [];
let shuffledChars = [];
let nextLetter = 0;
let guesses = 8;
let currentGuess = [];
let output="";
let word="";

  //set up the game
  fetch("https://raw.githubusercontent.com/SARATSURESH/bestwordgameever/main/wordlist.txt")
    .then((response) => response.text())
    .then((data) => {
      words = data.split("\n");
      word = words[Math.floor(Math.random() * words.length)].trim().toUpperCase();
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

      //display the game
      function initBoard() {
        let board = document.getElementById("game-board");
    
        for (let i = 0; i < guesses; i++) {
          let row = document.createElement("div")
          row.className = "letter-row"
    
          for (let j = 0; j < 9; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
          }
    
          board.appendChild(row)
        }
      }
    
      initBoard();

      alphabetGridHtml=`<div class="first-row">`;
      for (let i = 0; i < (shuffledChars.length)/2; i++) {
        let randomChar = shuffledChars[i];
        alphabetGridHtml += `<button class="keyboard-button">${randomChar}</button>`;
      }
      alphabetGridHtml +=`</div> <div class="second-row">`;
      for (let i=(shuffledChars.length)/2; i < shuffledChars.length; i++) {
        let randomChar = shuffledChars[i];
        alphabetGridHtml += `<button class="keyboard-button">${randomChar}</button>`;
      }
      alphabetGridHtml +=`</div> <div class="third-row">`;
      alphabetGridHtml +=`<button class="keyboard-button">Del</button>`;
        alphabetGridHtml +=`<button class="keyboard-button" id="hint-button" hidden title="Click for a hint">Hint</button>`;
      alphabetGridHtml +=`<button class="keyboard-button">Enter</button>`;
      alphabetGridHtml +=`</div>`;
      document.getElementById("keyboard-cont").innerHTML = alphabetGridHtml;
    });

    document.getElementById("keyboard-cont").addEventListener("click", (e) => {
      const target = e.target
      
      if (!target.classList.contains("keyboard-button")) {
          return
      }
      let key = target.textContent
  
      if (key === "Del") {
          key = "Backspace"
      } 
  
      document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
  })

  const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


document.addEventListener("keyup", (e) => {

  if (guesses === 0) {
      return
  }

  let pressedKey = String(e.key)
  if (pressedKey === "Backspace" && nextLetter !== 0) {
      deleteLetter()
      return
  }

  if (pressedKey === "Enter") {
      checkGuess()
      return
  }

  if (pressedKey === "Hint") {
    showHint()
    return
  }

  let found = pressedKey.match(/[a-z]/gi)
  if (!found || found.length > 1) {
      return
  } else {
      insertLetter(pressedKey)
  }
})

function insertLetter (pressedKey) {
  if (nextLetter === 5) {
      return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName("letter-row")[8- guesses]
  let box = row.children[nextLetter]
  animateCSS(box, "pulse")
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

function deleteLetter () {
  let row = document.getElementsByClassName("letter-row")[ 8- guesses]
  let box = row.children[nextLetter - 1]
  box.textContent = ""
  box.classList.remove("filled-box")
  currentGuess.pop()
  nextLetter -= 1
}


//function to check the guess
function checkGuess() {
  debugger;
  // get the guess from the input
  let targetWord = word.toUpperCase();
  let checkvalid="";
  let guess="";
  let row = document.getElementsByClassName("letter-row")[8 - guesses]


  for (const val of currentGuess) {
    guess += val.toUpperCase()
}

  //check for number of letters
  if (guess.length != 5) {
    toastr.error("Not enough letters!")
    return
}

  // check if the guess is valid
checkvalid=guess.trim().toLowerCase()+"\r";
let isValid=words.includes(checkvalid);
  if (!isValid) {
    toastr.error(`"${guess}" is not a valid word.`)
            return
  }

  let isRepeated=guessesArr.some(guessObj => guessObj.guess === guess);

  // check if the guess is repeated
  if (isRepeated) {
    toastr.error(`You have already guesssed the word"${guess}"`)
            return
  }


  // check if the guess is correct
  if (guess === targetWord) {
    alert(`You Win! ${targetWord} is the right word`)
    guesses=0
    return
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
      //let usedIndexes = new Set();
      if (usedIndexes.has(i)) continue;
      let matchIndex = targetWord.indexOf(guess[i]);
      if (matchIndex !== -1) {
        num2++;
        incorrectPositionLetters.push(guess[i]);
      }
    }

    // update the output
      row.children[5].textContent = num1
      row.children[5].classList.add("filled-box")
      row.children[5].style.backgroundColor='green'
      row.children[6].textContent = "C"
      row.children[6].classList.add("filled-box")
      row.children[6].style.backgroundColor='green'
      row.children[7].textContent = num2
      row.children[7].classList.add("filled-box")
      row.children[7].style.backgroundColor='yellow'
      row.children[8].textContent = "I"
      row.children[8].classList.add("filled-box")
      row.children[8].style.backgroundColor='yellow'
    
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
    nextLetter=0;
    currentGuess = [];

    if (guessesArr.length >= 4) {
      document.getElementById("hint-button").removeAttribute("hidden");
    }


    if (guesses === 0) {
      alert("You've run out of guesses! Game over!");
      alert(`The right word was: ${targetWord}`);

  }
}
}

function showHint() {
  let guessesSoFar = guessesArr.length;
  var guessNumber = prompt(`Which guess do you want a hint for? (Enter a number between 1 and ${guessesSoFar})`);
  if (guessNumber != null) {
    let guessArr = guessesArr[guessNumber - 1];
    let word=guessArr.guess;
    let row = document.getElementsByClassName("letter-row")[guessNumber-1]
    let correctPositionLetters=guessArr.correctPositionLetters;
    let wrongPositionLetters=guessArr.incorrectPositionLetters;
    for (let i = 0; i < 5; i++) {
      if (correctPositionLetters.includes(word[i])) {
        row.children[i].style.backgroundColor='green'
      }
      if (wrongPositionLetters.includes(word[i])) {
        row.children[i].style.backgroundColor='yellow'
      }
    }
  }
  }
