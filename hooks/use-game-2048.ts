"use client"

import { useState, useCallback, useEffect } from "react"

export type GameBoard = number[][]
export type Direction = "up" | "down" | "left" | "right"

export interface GameState {
  board: GameBoard
  score: number
  bestScore: number
  maxTile: number
  gameId: string | null
  isGameActive: boolean
  isGameOver: boolean
  hasWon: boolean
}

export function useGame2048() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(4)
      .fill(null)
      .map(() => Array(4).fill(0)),
    score: 0,
    bestScore: 0,
    maxTile: 0,
    gameId: null,
    isGameActive: false,
    isGameOver: false,
    hasWon: false,
  })

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem("2048-best-score")
    if (savedBestScore) {
      setGameState((prev) => ({ ...prev, bestScore: Number.parseInt(savedBestScore) }))
    }
  }, [])

  // Save best score to localStorage
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      const newBestScore = gameState.score
      setGameState((prev) => ({ ...prev, bestScore: newBestScore }))
      localStorage.setItem("2048-best-score", newBestScore.toString())
    }
  }, [gameState.score, gameState.bestScore])

  const createEmptyBoard = (): GameBoard => {
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(0))
  }

  const addRandomTile = useCallback((board: GameBoard): GameBoard => {
    const emptyCells: Array<{ row: number; col: number }> = []

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ row: i, col: j })
        }
      }
    }

    if (emptyCells.length === 0) return board

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const newBoard = board.map((row) => [...row])
    newBoard[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4

    return newBoard
  }, [])

  const moveLeft = (board: GameBoard): { board: GameBoard; score: number; moved: boolean } => {
    let totalScore = 0
    let moved = false
    const newBoard = board.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0)
      const mergedRow = []
      let i = 0

      while (i < filteredRow.length) {
        if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2
          mergedRow.push(mergedValue)
          totalScore += mergedValue
          i += 2
        } else {
          mergedRow.push(filteredRow[i])
          i++
        }
      }

      const finalRow = [...mergedRow, ...Array(4 - mergedRow.length).fill(0)]
      if (JSON.stringify(row) !== JSON.stringify(finalRow)) {
        moved = true
      }

      return finalRow
    })

    return { board: newBoard, score: totalScore, moved }
  }

  const moveRight = (board: GameBoard): { board: GameBoard; score: number; moved: boolean } => {
    const reversedBoard = board.map((row) => [...row].reverse())
    const { board: movedBoard, score, moved } = moveLeft(reversedBoard)
    return {
      board: movedBoard.map((row) => [...row].reverse()),
      score,
      moved,
    }
  }

  const moveUp = (board: GameBoard): { board: GameBoard; score: number; moved: boolean } => {
    const transposedBoard = board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
    const { board: movedBoard, score, moved } = moveLeft(transposedBoard)
    const finalBoard = movedBoard[0].map((_, colIndex) => movedBoard.map((row) => row[colIndex]))
    return { board: finalBoard, score, moved }
  }

  const moveDown = (board: GameBoard): { board: GameBoard; score: number; moved: boolean } => {
    const transposedBoard = board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
    const { board: movedBoard, score, moved } = moveRight(transposedBoard)
    const finalBoard = movedBoard[0].map((_, colIndex) => movedBoard.map((row) => row[colIndex]))
    return { board: finalBoard, score, moved }
  }

  const checkGameOver = (board: GameBoard): boolean => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j]
        if ((i < 3 && board[i + 1][j] === current) || (j < 3 && board[i][j + 1] === current)) {
          return false
        }
      }
    }

    return true
  }

  const getMaxTile = (board: GameBoard): number => {
    let max = 0
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] > max) {
          max = board[i][j]
        }
      }
    }
    return max
  }

  const move = useCallback(
    (direction: Direction) => {
      if (!gameState.isGameActive || gameState.isGameOver) return

      setGameState((prevState) => {
        let moveResult

        switch (direction) {
          case "left":
            moveResult = moveLeft(prevState.board)
            break
          case "right":
            moveResult = moveRight(prevState.board)
            break
          case "up":
            moveResult = moveUp(prevState.board)
            break
          case "down":
            moveResult = moveDown(prevState.board)
            break
        }

        if (!moveResult.moved) return prevState

        const boardWithNewTile = addRandomTile(moveResult.board)
        const newScore = prevState.score + moveResult.score
        const maxTile = getMaxTile(boardWithNewTile)
        const isGameOver = checkGameOver(boardWithNewTile)
        const hasWon = maxTile >= 2048 && !prevState.hasWon

        return {
          ...prevState,
          board: boardWithNewTile,
          score: newScore,
          maxTile,
          isGameOver,
          hasWon,
          isGameActive: !isGameOver,
        }
      })
    },
    [gameState.isGameActive, gameState.isGameOver, addRandomTile],
  )

  const startNewGame = useCallback(
    (gameId?: string) => {
      let newBoard = createEmptyBoard()
      newBoard = addRandomTile(newBoard)
      newBoard = addRandomTile(newBoard)

      setGameState((prevState) => ({
        ...prevState,
        board: newBoard,
        score: 0,
        maxTile: getMaxTile(newBoard),
        gameId: gameId || null,
        isGameActive: true,
        isGameOver: false,
        hasWon: false,
      }))
    },
    [addRandomTile],
  )

  const endGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isGameActive: false,
      isGameOver: true,
    }))
  }, [])

  return {
    gameState,
    move,
    startNewGame,
    endGame,
  }
}
