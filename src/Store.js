

import { createStore } from 'redux';

const initial_state = {
    gameBoundary: {},
    isGameOver: false,
    keyCode: 37, //Left Key
    foodPos: { "x": 200, "y": 140 }
}

function gameAreaReducer(state = initial_state, action) {
    switch ( action.type ) {
        case "Add_Game_Boundary":
            return {
                ...state,
                gameBoundary: action.gameBoundary
            };
        case "Update_Key_Code":
            return {
                ...state,
                keyCode: action.keyCode
            };
        case "Update_Food_Position":
            return {
                ...state,
                foodPos: action.foodPos
            }
        case "Stop_Game": //For Game Over
            return {
                ...state,
                isGameOver: action.isGameOver
            }
        default:
            return state;
    }
}

export default createStore(gameAreaReducer);

