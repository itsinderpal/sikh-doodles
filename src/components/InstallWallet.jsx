import React from 'react';

const InstallWallet = () => {
  return <div className="min-h-screen font-mono bg-gray-100 flex justify-center items-center">
      <h1 className="text-xl">Your wallet is not installed in the web browser. Install it first!</h1>
      <button className="p-1 rounded-lg bg-green-200">Download from here</button>
  </div>;
}

export default InstallWallet;