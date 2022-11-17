import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  function handleSubmit(e) {
    e.preventDefault();
    const signature = sign({
      privateKey: privateKeyWifRef.current.value,
      message: messageRef.current.value,
      messagePrefix: blockchainRef.current.value,
    });
    if (signature) {
      signatureRef.current.value = signature;
      signatureRef.current.disabled = false;
    } else {
      signatureRef.current.value = 'Invalid private key...';
      signatureRef.current.disabled = true;
    }
  }

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
