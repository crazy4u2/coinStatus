import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Bookmark from "./Bookmark";

function App() {
  return (
    <div>
      <Route path="/" component={Home} exact />
      <Route path="/bookmark" component={Bookmark} />
    </div>
  );
}

export default App;
