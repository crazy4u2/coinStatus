import React from "react";
import styled from "styled-components";

const Toast = (props) => {
  const { msg, x, y } = props;
  return (
    <Wrap x={x} y={y}>
      북마크에 {msg} 되었습니다.
    </Wrap>
  );
};

const Wrap = styled.div`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  background: #fff;
  border: 1px solid #000;
  z-index: 9;
  padding: 1%;
`;

export default Toast;
