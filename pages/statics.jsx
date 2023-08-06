import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

// import { Query } from 'appwrite';
import axios from 'axios';
import useUserStore from '../utils/store/user';
import useActiveTabStore from '../utils/store/activeTab';

// import { account, serverless } from '../utils/sdk';
import Page from '../components/layout/Page';
import { getJWT } from '../utils/sdk';

function Statics() {
  const { user } = useUserStore();
  const { setActiveTab } = useActiveTabStore();
  const router = useRouter();
  const [baros, setBaros] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      setActiveTab('statics');
    }
  }, [user, router, setActiveTab]);

  useEffect(() => {
    const fetchBaros = async () => {
      // const allbaros = [];
      // for (let index = 0; index < 10; index += 1) {
      //   // eslint-disable-next-line no-await-in-loop
      //   const moreData = await databases.listDocuments(
      //     process.env.NEXT_PUBLIC_APPWRITE_GETKENDY_DATA,
      //     process.env.NEXT_PUBLIC_APPWRITE_BAROMETER,
      //     [Query.orderDesc('$createdAt'), Query.offset(index * 100), Query.limit(100)]
      //   );
      //   moreData.documents.forEach((baro) => {
      //     allbaros.push(baro);
      //   });
      //   setBaros(allbaros.reverse());
      // }
      const { data } = await axios.get(`/api/fastapi/barometer/?page=1&size=60&jwt=${await getJWT()}`);
      setBaros(data.items);
      // console.log(baros[0].date)
      // console.log(baros[59].date)
    };
    fetchBaros();
    const interval = setInterval(() => {
      fetchBaros();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Page title="GetKendy - Statics" description="Free Crypto Scanner Trading Alerts. CryptoCoiners Scanner GUI">
      <div className="flex flex-wrap items-center justify-center">
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">BTC Strength</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="btcStrength" stroke="#8884d4" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="altBtcStrength" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">ETH Strength</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="ethStrength" stroke="#8884d8" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="altEthStrength" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">BNB Strength</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="bnbStrength" stroke="#8884d4" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="altBnbStrength" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">BTC Volume</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="fiatBtcVolume" stroke="#8884d4" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="btcAltVolume" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">ETH Volume</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="fiatEthVolume" stroke="#8884d4" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="ethAltVolume" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
        <div className="m-1 border rounded-xl border-primary-focus prose">
          <h3 className="text-center">BNB Volume</h3>
          <LineChart width={600} height={300} data={baros}>
            <Line type="monotone" dataKey="fiatBnbVolume" stroke="#8884d4" dot={false} activeDot={false} />
            <Line type="monotone" dataKey="bnbAltVolume" stroke="#82ca9d" dot={false} activeDot={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="top" height={30} />
            <XAxis hide />
            <YAxis />
          </LineChart>
        </div>
      </div>
      <div className="mb-20" />
    </Page>
  );
}

export default Statics;
