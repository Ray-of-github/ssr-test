import React from 'react';
// import logo from './logo.svg';
import './App.css';

function App({ children }) {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => {
          console.log(123123)
        }}>click me</button>
      </header>
      {children}
    </div>
  );
}

export default App;
