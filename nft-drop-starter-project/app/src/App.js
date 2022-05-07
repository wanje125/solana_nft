import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

    // state
    const [walletAddress, setWalletAddress] = useState(null);

    // Actions

    const checkIfWalletIsConnected = async () => {
        const { solana } = window;

        try {
            if (solana && solana.isPhantom) {
                console.log('phantom wallet found');

                /*
                  * The solana object gives us a function that will allow us to connect
                   * directly with the user's wallet! (onlyIfTrusted true로 하면 한번 연결한후에는 연결을 승인할거냐는 팝업 메시지가 뜨지 않는다.)
                   */
                const response = await solana.connect({ onlyIfTrusted: true });
                console.log(
                    'Connected with Public Key:',
                    response.publicKey.toString()
                );
                setWalletAddress(response.publicKey.toString());
            }
            else {
                alert('There is not a Phantom wallet. Please install phantom');
            }
        } catch (error) {
            console.error(error);
        }
        
    };

    const connectWallet = async () => {
        const { solana } = window;

        const response = await solana.connect();
        console.log('Connected with Public Key:',
            response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
    };

    const renderNotConnectedContainer = () => (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
        >
            Connect to Wallet
        </button>
        );

    useEffect(() => { //React에서 useEffect 두 번째 매개변수[]가 비어있을 때 컴포넌트 마운트 시 후크가 한 번 호출된다.
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad); 
    }, []);
        

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">🍭 Candy Drop</p>
                    <p className="sub-text">NFT drop machine with fair mint</p>
                    {!walletAddress && renderNotConnectedContainer()}
                </div>
                {/* Check for walletAddress and then pass in walletAddress */}
                {walletAddress && <CandyMachine walletAddress={window.solana} />}
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
