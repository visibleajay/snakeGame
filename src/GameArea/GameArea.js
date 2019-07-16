
import React from 'react';
import Point from '../Point/Point.js';
import Snake from '../Snake/Snake.js';

import { connect } from 'react-redux';

import "./GameArea.css"

class GameArea extends React.Component {

    constructor(props) {
        super(props);
        // const foodPos       =   { "x": 200, "y": 140 };
        // const isGameOver    =   false;
        // const leftKey       =   37;
        // this.state = {foodPos, isGameOver, "gameBoundary": {}, "keyCode": leftKey};
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
            const action = {"type": "Add_Game_Boundary", gameBoundary };
            this.props.dispatch(action);
            // this.setState({
            //     gameBoundary
            // });
        }
    }

    handleSnakeMovement(event) {

        const keyCode = event.keyCode;

        const possibleKeyCodes = [37, 38, 39, 40];

        const isSimilarOrParallelKeyPressed = (code) => code%2 === this.props.keyCode%2;

        if ( !possibleKeyCodes.includes(keyCode) || isSimilarOrParallelKeyPressed(keyCode) ) {
            return ;   
        }

        const action = { "type": "Update_Key_Code", keyCode };
        this.props.dispatch(action);
        // this.setState({
        //     keyCode
        // });
    }

    handleGameOver = (isGameOver) => {
        const action = { "type": "Stop_Game", isGameOver };
        this.props.dispatch(action);
        // this.setState({isGameOver});
    }

    handleFoodEat  = (snakePositions) => {
        let foodPos = null;
        
        const isUniquePos = ( {x: foodPosX, y: foodPosY}) => snakePositions.some( pos => pos.x === foodPosX && pos.y === foodPosY );

        do {
            const {right, bottom}   =   this.props.gameBoundary;

            let randomLeft   = Math.floor(Math.random()*right);
            let randomBottom = Math.floor(Math.random()*bottom);

            if ( randomLeft >= right ) randomLeft = right - 20;

            if ( randomBottom >= bottom ) randomBottom = bottom - 20;

            foodPos = { x: randomLeft - randomLeft%20, y: randomBottom - randomBottom%20 };    
        } while ( isUniquePos( foodPos ))

        const action    =   {"type": "Update_Food_Position" , foodPos};
        this.props.dispatch(action);
        // this.setState({foodPos});
    }

    render() {
        return (
            <div ref={this.gameAreaRefCallback} className="GameArea" onKeyUp={this.handleSnakeMovement} tabIndex="0">
                <Snake foodPos={this.props.foodPos} 
                       gameBoundary={this.props.gameBoundary} 
                       keyCode={this.props.keyCode} 
                       onGameOver={(isGameOver) => this.handleGameOver(isGameOver)}
                       onFoodEat={(snakePositions) => this.handleFoodEat(snakePositions)}/>
                <Point xPos={this.props.foodPos.x} yPos={this.props.foodPos.y} />
                {this.props.isGameOver ? <div className="GameOver">Game Over</div> : ""}
            </div>
        )
    }
}

const mapStateToProps = state => (
    { ...state }
);

export default connect(mapStateToProps)(GameArea);
