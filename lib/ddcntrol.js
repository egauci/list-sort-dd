import React from 'react';
import DDS from './components/dds';

/*
 * This module controls the drag/drop component.
 * It maintains state for the component based on
 * user events, then reports order changes with a
 * callback (should  be an event).
 */

class Ddcntrol {
  constructor(cfg, cback, container) {
    this.config = JSON.parse(JSON.stringify(cfg));
    this.pCallBack = cback;
    this.container = container;
    this.dropId = null;
    this.boundCallback = this.myCallBack.bind(this);
    this.render();
  }

  render() {
    React.render(
      <DDS config={this.config} callBack={this.boundCallback} />,
      this.container
    );
  }

  focusElm(dataid) {
    let elm = this.container.querySelector(`[data-id="${dataid}"]`);
    if (elm) {
      elm.focus();
    }
  }

  findNewPos(dta) {
    let newPos = dta.theKey === 38 ? dta.pos - 1 : dta.pos + 1;
    if (newPos < 0 || newPos >= this.config.list.length) {
      return false;
    }
    if (this.config.list[newPos].id === this.config.meta.dragging) {
      newPos = dta.theKey === 38 ? newPos - 1 : newPos + 1;
    }
    if (newPos < 0 || newPos >= this.config.list.length) {
      return false;
    }
    return newPos;
  }

  myCallBack(dta) {
    switch (dta.action) {
      case 'onDragStart':
        this.config.meta.dragging = dta.id;
        this.config.meta.draggingPos = dta.pos;
        this.render();
        break;
      case 'onDragOver':
        this.config.meta.over = dta.id;
        this.config.meta.overPos = dta.pos;
        this.render();
        break;
      case 'onDrop':
        this.config.meta.over = dta.id;
        this.config.meta.overPos = dta.pos;
        let moved = this.config.list.splice(this.config.meta.draggingPos, 1);
        this.config.list.splice(this.config.meta.overPos, 0, moved[0]);
        this.render();
        this.pCallBack(this.config);
        break;
      case 'onDragLeave':
        this.config.meta.over = this.config.meta.overPos = null;
        this.render();
        break;
      case 'onDragEnd':
        this.config.meta.dragging = this.config.meta.draggingPos =
          this.config.meta.over = this.config.meta.overPos = null;
        this.render();
        break;
      case 'onFocus':
        if (this.config.meta.dragging) {
          this.config.meta.over = dta.id;
          this.config.meta.overPos = dta.pos;
          this.render();
        }
        break;
      case 'onKey':
        if (dta.theKey === 27) { // abort
          this.config.meta.dragging = this.config.meta.draggingPos =
            this.config.meta.over = this.config.meta.overPos = null;
          this.render();
        } else if (dta.theKey === 32 && !this.config.meta.dragging) { // start drag
          this.config.meta.over = this.config.meta.overPos = null;
          this.config.meta.dragging = dta.id;
          this.config.meta.draggingPos = dta.pos;
          this.render();
        } else if ((dta.theKey === 32 && this.config.meta.dragging) ||
                   (this.config.meta.dragging && (dta.theKey === 13 || dta.theKey === 77))) { // drop
          this.dropId = this.config.meta.dragging;
          let moved = this.config.list.splice(this.config.meta.draggingPos, 1);
          this.config.list.splice(this.config.meta.overPos, 0, moved[0]);
          this.config.meta.dragging = this.config.meta.draggingPos =
            this.config.meta.over = this.config.meta.overPos = null;
          this.render();
          this.pCallBack(this.config);
        } else if (dta.theKey === 40 || dta.theKey === 38) { // move down or up
          let newPos = this.findNewPos(dta);
          if (newPos !== false) {
            this.focusElm(this.config.list[newPos].id);
          }
        }
        break;
      case 'listArrowDown': // focus first item in list
        if (!this.config.meta.dragging) {
          this.focusElm(this.config.list[0].id);
        }
        break;
      case 'didUpdate':
        if (this.dropId) {
          this.focusElm(this.dropId);
          this.dropId = null;
        }
        break;
      default:
        console.error('incorrect callback: ' + dta.action);
    }
  }
}

// default export instantiates a controller
export default function (cfg, cback, container) {
  return new Ddcntrol(cfg, cback, container);
}

