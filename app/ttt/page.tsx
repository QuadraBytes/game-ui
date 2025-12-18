"use client";

import { useState } from "react";
import { post } from "@/lib/api";

type Cell = null | "X" | "O";

function Board({
  board,
  onClick,
}: {
  board: Cell[];
  onClick: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {board.map((cell, i) => {
        const value = cell || "";
        const colorClass =
          value === "X"
            ? "text-cyan-400"
            : value === "O"
            ? "text-pink-400"
            : "text-gray-500";

        return (
          <button
            key={i}
            onClick={() => onClick(i)}
            disabled={value !== ""}
            className={`
              w-24 h-24
              rounded-xl
              bg-gray-800/50
              backdrop-blur-sm
              border-2
              ${value === "" ? "border-gray-700 hover:border-cyan-500/50 hover:bg-gray-700/50" : "border-gray-600"}
              text-5xl font-extrabold
              ${colorClass}
              shadow-lg
              transition-all
              duration-300
              ${value === "" ? "hover:scale-105 hover:shadow-cyan-500/20" : ""}
              active:scale-95
              disabled:cursor-not-allowed
              relative
              overflow-hidden
            `}
          >
            {value === "" && (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
            )}
            <span className="relative z-10">{value}</span>
          </button>
        );
      })}
    </div>
  );
}

function renderResult(result: any): string {
  if (!result || typeof result !== "object") return "";

  if (result.tag === "Ongoing") return "Game in progress";
  if (result.tag === "Draw") return "It's a draw!";
  if (result.tag === "Win") {
    // Handle both string and object formats
    const player = typeof result.contents === "string" 
      ? result.contents 
      : result.contents?.tag || result.contents || "?";
    return `Player ${player} wins!`;
  }

  return "";
}

export default function TicTacToe() {
  const [state, setState] = useState<any>({
    board: Array(9).fill(null),
    current: "X", // Send as string, not object
  });

  const [result, setResult] = useState<any>({ tag: "Ongoing" });
  const [isLoading, setIsLoading] = useState(false);

  async function move(i: number) {
    if (state.board[i] !== null || result.tag !== "Ongoing") return;
    
    setIsLoading(true);
    try {
      const res = await post<any>("/ttt/move", {
        moveIndex: i,
        tttState: state,
      });

      setState(res.updatedTTTState);
      setResult(res.tttResult);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function resetGame() {
    setState({
      board: Array(9).fill(null),
      current: "X", // String format
    });
    setResult({ tag: "Ongoing" });
  }

  const isGameOver = result.tag !== "Ongoing";
  const hasWon = result.tag === "Win";
  const isDraw = result.tag === "Draw";

  // Get current player as string
  const currentPlayer = state.current;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Win confetti effect */}
      {hasWon && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.5 ? '🎉' : '✨'}
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-md border border-white/10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
            <span className="text-white text-4xl">⭕</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            Tic Tac Toe
          </h1>
          <p className="text-purple-200/80 text-sm">Three in a row to win!</p>
        </div>

        {/* Current player indicator */}
        {!isGameOver && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
              <span className="text-purple-200 text-sm font-medium">Current Player:</span>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xl ${
                currentPlayer === "X" 
                  ? "bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400/50" 
                  : "bg-pink-500/20 text-pink-400 border-2 border-pink-400/50"
              }`}>
                {currentPlayer}
              </div>
            </div>
          </div>
        )}

        {/* Board */}
        <Board board={state.board} onClick={move} />

        {/* Game status */}
        {isGameOver && (
          <div className={`mt-6 p-6 rounded-2xl backdrop-blur-sm border-2 ${
            hasWon 
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50" 
              : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50"
          }`}>
            <p className="text-white text-center text-2xl font-bold flex items-center justify-center gap-2">
              {hasWon && <span className="text-4xl">🏆</span>}
              {isDraw && <span className="text-4xl">🤝</span>}
              {renderResult(result)}
              {hasWon && <span className="text-4xl">🏆</span>}
              {isDraw && <span className="text-4xl">🤝</span>}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="bg-cyan-500/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-cyan-500/30">
            <div className="text-center">
              <p className="text-cyan-400 text-2xl font-bold">X</p>
              <p className="text-cyan-300/60 text-xs">Player 1</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 flex items-center">
            <p className="text-purple-200 text-sm font-medium">VS</p>
          </div>
          
          <div className="bg-pink-500/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-pink-500/30">
            <div className="text-center">
              <p className="text-pink-400 text-2xl font-bold">O</p>
              <p className="text-pink-300/60 text-xs">Player 2</p>
            </div>
          </div>
        </div>

        {/* Reset button */}
        {isGameOver && (
          <button
            onClick={resetGame}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all text-lg"
          >
            🎮 Play Again
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}