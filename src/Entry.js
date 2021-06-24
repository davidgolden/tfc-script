import ReactDOM from 'react-dom';
import App from "./App";

function Entry() {
    return <>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossOrigin="anonymous"/>
        <link rel="stylesheet" href="./main.css"/>
        {/*<script src="https://js.stripe.com/v3/"></script>*/}
        <App />
    </>
}

const script = document.createElement('script');
script.src = `https://js.stripe.com/v3/`;
// script.async = false;
document.body.append(script);

const container = document.getElementById('tfc-signup-container');
ReactDOM.render(<Entry/>, container);
