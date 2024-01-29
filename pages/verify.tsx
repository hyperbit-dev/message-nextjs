import { FormEvent, useRef, useState } from 'react';
import { chains } from '@hyperbitjs/chains';
import { verify } from '@hyperbitjs/message';
import Link from 'next/link';

export function getStaticProps() {
  const options = Object.keys(chains)
    .map((chain) => {
      const name = (chains as any)[chain].mainnet.name;
      return {
        label: name.match(/[A-Z][a-z]+/g)?.join(' ') ?? name,
        value: (chains as any)[chain].mainnet?.messagePrefix ?? null,
        networks: (chains as any)[chain],
      };
    })
    .filter((chain) => chain.networks.mainnet.messagePrefix);
  return {
    props: { options },
  };
}

export default function Verify(props: any) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const blockchainRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const signatureRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsVerified(null);
    const isVerified = verify({
      address: addressRef.current?.value ?? '',
      message: messageRef.current?.value ?? '',
      messagePrefix: blockchainRef.current?.value ?? '',
      signature: signatureRef.current?.value ?? '',
    });
    setIsVerified(isVerified);
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
        <h2 style={{ margin: 0 }}>Verify Message</h2>
        <span>
          <Link href="/">← Home</Link>
          <span style={{ padding: '0 5px' }}>|</span>
          <Link href="/sign">Sign</Link>
        </span>
      </div>
      <p>
        Verify the message to ensure it was signed with the specified blockchain
        address.
      </p>
      <p>
        Enter the receiver&rsquo;s address, message (ensure you copy line
        breaks, spaces, tabs, etc. exactly) and signature below to verify the
        message. Be careful not to read more into the signature than what is in
        the signed message itself, to avoid being tricked by a man-in-the-middle
        attack. Note that this only proves the signing party receives with the
        address, it cannot prove sendership of any transaction!
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
        <label htmlFor="sign-address">Address</label>
        <input
          ref={addressRef}
          id="sign-address"
          type="text"
          name="address"
          placeholder="Enter your public address..."
          required
        />
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
          required
        ></textarea>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button type="submit" className="button">
            Verify
          </button>
          {isVerified === true && (
            <div className="alert" style={{ backgroundColor: 'green' }}>
              Message Verified
            </div>
          )}
          {isVerified === false && (
            <div className="alert" style={{ backgroundColor: 'red' }}>
              Invalid blockchain, message, address, or signature.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
