"use client";

import Link from "next/link";

export default function Home() {
  const games = [
    {
      href: "/guess",
      title: "Number Guess",
      description: "Guess the secret number between 1-100",
      icon: "🎯",
      gradient: "from-purple-500 via-indigo-500 to-blue-500",
      bgGlow: "bg-purple-500/20"
    },
    {
      href: "/ttt",
      title: "Tic Tac Toe",
      description: "Classic X's and O's battle",
      icon: "⭕",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGlow: "bg-cyan-500/20"
    },
    {
      href: "/hangman",
      title: "Hangman",
      description: "Save the stick figure, guess the word",
      icon: "🎭",
      gradient: "from-rose-500 via-orange-500 to-amber-500",
      bgGlow: "bg-rose-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/50 animate-pulse">
            <span className="text-white text-5xl">🎮</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 mb-4">
            FP Mini Game Suite
          </h1>
          
          <p className="text-xl text-gray-400 font-medium">
            Choose your adventure and start playing! 🚀
          </p>
        </div>

        {/* Game cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {games.map((game, index) => (
            <Link
              key={game.href}
              href={game.href}
              className="group relative block"
              style={{
                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 ${game.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-xl hover:shadow-2xl">
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${game.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}>
                  <span className="text-4xl">{game.icon}</span>
                </div>

                {/* Content */}
                <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${game.gradient} mb-3`}>
                  {game.title}
                </h2>
                
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  {game.description}
                </p>

                {/* Play button */}
                <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${game.gradient} text-white font-semibold rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110`}>
                  <span>Play Now</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Built with ❤️ using Functional Programming
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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