'use client';

import { useEffect } from "react";
import { usePassport } from "../../context/passport";

const LoginRedirect = () => {
  const { passportInstance } = usePassport();

  useEffect(() => {
    if (passportInstance) {
      passportInstance.loginCallback();
    }
  }, [passportInstance]);

  return (
    <>
      <div>
        Loading...
      </div>
    </>
  );
};

export default LoginRedirect;
