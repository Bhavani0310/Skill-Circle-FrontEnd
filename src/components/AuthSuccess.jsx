import { useEffect } from 'react';

const AuthSuccess = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        const parentOrigin = window.opener.location.origin; // Get the parent window's origin dynamically
        console.log('Sending token to parent window at origin:', parentOrigin);
  
        window.opener.postMessage({ token }, parentOrigin);
        window.close();
    }
  }, []);

  return <div>Processing...</div>;
};

export default AuthSuccess;
