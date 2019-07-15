
import React from 'react';
import Box from './Box/Box.js';

import "./Snake.css";

class Snake extends React.PureComponent {

    constructor(props) {
        super(props);
        const initialSnakePositions =   [
            {"x": 200, "y": 100, "id": 0 },
            {"x": 220, "y": 100, "id": 1 }
        ];
        this.id         =   5;
        this.isGameOver =   false;
        this.state      =   {"snakePos": initialSnakePositions};
    }

    componentDidMount () {
        this.intervalId   =   setInterval(() => this.moveSnakeToNextPosition(), 150);
        this.moveSnakeToNextPosition();
    }
    
    componentWillMount() {
        clearInterval(this.intervalId);
    }

    moveSnakeToNextPosition() {
        const frontSnakePosition = this.state.snakePos[0];
        const secondSnakePosition  = this.state.snakePos[1];

        const isGoingLeft = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX < secondPosX && currentPosY === secondPosY;
        const isGoingUp = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX === secondPosX && currentPosY < secondPosY;
        const isGoingRight = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX > secondPosX && currentPosY === secondPosY;
        const isGoingDown = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX === secondPosX && currentPosY > secondPosY;
    
        let newPosition   =   null;
        if ( isGoingLeft(frontSnakePosition, secondSnakePosition) ) {
            newPosition   =   { "x": frontSnakePosition.x - 20, "y": frontSnakePosition.y, id: this.id };
        } 

        if ( isGoingRight(frontSnakePosition, secondSnakePosition) ) {
            newPosition   =   { "x": frontSnakePosition.x + 20, "y": frontSnakePosition.y, id: this.id };
        } 

        if ( isGoingDown(frontSnakePosition, secondSnakePosition) ) {
            newPosition   =   { "x": frontSnakePosition.x, "y": frontSnakePosition.y + 20, id: this.id };
        } 

        if ( isGoingUp(frontSnakePosition, secondSnakePosition) ) {
            newPosition   =   { "x": frontSnakePosition.x, "y": frontSnakePosition.y - 20, id: this.id };
        } 

        if ( newPosition ) {
            this.renderSnake(newPosition);
        }
    }

    renderSnake =   (newPosition) => {

        const isTouchedBoundary = ({x, y}, {left, top, right, bottom}) => x < left || x + 20 > right || y + 20 > bottom || y < top;

        if ( isTouchedBoundary(newPosition, this.props.gameBoundary) ) {
            this.isGameOver     =   true;
            clearInterval(this.intervalId);
            this.props.onGameOver(this.isGameOver);
            return ;
        }
        
        const isAteItself = ({x: newPosX, y: newPosY}) => this.state.snakePos.some( pos => pos.x === newPosX && pos.y === newPosY);

        if ( isAteItself(newPosition) ) {
            this.isGameOver     =   true;
            clearInterval(this.intervalId);
            this.props.onGameOver(this.isGameOver);
            return ;
        }

        if ( newPosition ) {
            let snakePositions  =   [];
            const {x: foodPosX, y: foodPosY} = this.props.foodPos;
            this.id += 1;
            if ( newPosition.x === foodPosX && newPosition.y === foodPosY ) {
                snakePositions = [  newPosition, ...this.state.snakePos.slice() ];
                this.props.onFoodEat(this.state.snakePos)
            } else {
                snakePositions = [  newPosition, ...this.state.snakePos.slice(0,-1)  ];
            }

            this.setState({
                "snakePos": snakePositions
            });
        }
    }

    changeSnakeDirection({ keyCode }){

        if ( this.isGameOver ) return false;

        const leftKey = 37;
        const currentPosition = this.state.snakePos[0];
        let newPosition =   null;

        if ( keyCode === leftKey ) {
            newPosition = {"x": currentPosition.x - 20 , "y": currentPosition.y, id: this.id };
        }
        
        const upKey   = 38;
        if ( keyCode === upKey ) {
            newPosition = {"x": currentPosition.x, "y": currentPosition.y - 20, id: this.id };
        }

        const rightKey = 39;
        if ( keyCode === rightKey ) {
            newPosition = {"x": currentPosition.x + 20, "y": currentPosition.y, id: this.id };
        }

        const downKey  = 40;
        if ( keyCode === downKey ) {
            newPosition = {"x": currentPosition.x, "y": currentPosition.y + 20, id: this.id };
        }

        if ( newPosition ) {
            this.renderSnake(newPosition)
        }
    }

    componentDidUpdate(prevProps) {
        if ( prevProps.keyCode !== this.props.keyCode ) {
            this.changeSnakeDirection(this.props);
        }
    }

    render() {
        return (
            this.state.snakePos.map( ({x: left, y: top, id}, index) => {
                return <Box key={id} left={left} top={top} />
            })
        );
    }

}

export default Snake;
