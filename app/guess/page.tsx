"use client";

import { useState } from "react";

type GuessState = {
  secret: number;
  attempts: number;
};

// Mock API function for demo - replace with your actual post function
async function post<T>(endpoint: string, data: any): Promise<T> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { guessValue, guessState } = data;
  const { secret, attempts } = guessState;
  
  let result = "";
  if (guessValue < secret) {
    result = "📈 Too low! Go higher!";
  } else if (guessValue > secret) {
    result = "📉 Too high! Go lower!";
  } else {
    result = `🎉 Correct! You won in ${attempts + 1} attempts!`;
  }
  
  return {
    updatedGuessState: {
      secret,
      attempts: attempts + 1
    },
    guessResult: result
  } as T;
}

export default function GuessGame() {
  const [state, setState] = useState<GuessState>({
    secret: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
  });

  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  async function submitGuess() {
    if (!guess || Number(guess) < 1 || Number(guess) > 100) return;
    
    setIsLoading(true);
    const res = await post<any>("/guess", {
      guessValue: Number(guess),
      guessState: state,
    });

    setState(res.updatedGuessState);
    setResult(res.guessResult);
    setIsLoading(false);
    
    if (res.guessResult.includes("Correct")) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }

  function resetGame() {
    setState({
      secret: Math.floor(Math.random() * 100) + 1,
      attempts: 0,
    });
    setGuess("");
    setResult("");
    setShowConfetti(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitGuess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <span className="text-yellow-400 text-2xl">✨</span>
            </div>
          ))}
        </div>
      )}

      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-md border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-2">
            Guess the Number
          </h1>
          <p className="text-purple-200 text-sm">I'm thinking of a number between 1-100</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">⚡</span>
              <div>
                <p className="text-xs text-purple-200">Attempts</p>
                <p className="text-2xl font-bold text-white">{state.attempts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input section */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess..."
              min="1"
              max="100"
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-xl font-semibold placeholder-purple-300/50 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 transition-all"
            />
          </div>

          <button
            onClick={submitGuess}
            disabled={isLoading || !guess}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Checking...
              </span>
            ) : (
              "Submit Guess"
            )}
          </button>
        </div>

        {/* Result display */}
        {result && (
          <div className={`p-6 rounded-2xl backdrop-blur-sm mb-4 border-2 transition-all transform ${
            result.includes("Correct") 
              ? "bg-green-500/20 border-green-400/50" 
              : result.includes("low")
              ? "bg-blue-500/20 border-blue-400/50"
              : "bg-orange-500/20 border-orange-400/50"
          }`}
          style={{
            animation: 'slideIn 0.3s ease-out'
          }}>
            <p className="text-white text-center text-lg font-semibold flex items-center justify-center gap-2">
              {result.includes("Correct") && <span className="text-yellow-400 text-2xl">🏆</span>}
              {result}
            </p>
          </div>
        )}

        {/* Reset button */}
        {result.includes("Correct") && (
          <button
            onClick={resetGame}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all"
          >
            🎮 Play Again
          </button>
        )}

        {/* Hint text */}
        {!result && (
          <p className="text-center text-purple-200/60 text-sm mt-4">
            💡 Take your best shot!
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}