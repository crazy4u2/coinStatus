import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Bookmark from "./Bookmark";
import Details from "./Details";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/bookmark" component={Bookmark} />
        <Route path="/details/:coin" component={Details} />
        <Route
          render={({ location }) => (
            <div className="no-page">없는 페이지입니다.</div>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
