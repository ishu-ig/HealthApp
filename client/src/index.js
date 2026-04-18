import React from "react";
import ReacDOM from "react-dom/client"
import App from "./App";
import { Provider } from "react-redux";
import Store from "./Redux/Store";


const root = ReacDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <Provider store={Store}>
            <App />
        </Provider>
    </React.StrictMode>
)