export type GuessState = {
  secret: number;
  attempts: number;
};

export type GuessResponse = {
  result: "TooLow" | "TooHigh" | "Correct";
  state: GuessState;
};

export type Player = "X" | "O";
export type Board = (Player | null)[];

export type TTTState = {
  board: Board;
  current: Player;
};

export type TTTResponse = {
  state: TTTState;
  result: "Win" | "Draw" | "Ongoing";
};

export type HangmanState = {
  word: string;
  guessed: string[];
  lives: number;
};

export type HangmanResponse = {
  state: HangmanState;
  result: "HangmanWin" | "HangmanLose" | "HangmanOngoing";
};
