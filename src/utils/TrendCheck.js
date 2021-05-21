const trendCheck = (val) => {
  if (val === 0) {
    return "";
  } else if (val > 0) {
    return "up";
  } else {
    return "down";
  }
};

export default trendCheck;
