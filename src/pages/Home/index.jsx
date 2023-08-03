import React from 'react';
import { render } from 'react-dom';
import './index.scss';

//import pages
import Home from './Home';

render(<Home />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
