
const today = dayjs()
const index = today.diff('04-01-2024', 'day'); //chose a start date of 04-01-2024 and then get the no. of days diff from todays date - then use this to get a word from targetword array
const targetWord = targetWords[index - 1];
console.log(index)
console.log(targetWord)

const keyboard = document.querySelector("[data-keyboard]");
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const wordLength = 5;
const flipAnimationDuration = 500;
const danceAnimationDuration = 500;

startInteraction();


function startInteraction() {
    document.addEventListener('click', handleMouseClick);
    document.addEventListener('keydown', handleKeyPress);
};

function stopInteraction() {
    document.removeEventListener('click', handleMouseClick);
    document.removeEventListener('keydown', handleKeyPress);
    };

function handleMouseClick(e) {
    if(e.target.matches("[data-key]")){
        pressKey(e.target.dataset.key);
        return;
    };

    if(e.target.matches("[data-enter]")){
        submitGuess();
        return;
    };

    if(e.target.matches("[data-delete]")){
        deleteKey();
        return;
    };
};

function handleKeyPress(e) {
    
    if(e.key === 'Enter'){
        submitGuess();
        return;
    }
    
    if(e.key === 'Backspace' || e.key === 'Delete'){
        deleteKey();
        return;
    }

    if(e.key.match(/^[a-z]$/)){
        pressKey(e.key);
        return;
    }
};

function pressKey(key) {
    const activeTiles = getActiveTiles();
    if(activeTiles.length >= wordLength) return;
    const nextTile = guessGrid.querySelector(":not([data-letter])") // selects next div in guessGrid that doesn't have a data-letter attribute
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
    console.log([...getActiveTiles()])
};



function deleteKey() {
    const activeTiles = getActiveTiles();
    // console.log(activeTiles)
    const lastTile = activeTiles[activeTiles.length - 1]
    if(lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
};

function submitGuess() {
    const activeTiles = [...getActiveTiles()];
    console.log([...getActiveTiles()])
    if(activeTiles.length !== wordLength) {
        showAlert('Not enough letters');
        shakeTiles(activeTiles);
        return
    };
    
    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter
    }, "");
    console.log(guess)
    
    if(!dictionary.includes(guess)) {
        showAlert("Word not in list");
        shakeTiles(activeTiles);
        return;
    };

    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess)) //...params = 'title,index,array' that is in the flipTile func

    if(dictionary.includes(guess)){
        if(guess == targetWord){
            const correctTile = guessGrid.querySelectorAll("([data-letter])");
            correctTile.dataset.correct
        }
    }
};

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() =>{
        tile.classList.add("flip");

    }, index * flipAnimationDuration / 2);

    tile.addEventListener("transitionend", () => {
        tile.classList.remove('flip');
        if(targetWord[index] === letter) {
            tile.dataset.state="correct";
            key.classList.add("correct");
        }else if(targetWord.includes(letter)){
            tile.dataset.state="wrong-location";
            key.classList.add("wrong-location");
        }else{
            tile.dataset.state="wrong";
            key.classList.add("wrong");
        }

        if(index === array.length - 1){
            tile.addEventListener("transitionend", () => {
            startInteraction();
            checkWinLose(guess, array);
            }, {once : true});
        }
    }, {once : true});
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
};

function showAlert(msg, duration = 1000) {
    const alert = document.createElement("div");
    alert.textContent = msg;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    if(duration == null) return;

    setTimeout(() =>{
        alert.classList.add('hide')
        alert.addEventListener('transitionend', () =>{
            alert.remove();
        })
    },duration)
};

function shakeTiles(tiles){
    tiles.forEach(tile => {
        tile.classList.add("shake");
        tile.addEventListener("animationend", () => {
            tile.classList.remove("shake");
        }, {once: true});
        
    });
};

function checkWinLose(guess, tiles) {
    if(guess === targetWord){
        showAlert("You win!", 5000);
        danceTiles(tiles);
        stopInteraction();
        return;
    }
};

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(()=>{
            tile.classList.add("dance");
            tile.addEventListener("animationend", () => {
                tile.classList.remove("dance");
            }, {once: true});
        }, (index * danceAnimationDuration) / 5)
    });
}
