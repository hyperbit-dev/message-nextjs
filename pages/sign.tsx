import { FormEvent, useRef } from 'react';
import { chains } from '@hypereon/chains';
import { sign } from '@hypereon/message';
import Link from 'next/link';
import { Network, TestNetwork } from '@hypereon/chains/dist/types';

export function getStaticProps() {
  const options = Object.keys(chains)
    .map((chain: any) => {
      const name: string = (chains as any)[chain].main.name;
      return {
        label: name.match(/[A-Z][a-z]+/g)?.join(' ') ?? name,
        value: (chains as any)[chain].main?.messagePrefix ?? null,
        networks: (chains as any)[chain],
      };
    })
    .filter((chain) => chain.networks.main.messagePrefix);
  return {
    props: { options },
  };
}

export default function Sign(props: any) {
  const blockchainRef = useRef<HTMLSelectElement>(null);
  const privateKeyWifRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const signatureRef = useRef<HTMLTextAreaElement>(null);
  
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const signature = sign({
      privateKey: privateKeyWifRef.current?.value ?? '',
      message: messageRef.current?.value ?? '',
      messagePrefix: blockchainRef.current?.value ?? '',
    });
    if (signature && signatureRef.current) {
      signatureRef.current.value = signature;
      signatureRef.current.disabled = false;
    } else if (signatureRef.current) {
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
          {props.options.map((chain: any) => (
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
          rows={2}
          required
        ></textarea>
        <label htmlFor="sign-signature">Signature</label>
        <textarea
          ref={signatureRef}
          id="sign-signature"
          name="signature"
          rows={2}
          disabled
        ></textarea>
        <button type="submit" className="button">
          Sign
        </button>
      </form>
    </div>
  );
}
