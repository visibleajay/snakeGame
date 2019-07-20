
import React, { useState, useEffect, useRef, useReducer } from 'react';
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

function reducer(state, action) {
    switch( action.type ) {
        case "Update_Game_Boundary":
            return {
                ...state,
                "gameBoundary": action.gameBoundary
            };
        case "Update_Game_Over":
            return {
                ...state,
                "isGameOver": action.isGameOver
            };
        case "Increment_Score":
            let newScore = {"score": state.score+1};
            if ( state.highScore < newScore.score ) {
                newScore   = {...newScore, highScore: newScore.score}
            }
            return {
                ...state,
                ...newScore
            };
        case "Restart_Game":
            return {
                ...state,
                isGameOver: false,
                score: -1,
                highScore: -1
            };
        default:
            return state;
    }
}

function GameArea() {
    
    const gameAreaRef               =   useRef();
    const [state, dispatch]         = useReducer(reducer, {isGameOver: false, gameBoundary: {}, score: -1, highScore: -1});
    const [keyCode, updateKeyCode]  = useKeyUp();
    const [foodPos, updateFoodPos]  = useFoodPos();

    useEffect( () => {
        if ( gameAreaRef ) {
            gameAreaRef.current.focus();
            let { left, right, top, bottom } = gameAreaRef.current.getBoundingClientRect();
            const gameBoundary  =   {
                    "left": 0, "right": right - left,
                    "top": 0, "bottom": bottom - top
            };
            dispatch({type: "Update_Game_Boundary", gameBoundary})
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
            updateFoodPos(initialSnakePosition, state.gameBoundary);
            dispatch({type: "Restart_Game"});
        }
    }, [keyCode] );

    // Update score on each food eat.
    useEffect( () => {
        dispatch({type: "Increment_Score"});
    }, [foodPos])
    
    const snakeProps = {
        foodPos,
        keyCode,
        ...state,
        onGameOver: () => dispatch({type: "Update_Game_Over", isGameOver: true}),
        onFoodEat: (snakePositions) => updateFoodPos(snakePositions, state.gameBoundary)
    };

    const gameOver = <div className="GameOver"><div>Game Over</div><span>Press <strong>space bar</strong> to restart</span></div>;

    return (
        <div ref={gameAreaRef} className="GameArea" onKeyUp={(event) => updateKeyCode(event.keyCode, keyCode, state.isGameOver)} tabIndex="0">
            <div className="Score">High Score: <strong>{state.highScore}</strong> Score: <strong>{state.score}</strong></div>
            <Snake {...snakeProps} />
            <Point xPos={foodPos.x} yPos={foodPos.y} />
            {state.isGameOver ? gameOver : ""}
        </div>
    )
}

export default GameArea;
