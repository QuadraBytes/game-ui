"use client";

import { useState } from "react";
import { post } from "@/lib/api";

type HangmanState = {
  word: string;
  guessed: string;
  lives: number;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Hangman() {
  const [state, setState] = useState<HangmanState>({
    word: "haskell",
    guessed: "",
    lives: 6,
  });

  const [letter, setLetter] = useState("");
  const [result, setResult] = useState("HangmanOngoing");
  const [isLoading, setIsLoading] = useState(false);

  async function guess(selectedLetter?: string) {
    const guessLetter = selectedLetter || letter;
    if (!guessLetter || state.guessed.includes(guessLetter)) return;
    
    setIsLoading(true);
    try {
      const res = await post<any>("/hangman/guess", {
        guessedLetter: guessLetter,
        hangmanState: state,
      });

      setState(res.updatedHangmanState);
      setResult(res.hangmanResult);
      setLetter("");
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function resetGame() {
    setState({
      word: "haskell",
      guessed: "",
      lives: 6,
    });
    setLetter("");
    setResult("HangmanOngoing");
  }

  const displayWord = state.word
    .split("")
    .map((c) => (state.guessed.includes(c) ? c : "_"))
    .join(" ");

  const isGameOver = result !== "HangmanOngoing";
  const hasWon = result === "HangmanWin";
  const hasLost = result === "HangmanLose";

  const drawHangman = () => {
    const parts = [
      { id: 'head', visible: state.lives <= 5, element: '😵' },
      { id: 'body', visible: state.lives <= 4, element: '👔' },
      { id: 'leftArm', visible: state.lives <= 3, element: '🤚' },
      { id: 'rightArm', visible: state.lives <= 2, element: '🤚' },
      { id: 'leftLeg', visible: state.lives <= 1, element: '👞' },
      { id: 'rightLeg', visible: state.lives <= 0, element: '👞' },
    ];

    return (
      <div className="relative w-48 h-64 mx-auto mb-6">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-amber-700"></div>
        <div className="absolute top-0 left-1/4 w-24 h-2 bg-amber-700"></div>
        <div className="absolute top-0 left-1/4 w-2 h-64 bg-amber-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-2 bg-amber-900"></div>
        
        {parts[0].visible && <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-5xl">{parts[0].element}</div>}
        {parts[1].visible && <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-4xl">{parts[1].element}</div>}
        {parts[2].visible && <div className="absolute top-28 left-8 text-3xl transform -rotate-45">{parts[2].element}</div>}
        {parts[3].visible && <div className="absolute top-28 right-8 text-3xl transform rotate-45">{parts[3].element}</div>}
        {parts[4].visible && <div className="absolute top-40 left-12 text-3xl transform rotate-12">{parts[4].element}</div>}
        {parts[5].visible && <div className="absolute top-40 right-12 text-3xl transform -rotate-12">{parts[5].element}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-orange-900 to-amber-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl w-full max-w-2xl border border-white/20">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-4xl">🎭</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-orange-300 to-amber-300 mb-2">
            Hangman
          </h1>
          <p className="text-orange-200 text-sm">Guess the word before it's too late!</p>
        </div>

        <div className="flex justify-center items-center gap-2 mb-6">
          <span className="text-rose-300 font-semibold">Lives:</span>
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-2xl">
                {i < state.lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <span className="text-white font-bold text-xl ml-2">{state.lives}/6</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          {drawHangman()}
        </div>

        <div className="bg-gradient-to-r from-rose-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/20">
          <p className="text-center text-4xl md:text-5xl font-bold text-white tracking-widest font-mono">
            {displayWord}
          </p>
        </div>

        {isGameOver && (
          <div className={`p-6 rounded-2xl backdrop-blur-sm mb-6 border-2 ${
            hasWon 
              ? "bg-green-500/20 border-green-400/50" 
              : "bg-red-500/20 border-red-400/50"
          }`}>
            <p className="text-white text-center text-2xl font-bold flex items-center justify-center gap-2">
              {hasWon ? (
                <>
                  <span className="text-4xl">🎉</span>
                  You Win! The word was: {state.word}
                  <span className="text-4xl">🎉</span>
                </>
              ) : (
                <>
                  Game Over! The word was: {state.word}
                </>
              )}
            </p>
          </div>
        )}

        {!isGameOver && (
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={1}
                value={letter}
                onChange={(e) => setLetter(e.target.value.toLowerCase())}
                onKeyPress={(e) => e.key === 'Enter' && guess()}
                placeholder="Type a letter..."
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-2xl font-bold text-center placeholder-orange-300/50 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-400/20 transition-all uppercase"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {!isGameOver && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/10">
            <p className="text-orange-200 text-sm text-center mb-3">Or click a letter:</p>
            <div className="grid grid-cols-7 gap-2">
              {ALPHABET.map((char) => {
                const isGuessed = state.guessed.includes(char);
                const isCorrect = isGuessed && state.word.includes(char);
                const isWrong = isGuessed && !state.word.includes(char);
                
                return (
                  <button
                    key={char}
                    onClick={() => guess(char)}
                    disabled={isGuessed || isLoading}
                    className={`
                      py-3 px-2 rounded-xl font-bold text-sm uppercase transition-all transform hover:scale-110 active:scale-95
                      ${isCorrect ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' : ''}
                      ${isWrong ? 'bg-red-500/50 text-red-200 line-through' : ''}
                      ${!isGuessed ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : ''}
                      ${isGuessed ? 'cursor-not-allowed' : 'hover:shadow-lg'}
                    `}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {state.guessed && (
          <div className="text-center mb-4">
            <p className="text-orange-200/60 text-sm">
              Guessed: <span className="text-white font-mono uppercase">{state.guessed.split('').join(', ')}</span>
            </p>
          </div>
        )}

        {isGameOver && (
          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all text-lg"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}