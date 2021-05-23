import React, { useState, useEffect, useRef } from "react";
import Tabs from "./component/Tabs";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./component/Loading";
import styled from "styled-components";
import Toast from "./component/Toast";
import trendCheck from "./utils/TrendCheck";
import currencyTxt from "./utils/CurrencyTxt";
import { Helmet } from "react-helmet";

const apiValue = {
  count: 250,
  currency: "krw",
  page: 1,
};

const Bookmark = (props) => {
  const { pathname } = props.location;
  const [load, setLoad] = useState(true);
  const [bookMarkList, setBookMarkList] = useState(
    JSON.parse(localStorage.getItem("bookmark"))
      ? JSON.parse(localStorage.getItem("bookmark"))
      : []
  );
  const [drawList, setDrawList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    x: "",
    y: "",
  });

  const blockFirstMount0 = useRef(true);

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
        clientX,
        clientY,
      });
    } else {
      setBookMarkList([...bookMarkList, key]);
      setToastMsg({
        msg: "추가",
        clientX,
        clientY,
      });
    }
    toast();
  };

  const coinList = async () => {
    try {
      return await axios
        .get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${apiValue.currency}&order=market_cap_desc&per_page=${apiValue.count}&page=${apiValue.page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
        )
        .then((res) => res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const makeRenderList = async () => {
    const coin = await coinList();
    const render = coin.filter((v) => bookMarkList.includes(v.symbol));
    setDrawList(render);
  };

  useEffect(() => {
    const localList = JSON.parse(localStorage.getItem("bookmark"))
      ? JSON.parse(localStorage.getItem("bookmark"))
      : [];
    setBookMarkList(localList);
    makeRenderList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, [drawList]);

  useEffect(() => {
    if (blockFirstMount0.current) {
      blockFirstMount0.current = false;
      return;
    }
    localStorage.setItem("bookmark", JSON.stringify(bookMarkList));
    const renderList = drawList.filter((v) => bookMarkList.includes(v.symbol));

    setDrawList(renderList);
  }, [bookMarkList]);

  // useEffect(() => {
  //   console.log("drawList:: ", drawList);
  // }, [drawList]);

  return (
    <Wrap className="wrapper">
      <Helmet>
        <title>한강가지 말고 한강뷰에 살자 - 북마크 목록</title>
        <link
          rel="icon"
          href="https://www.coingecko.com/api/documentations/favicon-32x32.png"
        />
      </Helmet>
      {load && <Loading />}
      <Tabs url={pathname} />
      <table>
        <thead>
          <tr className="fav">
            <th>자산 - 심볼</th>
            <th>Price</th>
            <th>1H</th>
            <th>24H</th>
            <th>7D</th>
            <th>24H vol.</th>
          </tr>
        </thead>
        <tbody>
          {drawList.length > 0 ? (
            drawList.map((v, i) => (
              <tr
                key={i}
                className={bookMarkList.includes(v.symbol) ? "fav" : ""}
              >
                <td>
                  <button onClick={(e) => addBookMark(v.symbol, e)}>
                    {bookMarkList.includes(v.symbol) ? "좋아요 했음" : "좋아요"}
                  </button>
                  <Link to={`/details/${v.id}`}>
                    <img src={v.image} className="icon" />
                    {v.name} - {v.symbol}
                  </Link>
                </td>
                <td className="num-style">
                  {currencyTxt(apiValue.currency)}
                  {v.current_price.toLocaleString()}
                </td>
                <td
                  className={`num-style percent ${trendCheck(
                    v.price_change_percentage_1h_in_currency
                  )}`}
                >
                  {v.price_change_percentage_1h_in_currency
                    ? v.price_change_percentage_1h_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td
                  className={`num-style percent ${trendCheck(
                    v.price_change_percentage_24h_in_currency
                  )}`}
                >
                  {v.price_change_percentage_24h_in_currency
                    ? v.price_change_percentage_24h_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td
                  className={`num-style percent ${trendCheck(
                    v.price_change_percentage_7d_in_currency
                  )}`}
                >
                  {v.price_change_percentage_7d_in_currency
                    ? v.price_change_percentage_7d_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td className="num-style">
                  {currencyTxt(apiValue.currency)}
                  {v.total_volume.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr className="fav">
              <td colSpan="6">내용이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      {showToast && (
        <Toast msg={toastMsg.msg} x={toastMsg.clientX} y={toastMsg.clientY} />
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  table {
    td {
      width: 15%;
      color: #000;
      &.num-style {
        text-align: right;
      }
      &.up {
        color: red;
      }
      &.down {
        color: blue;
      }
      &.percent {
        width: 10%;
      }
      .icon {
        width: 18px;
        height: 18px;
        margin: 0 4px;
        vertical-align: middle;
      }
    }
    th {
      text-align: right;
      &:first-child {
        text-align: left;
      }
    }
    &.fav-only {
      tr {
        display: none;
        &.fav {
          display: table-row;
        }
      }
    }
  }
`;

export default Bookmark;
