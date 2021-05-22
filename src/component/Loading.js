import React from "react";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingWrapper>
      <p>LOADING ^_^</p>
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  p {
    font-size: 50px;
    color: #fff;
    text-align: center;
  }
`;

export default Loading;
