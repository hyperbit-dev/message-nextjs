import { useRef } from 'react';
import chains from '@ngmi/chains';
import { sign } from '@ngmi/message';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const options = Object.keys(chains)
    .map((chain) => {
      const name = chains[chain].main.name;
      return {
        label: name.match(/[A-Z][a-z]+/g)?.join(' ') ?? name,
        value: chains[chain].main?.messagePrefix ?? null,
        networks: chains[chain],
      };
    })
    .filter((chain) => chain.networks.main.messagePrefix);
  return {
    props: { options },
  };
}

export default function Sign(props) {
  const blockchainRef = useRef(null);
  const privateKeyWifRef = useRef(null);
  const messageRef = useRef(null);
  const signatureRef = useRef(null);
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log('blockchainRef', blockchainRef)
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: 0 }}>Sign Message</h2>
        <span>
          <Link href="/">← Home</Link>
          <span style={{ padding: '0 5px' }}>|</span>
          <Link href="/verify">Verify</Link>
        </span>
      </div>
      <p>
        You can sign messages/agreements with your addresses to prove you can
        receive cryptocurrency sent to them. Be careful not to sign anything
        vague or random, as phishing attacks may try to trick you into signing
        your identity over to them. Only sign fully-detailed statements you
        agree to.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sign-blockchain">Blockchain</label>
        <select
          ref={blockchainRef}
          id="sign-blockchain"
          name="blockchain"
          required
        >
          {props.options.map((chain) => (
            <option key={chain.label} value={chain.value}>
              {chain.label}
            </option>
          ))}
        </select>
        <label htmlFor="sign-private-key-wif">Private Key WIF</label>
        <input
          ref={privateKeyWifRef}
          id="sign-private-key-wif"
          type="text"
          name="privateKeyWIF"
          placeholder="Enter your private key wif..."
          required
        />
        <div style={{marginTop: '-16px', marginBottom: '1rem', fontSize: '13px'}}>Only send the public address that compliments the private key for verification.</div>
        <label htmlFor="sign-message">Message</label>
        <textarea
          ref={messageRef}
          id="sign-message"
          name="message"
          placeholder="Message"
          rows="2"
          required
        ></textarea>
        <label htmlFor="sign-signature">Signature</label>
        <textarea
          ref={signatureRef}
          id="sign-signature"
          type="text"
          name="signature"
          rows="2"
          disabled
        ></textarea>
        <button type="submit" className="button">
          Sign
        </button>
      </form>
    </div>
  );
}
