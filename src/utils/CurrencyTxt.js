const currencyTxt = (cur) => {
  switch (cur) {
    case "krw":
      return "₩";
    case "usd":
      return "$";
    default:
      return "₩";
  }
};

export default currencyTxt;
