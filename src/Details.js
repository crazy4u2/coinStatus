import axios from "axios";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Loading from "./component/Loading";
import trendCheck from "./utils/TrendCheck";
import currencyTxt from "./utils/CurrencyTxt";
import Toast from "./component/Toast";

const exchangeRate = 1100;
// const deleteComma = (val) => {
//   return Number(val.replace(/,/g, ""));
// };

// const comma = (val) => {
//   const r = val
//     .toString()
//     .replace(/\D/g, "")
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   return r;
// };

const Details = ({ match }) => {
  const { coin } = match.params;
  const [coinInfo, setCoinInfo] = useState({});
  const [viewCurr, setViewCurr] = useState("krw");
  const [showDesc, setShowDesc] = useState(false);
  const [coinPrice, setCoinPrice] = useState(1);
  const [currencyPrice, setCurrencyPrice] = useState(0);
  const [load, setLoad] = useState(true);
  const [bookMarkList, setBookMarkList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    x: "",
    y: "",
  });

  const toast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  const addBookMark = (key, e) => {
    const { clientX, clientY } = e;
    if (bookMarkList.includes(key)) {
      const filterd = bookMarkList.filter((v) => v !== key);
      setBookMarkList(filterd);
      setToastMsg({
        msg: "삭제",
        clientX: clientX + 20,
        clientY: clientY + 20,
      });
    } else {
      setBookMarkList([...bookMarkList, key]);
      setToastMsg({
        msg: "추가",
        clientX: clientX + 20,
        clientY: clientY + 20,
      });
    }
    toast();
  };

  const changeCurreny = (cur) => {
    if (cur === "usd") {
      setCurrencyPrice((currencyPrice / exchangeRate).toFixed(0));
    } else if (cur === "krw") {
      setCurrencyPrice(currencyPrice * exchangeRate);
    }
    setViewCurr(cur);
  };

  const checkKey = (val, key) => {
    const regExp8digits = /^\d*.?\d{0,8}$/;
    if (key === "a") {
      if (regExp8digits.test(val)) {
        setCoinPrice(val);
      } else {
        setCoinPrice(val.substring(0, val.length - 1));
      }
      setCurrencyPrice((val * coinInfo.krw.currentPrice).toFixed(0));
    } else if (key === "b") {
      const transToNum = Number(val.replace(/[^0-9]/g, ""));
      if (val[0] === "0") {
        const [a, ...b] = val;
        setCurrencyPrice(Number(b.join().replace(/,/g, "")));
      } else {
        setCurrencyPrice(transToNum);
        setCoinPrice((transToNum / coinInfo.krw.currentPrice).toFixed(8));
      }
    }
  };

  const getCoinInfo = (coin) => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${coin}`)
      .then((res) => {
        const { symbol, market_cap_rank } = res.data;
        setCoinInfo({
          symbol,
          name: res.data.localization.ko
            ? res.data.localization.ko
            : res.data.localization.en,
          market_cap_rank,
          thumb: res.data.image.thumb,
          homepage: res.data.links.homepage[0],
          description: res.data.description.ko
            ? res.data.description.ko
            : res.data.description.en,
          krw: {
            currentPrice: res.data.market_data.current_price.krw,
            market_cap: res.data.market_data.market_cap.krw, // 시가총액
            total_24h: res.data.market_data.total_volume.krw, // 24시간 거래액
          },
          usd: {
            currentPrice: res.data.market_data.current_price.usd,
            market_cap: res.data.market_data.market_cap.usd, // 시가총액
            total_24h: res.data.market_data.total_volume.usd, // 24시간 거래액
          },
          price_change_per_24h:
            res.data.market_data.price_change_percentage_24h,
          market_cap_change_24h:
            res.data.market_data.market_cap_change_percentage_24h,
        });
        setCurrencyPrice(res.data.market_data.current_price.krw);
        setTimeout(() => {
          setLoad(false);
        }, 500);
      })
      .catch((err) => {
        setCoinInfo({});
        setLoad(false);
      });
  };

  useEffect(() => {
    getCoinInfo(coin);
    const loadBookmark = JSON.parse(localStorage.getItem("bookmark"))
      ? JSON.parse(localStorage.getItem("bookmark"))
      : [];
    setBookMarkList(loadBookmark);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmark", JSON.stringify(bookMarkList));
  }, [bookMarkList]);

  return (
    <>
      <Helmet>
        <title>{`코인 상세 페이지 - ${coinInfo.name}`}</title>
        <link rel="icon" href={coinInfo.thumb} />
      </Helmet>
      {load && <Loading />}
      {Object.keys(coinInfo).length > 0 ? (
        <WrapBox>
          <div className="top-box">
            <div className="option-panel">
              <select
                className="currency-change"
                value={viewCurr}
                onChange={(e) => changeCurreny(e.target.value)}
              >
                <option value="krw">KRW 보기</option>
                <option value="usd">USD 보기</option>
              </select>
            </div>
            <h1>
              <button onClick={(e) => addBookMark(coinInfo.symbol, e)}>
                {bookMarkList.includes(coinInfo.symbol)
                  ? "좋아요 했음"
                  : "좋아요"}
              </button>
              <img src={coinInfo.thumb} alt={`${coinInfo.name} icon`} />
              {coinInfo.name} ({coinInfo.symbol.toUpperCase()})
            </h1>
            <div className="mid-box">
              <table className="txt-info">
                <tbody>
                  <tr>
                    <th>시가총액 Rank</th>
                    <td>Rank #{coinInfo.market_cap_rank}</td>
                  </tr>
                  <tr>
                    <th>웹사이트</th>
                    <td>
                      <a
                        href={coinInfo.homepage}
                        title={`${coinInfo.name} 홈페이지`}
                      >
                        {coinInfo.homepage}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="numberic-info">
                <div className="top-section">
                  <div className="top-lh">
                    <p className="current-price">
                      {currencyTxt(viewCurr)}
                      {coinInfo[viewCurr].currentPrice.toLocaleString()}
                    </p>
                    <p className="root-point">
                      1.00000000 {coinInfo.symbol.toUpperCase()}
                    </p>
                  </div>
                  <div className="top-rh">
                    <p
                      className={`percent-24h-top ${trendCheck(
                        coinInfo.price_change_per_24h
                      )}`}
                    >
                      {coinInfo.price_change_per_24h.toFixed(2)}%
                    </p>
                    <p
                      className={`percent-24h-btm ${trendCheck(
                        coinInfo.market_cap_change_24h
                      )}`}
                    >
                      {coinInfo.market_cap_change_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="btm-section">
                  <p className="btm-lh">
                    <span>시가총액</span>
                    <br />
                    <span>
                      {currencyTxt(viewCurr)}
                      {coinInfo[viewCurr].market_cap.toLocaleString()}
                    </span>
                  </p>
                  <p className="btm-rh">
                    <span>24시간 거래대금</span>
                    <br />
                    <span>
                      {currencyTxt(viewCurr)}
                      {coinInfo[viewCurr].total_24h.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="calc-box">
              <h2>가격 계산</h2>
              <div className="calc-area">
                <dl>
                  <dt>{coinInfo.symbol.toUpperCase()}</dt>
                  <dd>
                    <input
                      type="number"
                      value={coinPrice}
                      onChange={(e) => checkKey(e.target.value, "a")}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>{viewCurr.toUpperCase()}</dt>
                  <dd>
                    <input
                      type="text"
                      value={currencyPrice}
                      onChange={(e) => checkKey(e.target.value, "b")}
                    />
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {coinInfo.description && (
            <>
              <div className="btm-box">
                <button onClick={() => setShowDesc(!showDesc)}>
                  설명{showDesc ? "닫기" : "보기"}
                </button>
              </div>
              {showDesc && (
                <div
                  className="desc-box"
                  dangerouslySetInnerHTML={{ __html: coinInfo.description }}
                ></div>
              )}
            </>
          )}
          {showToast && (
            <Toast
              msg={toastMsg.msg}
              x={toastMsg.clientX}
              y={toastMsg.clientY}
            />
          )}
        </WrapBox>
      ) : (
        <WrongWrap>
          <p>
            코인 이름을 확인하세요. 혹시 스캠일지도 모르니까 잘 찾아봐요.
            <br />
            스캠같다고 섵부르게 한강에 가지는 마시고요
          </p>
        </WrongWrap>
      )}
    </>
  );
};

const WrapBox = styled.div`
  * {
    box-sizing: border-box;
  }
  p,
  h2 {
    margin: 0%;
  }
  img {
    vertical-align: middle;
  }
  padding: 0 20%;
  .top-box {
    position: relative;
  }
  .option-panel {
    position: absolute;
    right: 0;
    top: 0;
  }
  .mid-box {
    display: flex;
    flex-direction: row;
    place-content: center space-between;
    align-items: center;
    .txt-info {
      border-collapse: collapse;
      width: 50%;
      th {
        color: #000;
        border: 1px solid #000;
        width: 40%;
        height: 60px;
        background: #ddd;
      }
      td {
        border: 1px solid #000;
      }
    }
    .numberic-info {
      width: 30%;
      text-align: right;
      .top-section {
        display: flex;
        flex-direction: row;
        place-content: center flex-end;
        align-items: center;
        .top-lh {
          padding: 0 10% 0 0;
          .current-price {
            font-size: 20px;
            font-weight: bold;
          }
          .root-point {
            color: gray;
          }
        }
        .top-rh {
          .percent-24h-top {
            font-weight: bold;
            font-size: 16px;
          }
          > p {
            &.up {
              color: red;
            }
            &.down {
              color: blue;
            }
          }
        }
      }
      .btm-section {
        display: flex;
        flex-direction: row;
        place-content: center flex-end;
        align-items: center;
        margin: 10% 0 0 0;
        .btm-lh {
          padding: 0 10% 0 0;
        }
      }
    }
  }
  .btm-box {
    padding: 2% 0;
    text-align: center;
  }
  .desc-box {
    line-height: 1.4em;
    p {
      margin: 1% 0;
    }
  }
  .calc-box {
    width: 100%;
    padding: 5%;
    display: flex;
    flex-direction: column;
    place-content: flex-start center;
    background: #ddd;
    margin: 10% 0 0 0;
    .calc-area {
      display: flex;
      flex-direction: row;
      place-content: center;
      dl {
        display: flex;
        flex-direction: row;
        place-content: center;
        &:last-child {
          margin-left: 10%;
        }
      }
    }
  }
`;

const WrongWrap = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  height: 100%;
`;

export default Details;
