'use strict';

import React from 'react';
import DDS from './components/dds.jsx!';
import config from './dconfig';

let dds,
    dropId;

let findNewPos = function(dta) {
  let newPos = dta.theKey === 38 ? dta.pos - 1 : dta.pos + 1;
  if (newPos < 0 || newPos >= config.list.length) {
    return false;
  }
  if (config.list[newPos].id === config.meta.dragging) {
    newPos = dta.theKey === 38 ? newPos - 1 : newPos + 1;
  }
  if (newPos < 0 || newPos >= config.list.length) {
    return false;
  }
  return newPos;
}

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
    case 'onFocus':
      if (config.meta.dragging) {
        config.meta.over = dta.id;
        config.meta.overPos = dta.pos;
        dds.setProps({config: config});
      }
      break;
    case 'onKey':
      if (dta.theKey === 27) {
        config.meta.dragging = config.meta.draggingPos =
          config.meta.over = config.meta.overPos = null;
        dds.setProps({config: config});
      } else if (dta.theKey === 32) {
        config.meta.over = config.meta.overPos = null;
        config.meta.dragging = dta.id;
        config.meta.draggingPos = dta.pos;
        dds.setProps({config: config});
      } else if (config.meta.dragging && (dta.theKey === 13 || dta.theKey === 77)) {
        dropId = config.meta.dragging;
        let moved = config.list.splice(config.meta.draggingPos, 1);
        config.list.splice(config.meta.overPos, 0, moved[0]);
        config.meta.dragging = config.meta.draggingPos =
          config.meta.over = config.meta.overPos = null;
        dds.setProps({config: config});
      } else if (dta.theKey === 40 || dta.theKey === 38) {
        let newPos = findNewPos(dta);
        if (newPos !== false) {
          let elm = document.querySelector('[data-id="' + config.list[newPos].id + '"]');
          if (elm) {
            elm.focus();
          }
        }
      }
      break;
    case 'listArrowDown':
      if (!config.meta.dragging) {
        let elm = document.querySelector('[data-id="' + config.list[0].id + '"]');
        if (elm) {
          elm.focus();
        }
      }
      break;
    case 'didUpdate':
      if (dropId) {
        let elm = document.querySelector('[data-id="' + dropId + '"]');
        if (elm) {
          elm.focus();
        }
        dropId = null;
      }
      break;
  }
};

dds = React.render(<DDS config={config} callBack={callBack} />, document.querySelector('#ddCtr'));
