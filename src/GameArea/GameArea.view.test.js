
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import "@testing-library/jest-dom/extend-expect";

import GameArea from './GameArea.js';
import advanceTimeBy from '../shared.js';

describe("<GameArea />", () => {

    beforeAll( () => {
        jest.useFakeTimers();
    });

    afterEach(cleanup);

    it( "Initial focus should be on GameArea", () => {
        const { container } = render(<GameArea />);
        // 
        expect(document.activeElement).toEqual(container.firstElementChild);
    });

    it( "Press down key and move the snake in down direction", () => {
        const { container, getAllByRole } = render(<GameArea />);

        advanceTimeBy(150);

        const [firstSnakePosition, secondSnakePosition] = getAllByRole("Box");
        expect(firstSnakePosition).toHaveStyle(`top: 100px; left: 180px;`);
        expect(secondSnakePosition).toHaveStyle(`top: 100px; left: 200px;`);

        // keyBoard event issue in triggering
        fireEvent.keyUp(container.firstChild, {key: "ArrowDown", keyCode: 40, code: 40});
        advanceTimeBy(150);
        expect(getAllByRole("Box")).toMatchSnapshot();
    });
});

/*

1. Active Element is container.
2. Check direction of snake, in which it is moving.
3. On Key down press, the snake should move downwards.
4. On key up press, the snake should move downwards.
5. After specific seconds, Game Over should be visible.
6. On space-bar, the game should restart again and snake should move in left direction from inital state.
*/

