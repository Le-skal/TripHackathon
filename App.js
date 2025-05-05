// src/App.js
import React from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

function App() {
  return (
    <div>
      <h1>Firebase Auth Example</h1>
      <SignUp />
      <hr />
      <SignIn />
    </div>
  );
}

export default App;
