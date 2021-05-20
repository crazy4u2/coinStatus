import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./component/Tabs";
import Loading from "./component/Loading";
import styled from "styled-components";

const Home = (props) => {
  const { pathname } = props.location;
  const [countNum, setCountNum] = useState(10); // 50 is default set
  const [viewCat, setViewCat] = useState("all"); // all is default, all and fav
  const [currency, setCurrency] = useState("krw"); // krw is default, krw and usd
  const [countPage, setCountPage] = useState(1);
  const [drawList, setDrawList] = useState([]);
  const [load, setLoad] = useState(true);

  const getCoinList = async () => {
    try {
      return await axios
        .get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${countNum}&page=${countPage}&sparkline=false`
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
    <div className="wrapper">
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
      <ul>
        {drawList.map((v, i) => (
          <li key={i}>{v.name}</li>
        ))}
      </ul>
      <button onClick={() => setCountPage((countPage) => countPage + 1)}>
        더보기
      </button>
    </div>
  );
};

export default Home;
