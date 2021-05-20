import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./component/Tabs";
import Loading from "./component/Loading";
import styled from "styled-components";

const Home = (props) => {
  const { pathname } = props.location;
  const [countNum, setCountNum] = useState(50); // 50 is default set
  const [viewCat, setViewCat] = useState("all"); // all is default, all and fav
  const [currency, setCurrency] = useState("krw"); // krw is default, krw and usd
  const [countPage, setCountPage] = useState(1);
  const [drawList, setDrawList] = useState([]);
  const [load, setLoad] = useState(true);

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
    if (flag) {
      setDrawList([...drawList, ...coin]);
    } else {
      setDrawList(coin);
    }
  };

  useEffect(() => {
    countCoinList();
  }, []);

  useEffect(() => {
    setLoad(true);
    console.log("condition changed");
    countCoinList();
  }, [countNum, currency]);

  useEffect(() => {
    setLoad(true);
    console.log("더보기 클릭");
    countCoinList("a");
  }, [countPage]);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, [drawList]);

  return (
    <Wrap className="wrapper">
      {load && <Loading />}
      <Tabs url={pathname} />
      <div className="setup-panel">
        <select
          onChange={(e) => {
            setCountNum(e.target.value);
            setCountPage(1);
          }}
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
      </div>
      <table className="">
        <thead>
          <tr>
            <th>자산 - 심볼</th>
            <th>Price</th>
            <th>1H</th>
            <th>24H</th>
            <th>7D</th>
            <th>24H vol.</th>
          </tr>
        </thead>
        <tbody>
          {drawList.map((v, i) => (
            <tr key={i}>
              <td>
                <img src={v.image} className="icon" />
                {v.name} - {v.symbol}
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
                {v.price_change_percentage_1h_in_currency.toFixed(2)}%
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
                {v.price_change_percentage_24h_in_currency.toFixed(2)}%
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
                {v.price_change_percentage_7d_in_currency.toFixed(2)}%
              </td>
              <td className="num-style">
                {currency === "krw" ? "₩" : "$"}
                {v.total_volume.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setCountPage((countPage) => countPage + 1)}>
        더보기
      </button>
    </Wrap>
  );
};

const Wrap = styled.div`
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
  }
`;

export default Home;
