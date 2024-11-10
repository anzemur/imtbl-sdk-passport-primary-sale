'use client';

import { Button, Heading } from '@biom3/react';
import NextLink from 'next/link';
import { usePassport } from '../context/passport';

export default function Home() {
  const { login } = usePassport();

  return (<>
    <Heading
      size="medium"
      className="mb-1">
      Checkout SDK Widgets With Passport
    </Heading>

    <Button
      className="mb-1"
      size="medium"
      onClick={login}>
      Sign In
    </Button>

    <Button
      className="mb-1"
      size="medium"
      rc={<NextLink href="/widgets" />}>
      Mount Commerce Widgets
    </Button>
  </>);
}
