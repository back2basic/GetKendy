/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes, { number } from 'prop-types';
// import { Query } from 'appwrite';

import axios from 'axios';
import { formatDate } from '../../utils/formatDate';
import { serverless, databases, getJWT } from '../../utils/sdk';
import useBusdBtcStore from '../../utils/store/busdbtcPrice';
import useAutotradeStore from '../../utils/store/autotrade';

function UpDownRender({ begin, end, timeframe }) {
  // console.log(begin, end, timeframe)
  return (
    <div
      className={
        (begin * 100) / end - 100 > 0
          ? (begin * 100) / end - 100 > 1
            ? (begin * 100) / end - 100 > 5
              ? 'p-1 m-1 rounded-lg  shadow-lg text-white bg-green-800 shadow-green-600 flex items-center justify-center'
              : 'p-1 m-1 rounded-lg  shadow-md  bg-green-500 shadow-green-300 flex items-center justify-center'
            : 'p-1 m-1 rounded-lg  shadow-inner shadow-green-500 flex items-center justify-center'
          : (begin * 100) / end - 100 < -1
          ? (begin * 100) / end - 100 < -5
            ? 'p-1 m-1 rounded-lg shadow-lg text-white bg-red-800 shadow-red-600 flex items-center justify-center'
            : 'p-1 m-1 rounded-lg shadow-md  bg-red-500 shadow-red-300 flex items-center justify-center'
          : 'p-1 m-1 rounded-lg shadow-inner shadow-red-500 flex items-center justify-center'
      }
    >
      <span>{timeframe > 59 ? <>{timeframe / 60}h</> : <>{timeframe}m</>}:</span>
      {(begin * 100) / end - 100 > 0 ? (
        (begin * 100) / end - 100 > 1 ? (
          <div className="text-sm text-white">
            {' '}
            ↗︎
            {((begin * 100) / end - 100).toFixed(2)}%
          </div>
        ) : (
          <div className="text-sm text-green-500">
            {' '}
            ↗︎
            {((begin * 100) / end - 100).toFixed(2)}%
          </div>
        )
      ) : (begin * 100) / end - 100 < -1 ? (
        <div className="text-sm text-white">
          {' '}
          ↘︎
          {((begin * 100) / end - 100).toFixed(2)}%
        </div>
      ) : (
        <div className="text-sm text-red-500">
          {' '}
          ↘︎
          {((begin * 100) / end - 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
}

UpDownRender.defaultProps = {
  begin: 0,
  end: 0,
  timeframe: 0,
};

UpDownRender.propTypes = {
  begin: PropTypes.number,
  end: PropTypes.number,
  timeframe: PropTypes.number,
};

function Stats() {
  const [btcbusd, setBtcbusd] = useState({});
  const [baros, setBaros] = useState([]);
  const [error, setError] = useState('');
  const { setBusdBtcPrice } = useBusdBtcStore();
  const { setVolatility } = useAutotradeStore();

  // test socket
  // useEffect(() => {
  //   console.log('starting');
  //   sdk.subscribe('documents', (response) => {
  //     console.log(response);
  //     // if (response.events.includes('Barometer')) {
  //     //   setBaros(response.payload);
  //     // }
  //   });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await databases.listDocuments(
        //   process.env.NEXT_PUBLIC_APPWRITE_GETKENDY_DATA,
        //   process.env.NEXT_PUBLIC_APPWRITE_BAROMETER,
        //   [Query.orderDesc('$id'), Query.limit(60)]
        // );
        const { data } = await axios.get(`/api/fastapi/barometer/?page=1&size=60&jwt=${await getJWT()}`);
        // const { data: reversed } = await axios.get(`/api/fastapi/barometer/?page=1&size=60&jwt=${await getJWT()}`);
        // console.log(data)
        // setBarosRev(reversed.items.reverse());
        setBaros(data.items);
      } catch (err) {
        setBaros([]);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // const { response } = await serverless.createExecution('GetTicker', 'BTCUSDT');
        // const { ticker } = JSON.parse(response);
        const { data: ticker } = await axios.get('/api/fastapi/tickerredis?market=BTCUSDT&exchange=binance');
        // console.log(ticker);
        setBtcbusd(ticker);
        setBusdBtcPrice(ticker);
        const volat = ((+ticker?.close * 100) / +ticker?.open - 100).toFixed(2);
        // console.log(volat)
        setVolatility(+volat);
      } catch (err) {
        setError(err);
      }
    };
    fetchdata();
    const interval = setInterval(() => {
      fetchdata();
    }, 5000);
    return () => clearInterval(interval);
  }, [setBusdBtcPrice]);

  return (
    <div className="flex flex-wrap md:flex-row  bg-base-200 ">
      <div className="p-1 flex flex-col flex-grow justify-center items-center">
        <div className="flex self-start">BTC - Fiat Binance Dominance</div>
        <div className="prose">
          <h1 className="text-secondary-content">{baros[0]?.btcStrength.toFixed(2)}%</h1>
        </div>
        <div className="truncate max-w-xs md:self-start lg:max-w-lg">{formatDate(baros[0]?.date)}</div>
      </div>

      <div className="p-1 flex flex-col flex-grow justify-center items-center">
        <div className="flex self-start">BTC - Alts Binance Dominance</div>
        <div className="flex flex-row items-center">
          <div className="prose">
            <h1 className="text-secondary-content">{baros[0]?.altBtcStrength.toFixed(2)}%</h1>
          </div>
          <div className="grid">
            <UpDownRender timeframe={5} begin={baros[0]?.altBtcStrength} end={baros[4]?.altBtcStrength} />
            <UpDownRender timeframe={15} begin={baros[0]?.altBtcStrength} end={baros[14]?.altBtcStrength} />
          </div>

          <div className="grid">
            <UpDownRender timeframe={30} begin={baros[0]?.altBtcStrength} end={baros[29]?.altBtcStrength} />
            <UpDownRender timeframe={60} begin={baros[0]?.altBtcStrength} end={baros[59]?.altBtcStrength} />
          </div>
        </div>
      </div>

      <div className="p-1 flex flex-col flex-grow justify-center items-center">
        <div className="flex self-start">Ticker BTC/USDT</div>
        <div className="prose">
          <h1 className="text-secondary-content">${+btcbusd.close}</h1>
        </div>
        {(+btcbusd?.close * 100) / +btcbusd?.open - 100 > 0 ? (
          (+btcbusd?.close * 100) / +btcbusd?.open - 100 > 1 ? (
            (+btcbusd?.close * 100) / +btcbusd?.open - 100 > 5 ? (
              <div className="text-white bg-green-800 shadow-lg shadow-green-600 rounded-lg pl-2 ">
                24h: ↗︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
                {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
                %)
              </div>
            ) : (
              <div className="text-white bg-green-500 shadow-md shadow-green-300 rounded-lg pl-2 ">
                24h: ↗︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
                {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
                %)
              </div>
            )
          ) : (
            <div className=" text-green-500">
              24h: ↗︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
              {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
              %)
            </div>
          )
        ) : (+btcbusd?.close * 100) / +btcbusd?.open - 100 < -1 ? (
          (+btcbusd?.close * 100) / +btcbusd?.open - 100 < -5 ? (
            <div className=" text-white bg-red-800 shadow-lg shadow-red-600 rounded-lg pl-2 ">
              24h: ↘︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
              {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
              %)
            </div>
          ) : (
            <div className=" text-white bg-red-500 shadow-md shadow-red-300 rounded-lg pl-2 ">
              24h: ↘︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
              {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
              %)
            </div>
          )
        ) : (
          <div className=" text-red-500">
            24h: ↘︎ ${(+btcbusd.close - +btcbusd.open).toFixed()} (
            {((+btcbusd?.close * 100) / +btcbusd?.open - 100).toFixed(2)}
            %)
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
