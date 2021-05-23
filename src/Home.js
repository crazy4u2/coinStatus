import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Tabs from "./component/Tabs";
import Loading from "./component/Loading";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Toast from "./component/Toast";

const Home = (props) => {
  const { pathname } = props.location;
  const [countNum, setCountNum] = useState(50); // 50 is default set
  const [viewCat, setViewCat] = useState("all"); // all is default, all and fav
  const [currency, setCurrency] = useState("krw"); // krw is default, krw and usd
  const [countPage, setCountPage] = useState(1);
  const [drawList, setDrawList] = useState([]);
  const [load, setLoad] = useState(true);
  const [bookMarkList, setBookMarkList] = useState([]);
  const [cache, setCache] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    x: "",
    y: "",
  });

  const blockFirstMount0 = useRef(true);
  const blockFirstMount1 = useRef(true);
  const blockFirstMount2 = useRef(true);

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

  const getCoinList = async () => {
    try {
      return await axios
        .get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${countNum}&page=${countPage}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
        )
        .then((res) => res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const countCoinList = async (flag) => {
    const coin = await getCoinList();
    if (flag === "nextCount") {
      setDrawList([...drawList, ...coin]);
    } else {
      setDrawList(coin);
    }
  };

  useEffect(() => {
    countCoinList();
    const a = JSON.parse(localStorage.getItem("bookmark"))
      ? JSON.parse(localStorage.getItem("bookmark"))
      : [];
    setBookMarkList(a);
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
    setLoad(true);
    countCoinList();
  }, [countNum, currency]);

  useEffect(() => {
    if (blockFirstMount1.current) {
      blockFirstMount1.current = false;
      return;
    }
    setLoad(true);
    countCoinList("nextCount");
  }, [countPage]);

  useEffect(() => {
    if (blockFirstMount2.current) {
      blockFirstMount2.current = false;
      return;
    }
    localStorage.setItem("bookmark", JSON.stringify(bookMarkList));
    const renderList = drawList.filter((v) => bookMarkList.includes(v.symbol));
    if (viewCat === "fav") {
      setDrawList(renderList);
    }
  }, [bookMarkList]);

  useEffect(() => {
    const renderList = drawList.filter((v) => bookMarkList.includes(v.symbol));
    if (viewCat === "fav") {
      setCache(drawList);
      setDrawList(renderList);
    } else {
      setDrawList(cache);
    }
  }, [viewCat]);

  return (
    <Wrap className="wrapper">
      <Helmet>
        <title>한강가지 말고 한강뷰에 살자</title>
        <link
          rel="icon"
          href="https://www.coingecko.com/api/documentations/favicon-32x32.png"
        />
      </Helmet>
      {load && <Loading />}
      <Tabs url={pathname} />
      <div className="setup-panel">
        <select
          onChange={(e) => {
            setCountNum(e.target.value);
            setCountPage(1);
          }}
          value={countNum}
        >
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
        <select
          onChange={(e) => {
            setCurrency(e.target.value);
            setCountPage(1);
          }}
        >
          <option value="krw">KRW 보기</option>
          <option value="usd">USD 보기</option>
        </select>
        <select value={viewCat} onChange={(e) => setViewCat(e.target.value)}>
          <option value="all">전체보기</option>
          <option value="fav">북마크보기</option>
        </select>
      </div>
      <table className={viewCat === "fav" ? "fav-only" : "all"}>
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
                  {currency === "krw" ? "₩" : "$"}
                  {v.current_price.toLocaleString()}
                </td>
                <td
                  className={`num-style percent ${
                    v.price_change_percentage_1h_in_currency > 0
                      ? "up"
                      : v.price_change_percentage_24h_in_currency === 0
                      ? ""
                      : "down"
                  }`}
                >
                  {v.price_change_percentage_1h_in_currency
                    ? v.price_change_percentage_1h_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td
                  className={`num-style percent ${
                    v.price_change_percentage_24h_in_currency > 0
                      ? "up"
                      : v.price_change_percentage_24h_in_currency === 0
                      ? ""
                      : "down"
                  }`}
                >
                  {v.price_change_percentage_24h_in_currency
                    ? v.price_change_percentage_24h_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td
                  className={`num-style percent ${
                    v.price_change_percentage_7d_in_currency > 0
                      ? "up"
                      : v.price_change_percentage_7d_in_currency === 0
                      ? ""
                      : "down"
                  }`}
                >
                  {v.price_change_percentage_7d_in_currency
                    ? v.price_change_percentage_7d_in_currency.toFixed(2)
                    : "0"}
                  %
                </td>
                <td className="num-style">
                  {currency === "krw" ? "₩" : "$"}
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
      {viewCat === "all" && (
        <button onClick={() => setCountPage((countPage) => countPage + 1)}>
          더보기
        </button>
      )}
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

export default Home;
