'use strict';

import React from 'react';
import DDS from './components/dds.jsx!';
import config from './dconfig';

let dds;

let callBack = function(dta) {
  switch(dta.action) {
    case 'onDragStart':
      config.meta.dragging = dta.id;
      config.meta.draggingPos = dta.pos;
      dds.setProps({config: config});
      //console.log('Main onDragStart: ' + JSON.stringify(config.meta, null, '  '));
      break;
    case 'onDragOver':
      config.meta.over = dta.id;
      config.meta.overPos = dta.pos;
      dds.setProps({config: config});
      //console.log('Main onDragOver: ' + JSON.stringify(config.meta, null, '  '));
      break;
    case 'onDrop':
      //console.log('Main onDrop: ' + JSON.stringify(config.meta, null, '  '));
      let moved = config.list.splice(config.meta.draggingPos, 1);
      config.list.splice(config.meta.overPos, 0, moved[0]);
      //console.log('setting to: ' + JSON.stringify(config, null, '  '));
      dds.setProps({config: config});
      break;
    case 'onDragLeave':
      console.log('Main onDragLeave');
      config.meta.over = config.meta.overPos = null;
      dds.setProps({config: config});
      break;
    case 'onDragEnd':
      config.meta.dragging = config.meta.draggingPos =
        config.meta.over = config.meta.overPos = null;
      dds.setProps({config: config});
      //console.log('onDragEnd: ' + JSON.stringify(config.meta, null, '  '));
      break;
  }
};

dds = React.render(<DDS config={config} callBack={callBack} />, document.querySelector('#ddCtr'));
