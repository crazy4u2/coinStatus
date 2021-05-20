import React from "react";
import Tabs from "./component/Tabs";

const Bookmark = (props) => {
  const { pathname } = props.location;
  return (
    <div className="wrapper">
      <Tabs url={pathname} />
    </div>
  );
};

export default Bookmark;