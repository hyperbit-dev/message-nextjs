import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>UTXO Message Sign and Verify</title>
        <meta name="description" content="Sign and verify messages" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 style={{ textAlign: 'center' }}>
        Multi-chain message signing and verification
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px'}}>
        <Link href="/sign" className="button">Sign Message</Link>
        <Link href="/verify" className="button">Verify Message</Link>
      </div>
    </div>
  );
}
