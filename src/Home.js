import React, { useState, useEffect } from "react";
import Tabs from "./component/Tabs";

const Home = (props) => {
  const { pathname } = props.location;
  return (
    <div className="wrapper">
      <Tabs url={pathname} />
    </div>
  );
};

export default Home;
