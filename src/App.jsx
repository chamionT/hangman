import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {languages} from '/src/languages.js'
// import { nanoid, random } from 'nanoid';
import { clsx } from 'clsx';
import { getFarewellText, getRandomWord} from './utils'
import Confetti from 'react-confetti'




function App() {
  //state values
  // const [currentWord, setCurrentWord] = useState(()=>getRandomWord())
  const [currentWord, setCurrentWord] = useState('react')
  const [guessedLetters, setGuessedLetters] = useState([])
  
  
  
  // Derived values
 
  const lastGuessedLetter = guessedLetters.slice(-1)

  function getMissingLetters(array1, array2) {
    return array2.filter(item => !array1.includes(item));
  }

  const missing = getMissingLetters(guessedLetters, currentWord.split(""));


  // const wrongGuessCount = 
  // guessedLetters.filter(letter => !currentWord.includes(letter)).length
  let wrongGuessCount = 0

  for (let i = 0; i < guessedLetters.length; i++) {
    if (!currentWord.includes(guessedLetters[i])) {
      wrongGuessCount +=1;
    }
  }

  const lostLanguages = languages
  .slice(0, wrongGuessCount) // get only the wrong guesses
  .map(lang => lang.name);   // extract only the names



const lostLanguagesString = lostLanguages.length === 1 ? null
: lostLanguages.length === 1 ? `${lostLanguages.slice(0).join(', ')} `
: `${lostLanguages.slice(0,-1).join(', ') }& ${lostLanguages[lostLanguages.length - 1]}`




  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))


  const isGameLost = wrongGuessCount >= languages.length - 1 
  const isGameOver = isGameWon || isGameLost

 

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
        prevLetters.includes(letter) ?
            prevLetters :
            [...prevLetters, letter]
      )
  }
 

  


  const hangman_letters = currentWord.split("").map((letter, index) => {
    const missedLetters = clsx("letter", {
      lettermissed: missing.includes(letter)
    })

    if(!isGameLost) {
      
      return (
       
      <span className="letter" key={index}>
        {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span> 
  )}

 else {
  return (
    <span className={missedLetters}  key={index}>
        {letter.toUpperCase()}
      </span>
  )
 }

  })

    const languageElements = languages.map((language, index )=> {
        const isLost = index < wrongGuessCount;
        const className = isLost ? 'lost' : '';
          return (

            <button className={className}   key={language.name}
                style={{ 
                    backgroundColor: language.backgroundColor, 
                    color: language.color, 
                    fontSize:'12px',
                    padding: '5px',
                    textAlign:'center',
                    
                    }}>
            
            {language.name}</button>
            
        )})
    

  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyboard = alphabet.split("").map((letter )=> {
  const isGuessed = guessedLetters.includes(letter)
  const isCorrect = isGuessed && currentWord.includes(letter)
  const isWrong = isGuessed && !currentWord.includes(letter)
  const className = clsx({
      correct: isCorrect,
      wrong: isWrong, 
        
      })

    return (
        <button
            className={className}
            key={letter}
            onClick={() => addGuessedLetter(letter)}
            disabled={isGameOver}
            aria-disabled={guessedLetters.includes(letter)}
            aria-label={`Letter ${letter}`}
        >
            {letter.toUpperCase()}
        </button>
    )
})


  const gameStatusClass = clsx("gamestatus", {
    gamestatuswon: isGameWon,
    gamestatuslost: isGameLost,
    lostLanguages : lostLanguages.length > 0 && ! isGameOver
  })


  function renderGameStatus() {

    
    if (lostLanguages.length > 0 && ! isGameOver) {
      return (
        getFarewellText(lostLanguagesString)
        // null
      )
    }
    if (isGameWon) {
      return (<>
        <h5>You win!</h5>
        <h6>Well done! 🎉</h6>
      </>)
    }
    if (isGameLost)  {
      return (<>
        <h5>Game Over!</h5>
        <h6>You lose! Better start learning Assembly 😭</h6>
      </>)
    }
  }
  
  function resetGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
}
  
  
  
  return (
    <>
      <main>
      {isGameWon && <Confetti/>}
        <header>
            <h1>Assembly: Endgame</h1>
            <p>Guess the word within 8 attempts to keep the 
            programming world safe from Assembly!</p>
        </header>

        <section aria-live="polite" role="status" className ={gameStatusClass}>
          
            {renderGameStatus()} 
                   
        </section>


        <section className="languages-display" >   
                {languageElements}
                
            </section>
            <section  className="hangman">
                {hangman_letters}
            </section>
            {/* Combined visually-hidden aria-live region for status updates */}
            <section className="sr-only" aria-live="polite" role="status">
              <p>
                {currentWord.includes(lastGuessedLetter) ? 
                `Correct! The letter ${lastGuessedLetter} is in the word.`:
                `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
                 `You have ${languages.length - 1 - (wrongGuessCount)}  attempts left.`
              </p>
              <p>Current word: {currentWord.split("").map(letter => 
                  guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}
              </p>

            </section>
            <div className="keyboard">
             {keyboard}
            </div>
            {isGameOver && <button 
            className="new-game"
            onClick={resetGame}
            >
              New Game</button>}
      </main>
    </>
  )
}

export default App
