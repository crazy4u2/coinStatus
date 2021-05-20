import React from "react";
import { Link } from "react-router-dom";

const Tabs = (props) => {
  const { url } = props;
  return (
    <ul>
      <li className={url === "/" ? "on" : ""}>
        <Link to="/">가상자산 목록</Link>
      </li>
      <li className={url === "/bookmark" ? "on" : ""}>
        <Link to="/bookmark">북마크 목록</Link>
      </li>
    </ul>
  );
};

export default Tabs;
