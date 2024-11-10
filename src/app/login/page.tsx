'use client';

import { usePassport } from "../../context/passport";

const LoginRedirect = () => {

  const { login } = usePassport();

  
  return (
    <>
      <div onClick={login}>
        LOG IN
      </div>
    </>
  );
};

export default LoginRedirect;
