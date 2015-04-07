import React from 'react';
import DDSControl from './components/ddcntrol';
import config from './dconfig';

let callBack = function (cfg) {
  console.log('New order: ');
  if (console.table) {
    console.table(cfg.list);
  } else {
    console.dir(cfg.list);
  }
};

React.render(<DDSControl config={config} callBack={callBack} />, document.querySelector('#ddCtr'));
