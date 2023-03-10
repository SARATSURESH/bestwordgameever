    //function to start the game
    let words=[];

    function guessLetter(letter) {
    document.getElementById('guess').value += letter;
}

function startGame(){
  //set up the game
  fetch('https://raw.githubusercontent.com/SARATSURESH/bestwordgameever/main/list.txt')
  .then(response => response.text())
  .then(data => {
    debugger;
    words = data.split('\n');
    word = words[Math.floor(Math.random() * words.length)].trim().toUpperCase();
    guesses = 10;
    output = "";
    guesslist = "";
    num1 = 0;
    num2 = 0;
    let alphabetGridHtml = "";
    let alphabetSet = [];
    let alphabetMasterString = "AESORILTNUDCYMPHBGKFWVZJXQ";
    let wordlettersingrid=0;

    for(let i = 0; i < word.length; i++){
        let randomChar = word[i];
        alphabetSet.push(randomChar);
    }

    //generate the alphabet grid
    for(let i = 0; i < 11; i++){
        let randomIndex = Math.floor(Math.random() * alphabetMasterString.length);
        let randomChar = alphabetMasterString[randomIndex];
        if (alphabetSet.indexOf(randomChar)<0)
        {
        alphabetSet.push(randomChar);
        }
        else{i--;}

    }
    let loopcount=16;
    let shuffledChars=[];
    while(loopcount>0)
    {
        let randomIndex = Math.floor(Math.random() * 16);
        let randomChar = alphabetSet[randomIndex];
        if (shuffledChars.indexOf(randomChar)<0) {
          shuffledChars.push(randomChar);
          loopcount--;
        }
    }
    for(let i = 0; i < shuffledChars.length; i++){
          let randomChar = shuffledChars[i];
        alphabetGridHtml += `<button onclick="guessLetter('${randomChar}')">${randomChar}</button>`;
    }

    //display the game
    document.getElementById("alphabets-grid").innerHTML = alphabetGridHtml;
    document.getElementById("guesses").innerHTML = guesses;
    document.getElementById("output").innerHTML = output;
    document.getElementById("guesslist").innerHTML = guesslist;
  });
}

//function to check the guess
function checkGuess() {
  // get the guess from the input

   let guess = document.getElementById("guess").value.toUpperCase();
  let targetWord = word.toUpperCase();

  // check if the guess is correct
  if (guess === targetWord) {
    output = "You Win!";
  } else {
    // check how many characters are correct
    num1 = 0;
    num2 = 0;
    let usedIndexes = new Set();
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        num1++;
        usedIndexes.add(i);
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (usedIndexes.has(i)) continue;
      let matchIndex = targetWord.indexOf(guess[i]);
      if (matchIndex !== -1 && !usedIndexes.has(matchIndex)) {
        num2++;
        usedIndexes.add(matchIndex);
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
    guesslist += `<span>${guess}</span> <span class="correct">${num1}C</span> <span class="incorrect">${num2}I</span><br>`;
    guesses--;
  }

  // display the game
  document.getElementById("guesses").innerHTML = guesses;
  document.getElementById("output").innerHTML = output;
  document.getElementById("guesslist").innerHTML = guesslist;

  // check if the game is over
  if (guesses === 0) {
    document.getElementById("output").innerHTML = `Game Over! The word was ${word}.`;
    document.getElementById("guess").disabled = true;
  }
}

   //set up the game on page load
    window.onload = startGame;
