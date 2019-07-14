
import React from 'react';
import Point from '../Point/Point.js';
import Snake from '../Snake/Snake.js';

import "./GameArea.css"

class GameArea extends React.Component {

    constructor(props) {
        super(props);
        const foodPos       =   { "x": 200, "y": 140 };
        const isGameOver    =   false;
        const leftKey       =   37;
        this.state = {foodPos, isGameOver, "gameBoundary": {}, "keyCode": leftKey};
        this.handleSnakeMovement    =   this.handleSnakeMovement.bind(this);
    }

    gameAreaRefCallback     =   (element) => {
        if ( element ) {
            element.focus();
            let { left, right, top, bottom } = element.getBoundingClientRect();
            const gameBoundary  =   {
                    "left": 0, "right": right - left,
                    "top": 0, "bottom": bottom - top
            };
            this.setState({
                gameBoundary
            });
        }
    }

    handleSnakeMovement(event) {

        const keyCode = event.keyCode;
        
        const isSimilarOrParallelKeyPressed = (code) => code%2 === this.state.keyCode%2;

        if ( isSimilarOrParallelKeyPressed(keyCode) ) {
            return ;   
        }

        this.setState({
            keyCode
        });
    }

    handleGameOver = (isGameOver) => {
        this.setState({isGameOver});
    }

    handleFoodEat  = (snakePositions) => {
        let foodPos = null;
        
        const isUniquePos = ( {x: foodPosX, y: foodPosY}) => snakePositions.some( pos => pos.x === foodPosX && pos.y === foodPosY );

        do {
            const {right, bottom}   =   this.state.gameBoundary;

            let randomLeft   = Math.floor(Math.random()*right);
            let randomBottom = Math.floor(Math.random()*bottom);

            if ( randomLeft >= right ) randomLeft = right - 20;

            if ( randomBottom >= bottom ) randomBottom = bottom - 20;

            foodPos = { x: randomLeft - randomLeft%20, y: randomBottom - randomBottom%20 };    
        } while ( isUniquePos( foodPos ))

        this.setState({foodPos});
    }

    render() {
        return (
            <div ref={this.gameAreaRefCallback} className="GameArea" onKeyUp={this.handleSnakeMovement} tabIndex="0">
                <Snake foodPos={this.state.foodPos} 
                       gameBoundary={this.state.gameBoundary} 
                       keyCode={this.state.keyCode} 
                       onGameOver={(isGameOver) => this.handleGameOver(isGameOver)}
                       onFoodEat={(snakePositions) => this.handleFoodEat(snakePositions)}/>
                <Point xPos={this.state.foodPos.x} yPos={this.state.foodPos.y} />
                {this.state.isGameOver ? <div className="GameOver">Game Over</div> : ""}
            </div>
        )
    }
}

export default GameArea;
