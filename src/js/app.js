// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
// import { readFileSync } from 'fs';

// Import Framework7
import Framework7 from './framework7-custom.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import '../css/framework7-custom.less';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import App Component
import App from '../components/app.jsx';

// Init F7 React Plugin
Framework7.use(Framework7React)

// var options = {
//   key: readFileSync('../../key.pem'),
//   cert: readFileSync('../../cert.pem'),
//   agent: false
// }

import {
  RecoilRoot,
} from 'recoil';

// Mount React App
  ReactDOM.render(
    <RecoilRoot>
      <App/>
    </RecoilRoot>,
    document.getElementById('app'),
  );