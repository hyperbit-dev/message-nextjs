import { useRef, useState } from 'react';
import chains from '@ngmi/chains';
import { verify } from '@ngmi/message';
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

export default function Verify(props) {
  const [isVerified, setIsVerified] = useState(null);
  const blockchainRef = useRef(null);
  const addressRef = useRef(null);
  const messageRef = useRef(null);
  const signatureRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    setIsVerified(null);
    const isVerified = verify({
      address: addressRef.current.value,
      message: messageRef.current.value,
      messagePrefix: blockchainRef.current.value,
      signature: signatureRef.current.value,
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
          {props.options.map((chain) => (
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
