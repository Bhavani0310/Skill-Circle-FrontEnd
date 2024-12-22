import { useEffect } from 'react';

const AuthProviderSuccess = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');

    
    if (provider) {

        const parentOrigin = window.opener.location.origin; // Get the parent window's origin dynamically
      console.log('Sending token to parent window at origin:', parentOrigin);

      window.opener.postMessage({ provider }, parentOrigin);
      window.close();
    }
  }, []);

  return <div>Processing...</div>;
};

export default AuthProviderSuccess;
