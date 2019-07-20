
import React, { useState, useEffect, useRef } from 'react';
import Point from '../Point/Point.js';
import Snake from '../Snake/Snake.js';

import "./GameArea.css"


function useKeyUp(initialKeyCode = 37) {
    const possibleKeyCodes = [37, 38, 39, 40];

    const [state, setState] = React.useState(initialKeyCode);

    function setKeyUp(keyCode, storedKeyCode, isGameOver) {

        const isSimilarOrParallelKeyPressed = (code) => code !== 32 && code%2 === storedKeyCode%2;

        // Match space on game over, then reset the application.
        const isRestartGame =   (code) => code === 32 && isGameOver;

        if ( isRestartGame(keyCode) ) {
            setState(keyCode);
            return ;
        }

        if ( !possibleKeyCodes.includes(keyCode) || isSimilarOrParallelKeyPressed(keyCode) ) {
            return ;
        }

        setState(keyCode);
    }

    return [ state, setKeyUp ];
}

function useFoodPos(initialFoodPos = { "x": 200, "y": 140 }) {

    const [state, setState] = useState(initialFoodPos);

    function updateFoodPos(snakePositions, gameBoundary) {
        let foodPos = null;
    
        const isFoodPosOnSnakePos = ({x: foodPosX, y: foodPosY}) => 
                                        snakePositions.some( pos => pos.x === foodPosX && pos.y === foodPosY);
    
        do {
            const {right, bottom}   =   gameBoundary;
    
            let foodPosLeft   = Math.floor(Math.random()*right);
            let foodPosBottom = Math.floor(Math.random()*bottom);
    
            if ( foodPosLeft >= right ) foodPosLeft = right - 20;
    
            if ( foodPosBottom >= bottom ) foodPosBottom = bottom - 20;
    
            foodPos = { x: foodPosLeft - foodPosLeft%20, y: foodPosBottom - foodPosBottom%20 };    
        } while ( isFoodPosOnSnakePos( foodPos ))
    
        setState(foodPos);
    }

    return [state, updateFoodPos];
}

function GameArea() {

    const [gameBoundary, updateGameBoundary] = useState({});
    const [isGameOver, updateGameOver]       = useState(false);
    const [score, setScore]                  = useState({'score': -1, 'highScore': -1});
    const [keyCode, updateKeyCode]           = useKeyUp();
    const [foodPos, updateFoodPos]           = useFoodPos();

    const gameAreaRef   =   useRef();

    useEffect( () => {
        if ( gameAreaRef ) {
            gameAreaRef.current.focus();
            let { left, right, top, bottom } = gameAreaRef.current.getBoundingClientRect();
            const gameBoundary  =   {
                    "left": 0, "right": right - left,
                    "top": 0, "bottom": bottom - top
            };

            updateGameBoundary(gameBoundary);
        }
    }, [gameAreaRef])

    // Restart the game on spacebar.
    useEffect( () => {
        if ( keyCode === 32 ) { // space bar 
            const initialSnakePosition = [
                {"x": 200, "y": 100, "id": 0 },
                {"x": 220, "y": 100, "id": 1 }
            ];
            const leftKey = 37;
            updateKeyCode(leftKey);
            updateFoodPos(initialSnakePosition, gameBoundary);
            updateGameOver(false);
            setScore({...score, score: -1});
        }
    }, [keyCode] );

    // Update score on each food eat.
    useEffect( () => {
        let newScore = {"score": score.score+1};
        if ( score.highScore < newScore.score ) {
            newScore   = {...newScore, highScore: newScore.score}
        }
        setScore({...score, ...newScore });
    }, [foodPos])
    
    const snakeProps = {
        foodPos,
        gameBoundary,
        keyCode,
        isGameOver,
        onGameOver: () => updateGameOver(true),
        onFoodEat: (snakePositions) => updateFoodPos(snakePositions, gameBoundary)
    };


    const gameOver = <div className="GameOver"><div>Game Over</div><span>Press <strong>space bar</strong> to restart</span></div>;

    return (
        <div ref={gameAreaRef} className="GameArea" onKeyUp={(event) => updateKeyCode(event.keyCode, keyCode, isGameOver)} tabIndex="0">
            <div className="Score">High Score: <strong>{score.highScore}</strong> Score: <strong>{score.score}</strong></div>
            <Snake {...snakeProps} />
            <Point xPos={foodPos.x} yPos={foodPos.y} />
            {isGameOver ? gameOver : ""}
        </div>
    )
}

export default GameArea;
