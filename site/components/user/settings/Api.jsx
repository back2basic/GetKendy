import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { serverless } from '../../../utils/sdk';
import useJWT from '../../../utils/useJwt';

function Api() {
  const [apikey, setApikey] = useState('');
  const [apisecret, setApisecret] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  const newJWT = useJWT();

  function onChangeApikey(evt) {
    setApikey(evt.target.value);
  }

  function onChangeApisecret(evt) {
    setApisecret(evt.target.value);
  }

  async function submitApi() {
    setStatus('');
    try {
      await serverless.createExecution('StoreApi', JSON.stringify({ token: await newJWT, apiKey: apikey, apiSecret: apisecret }));
      setStatus('Api Saved');
      router.reload();
    } catch (error) {
      setStatus('Something went wrong while saving. try again.');
    }
  }

  return (
    <div className="flex flex-col justify-center items-center text-center space-y-4 prose">
      <h1 className="p-2 first-letter:text-primary-focus shadow rounded-full">API</h1>
      <div className="grid grid-cols-2 justify-center items-center">
        <div>Key</div>
        <input type="text" name="key" id="key" value={apikey} onChange={onChangeApikey} className="rounded bg-transparent border border-primary" />
      </div>
      <div className="grid grid-cols-2 justify-center items-center">
        <div>Secret</div>
        <input type="text" name="secret" id="secret" value={apisecret} onChange={onChangeApisecret} className="rounded bg-transparent border border-primary" />
      </div>
      <div><button type='button' className='btn btn-sm' onClick={submitApi}>Save Api</button></div>
      <div>{status}</div>
    </div>
  );
}

export default Api;
