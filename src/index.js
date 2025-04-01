import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configs, { getParameterByName } from './Constants';
import { IntlProvider } from 'react-intl';  // Import IntlProvider
import initLocalisation from './assets/util/localisation/initLocalisation';  // Import localization initialization

// Initialize localization
const localisation = initLocalisation();

const token = getParameterByName('token');
const merchantCode = getParameterByName('merchantCode');
console.log(configs);

const root = ReactDOM.createRoot(document.getElementById('root'));

const getRootRender = () => {
  if (configs && configs.authUrl) {
    if (merchantCode || token || sessionStorage.getItem("token")) {
      return <App />;
    } else if (!merchantCode && (!token || !sessionStorage.getItem("token"))) {
      window.location.href = configs.authUrl + "/account/login?redirect=" + window.location.origin;
      return null;
    }
  } else {
    document.write("Configuration missing, check with admin.");
  }
};

// Wrap the root render inside the IntlProvider for localization
root.render(
  <IntlProvider {...localisation}>
    <div>
      {getRootRender()}
    </div>
  </IntlProvider>
);

// Optionally include reportWebVitals if needed
reportWebVitals();