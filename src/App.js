import React, { useState, useEffect, Children } from "react";
// import logo from './logo.svg';
import "./App.css";

function App({ children, InitialMsg }) {
  const [msg, setMsg] = useState(InitialMsg || "client");

  // const [childProps, setChildProps] = useState({});

  // let Component = null;
  // if (children) {
  //   Component = () => Children.only(children);
  //   console.log(78778, Component);
  //   if (Component.getInitialProps)
  //     this.getInitialProps = async () => {
  //       const props = await Component.getInitialProps;
  //       setChildProps(props);
  //     };
  // }

  useEffect(() => {
    window.NUMBER = 7;
  }, []);

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
          Render from {msg}
        </a>
        <button
          onClick={() => {
            console.log(123123);
          }}
        >
          click me
        </button>
      </header>
      {children}
    </div>
  );
}

export default App;

App.getInitialProps = async () => {
  return await InitialProps();
};

function InitialProps() {
  return new Promise((res) => {
    setTimeout(() => {
      const InitialMsg = typeof window === "undefined" ? "server" : "client";
      res({ InitialMsg });
    }, 500);
  });
}
