import React from "react";
import Hello from "./components/Hello";
import System from "./components/System";
import cloudbaseLogo from "./assets/cloudbase.png";
import reactLogo from "./assets/logo.png";
import { getApp } from "./tcb";
import "./App.css";

function App() {
  const app = getApp();
  return (
    <div className="App">
      <header className="App-header">
        <img className="logo" alt="CloudBase logo" src={cloudbaseLogo} />
        <img src={reactLogo} className="react-logo" alt="logo" />
      </header>
      <Hello app={app} />
      <System app={app} />
    </div>
  );
}

export default App;
