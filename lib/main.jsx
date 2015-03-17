'use strict';

import React from 'react';
import DDS from './components/dds.jsx!';
import config from './dconfig';

var dds;

dds = React.render(<DDS list={config.data.list} />, document.querySelector('#ddCtr'));
