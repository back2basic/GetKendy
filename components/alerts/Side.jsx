/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import Proptypes from 'prop-types';

// import { serverless } from '../../utils/sdk';
import axios from 'axios';
import Trades from '../trade/Trades';

// import Binance from '../binance/Binance';

function TickerDisplay({ ticker, coin }) {
  return (
    <div
      className={
        +ticker?.c - +ticker?.o > 0
          ? (+ticker?.c * 100) / +ticker?.o - 100 > 1
            ? (+ticker?.c * 100) / +ticker?.o - 100 > 5
              ? 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-lg text-white bg-green-800 shadow-green-600 p-2 rounded-xl'
              : 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-md bg-green-500 shadow-green-300 p-2 rounded-xl'
            : 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-inner shadow-green-500 p-2 rounded-xl'
          : (+ticker?.c * 100) / +ticker?.o - 100 < -1
          ? (+ticker?.c * 100) / +ticker?.o - 100 < -5
            ? 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-lg text-white bg-red-800 shadow-red-600 p-2 rounded-xl'
            : 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-md bg-red-500 shadow-red-300 p-2 rounded-xl'
          : 'flex flex-col flex-shrink flex-grow justify-center md:flex-col-reverse space-x-2 mb-2 shadow-inner shadow-red-500 p-2 rounded-xl'
      }
    >
      <div className="flex space-x-2 justify-center">
        <div className="font-bold">
          {coin}
          /USDT:
        </div>
        <div>${(+ticker.c).toFixed(2)}</div>
      </div>
      <div className="md:text-sm text-center justify-center flex space-x-2">
        <span>24h:</span>
        {+ticker?.c - +ticker?.o > 0 ? (
          (+ticker?.c * 100) / +ticker?.o - 100 > 1 ? (
            <div className="text-white"> ↗︎ ${(+ticker.c - +ticker.o).toFixed(2)}</div>
          ) : (
            <div className="text-green-600"> ↗︎ ${(+ticker.c - +ticker.o).toFixed(2)}</div>
          )
        ) : (+ticker?.c * 100) / +ticker?.o - 100 < -1 ? (
          <div className="text-white"> ↘︎ ${(+ticker.c - +ticker.o).toFixed(2)}</div>
        ) : (
          <div className="text-red-600"> ↘︎ ${(+ticker.c - +ticker.o).toFixed(2)}</div>
        )}
        <span>
          {' '}
          ({((+ticker?.c * 100) / +ticker?.o - 100).toFixed(2)}
          %)
        </span>
      </div>
    </div>
  );
}

TickerDisplay.defaultProps = {
  ticker: { o: '', c: '' },
  coin: '',
};

TickerDisplay.propTypes = {
  ticker: Proptypes.shape({
    o: Proptypes.string,
    c: Proptypes.string,
  }),
  coin: Proptypes.string,
};

function Side() {
  const [ethbusd, setEthbusd] = useState({});
  const [bnbbusd, setBnbbusd] = useState({});
  const [paxgbusd, setPaxgbusd] = useState({});

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // const { response } = await serverless.createExecution('GetTicker', 'ETHUSDT');
        // const { ticker } = JSON.parse(response);
        const { data: ticker } = await axios.get('/api/fastapi/tickerredis?market=ETHUSDT&exchange=binance');
        setEthbusd(ticker);
        setError('');
      } catch (err) {
        setError('refresh failed');
      }
    };
    fetchdata();
    const interval = setInterval(() => {
      fetchdata();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // const { response } = await serverless.createExecution('GetTicker', 'BNBUSDT');
        // const { ticker } = JSON.parse(response);
        const { data: ticker } = await axios.get('/api/fastapi/tickerredis?market=BNBUSDT&exchange=binance');
        setBnbbusd(ticker);
        setError('');
      } catch (err) {
        setError('refresh failed');
      }
    };
    fetchdata();
    const interval = setInterval(() => {
      fetchdata();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // const { response } = await serverless.createExecution('GetTicker', 'PAXGUSDT');
        // const { ticker } = JSON.parse(response);
        const { data: ticker } = await axios.get('/api/fastapi/tickerredis?market=PAXGUSDT&exchange=binance');
        setPaxgbusd(ticker);
        setError('');
      } catch (err) {
        setError('refresh failed');
      }
    };
    fetchdata();
    const interval = setInterval(() => {
      fetchdata();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:max-w-md">
      <h2 className="mb-5 text-2xl text-center  border-b shadow-inner shadow-secondary">Tickers:</h2>
      <div className="flex flex-wrap shadow shadow-primary rounded-xl">
        <TickerDisplay ticker={ethbusd} coin="ETH" />
        <TickerDisplay ticker={bnbbusd} coin="BNB" />
        <TickerDisplay ticker={paxgbusd} coin="PAXG" />

        {/* <Binance /> */}
      </div>
      <Trades />
      <div className="text-red-500 text-center hidden">{error}</div>
    </div>
  );
}

export default Side;
