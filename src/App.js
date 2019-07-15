import React from 'react';
import './App.css';
import GameArea from './GameArea/GameArea.js';

import { Provider } from 'react-redux';
import Store from './Store';

function App() {
  return (
    <div className="App">
      <Provider store={Store}>
        <GameArea />  
      </Provider>
    </div>
  );
}

export default App;
