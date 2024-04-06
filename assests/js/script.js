
const today = dayjs()
const date = today.diff('04-01-2024', 'day'); //chose a start date of 04-01-2024 and then get the no. of days diff from todays date - then use this to get a word from targetword array
const targetWord = targetWords[date - 1];
console.log(targetWord)

const guessGrid = document.querySelector("[data-guess-grid]");
const wordLength = 5;

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
        console.log(e.target.dataset.key)
        pressKey(e.target.dataset.key);
        return;
    };

    if(e.target.matches("[data-enter]")){
        console.log(e.target.dataset.key)
        submitGuess();
        return;
    };

    if(e.target.matches("[data-delete]")){
        console.log(e.target.dataset.key)
        deleteKey();
        return;
    };
};

function handleKeyPress(e) {
    
    if(e.key === 'Enter'){
        submiteGuess();
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
};

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
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

};

