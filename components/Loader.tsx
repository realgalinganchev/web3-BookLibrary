
export default function Loader({ ...props }) {

    return (
        <>
            <div>
                <div className="loader">
                    <p>Your transaction is in progress...</p>
                </div>
                <p>The transaction hash is {props.txHash}</p>
                <a
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    href={'https://ropsten.etherscan.io/tx/' + props.txHash}>Check out the status live on etherscan!</a>
            </div>
            <style jsx>{`
            a {
                background-color: #FF7A59;
                color: white;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 10px;
            }  

            .loader {
                margin: auto;
                border: 20px solid #EAF0F6;
                border-radius: 50%;
                border-top: 20px solid #FF7A59;
                width: 100px;
                height: 100px;
                animation: spinner 4s linear infinite;
              }

              @keyframes spinner {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
        </>
    );
}

