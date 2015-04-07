import React from 'react';
import DDS from './dds';

/*
 * DDSControl is where the drag/drop (and keyboard equivalent) state
 * is maintained. Drag/drop actions result in a new state, which then
 * renders the actual drag/drop component (DDS).
 */

let DDSControl = React.createClass({
  propTypes: {
    config: React.PropTypes.shape({meta: React.PropTypes.object.isRequired,
                                   list: React.PropTypes.array.isRequired}).isRequired,
    callBack: React.PropTypes.func.isRequired
  },
  componentWillMount() {
    this.config = JSON.parse(JSON.stringify(this.props.config));
  },
  render() {
    return (
      <DDS config={this.config} callBack={this.callBack} />
    );
  },
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
  },
  callBack(dta) {
    let dropId;
    switch (dta.action) {
      case 'onDragStart':
        this.config.meta.dragging = dta.id;
        this.config.meta.draggingPos = dta.pos;
        this.setState({config: this.config});
        break;
      case 'onDragOver':
        this.config.meta.over = dta.id;
        this.config.meta.overPos = dta.pos;
        this.setState({config: this.config});
        break;
      case 'onDrop':
        this.config.meta.over = dta.id;
        this.config.meta.overPos = dta.pos;
        let moved = this.config.list.splice(this.config.meta.draggingPos, 1);
        this.config.list.splice(this.config.meta.overPos, 0, moved[0]);
        //console.log('setting to: ' + JSON.stringify(this.config, null, '  '));
        this.setState({config: this.config});
        this.props.callBack(this.config);
        break;
      case 'onDragLeave':
        this.config.meta.over = this.config.meta.overPos = null;
        this.setState({config: this.config});
        break;
      case 'onDragEnd':
        this.config.meta.dragging = this.config.meta.draggingPos =
          this.config.meta.over = this.config.meta.overPos = null;
        this.setState({config: this.config});
        break;
      case 'onFocus':
        if (this.config.meta.dragging) {
          this.config.meta.over = dta.id;
          this.config.meta.overPos = dta.pos;
          this.setState({config: this.config});
        }
        break;
      case 'onKey':
        if (dta.theKey === 27) {
          this.config.meta.dragging = this.config.meta.draggingPos =
            this.config.meta.over = this.config.meta.overPos = null;
          this.setState({config: this.config});
        } else if (dta.theKey === 32 && !this.config.meta.dragging) {
          this.config.meta.over = this.config.meta.overPos = null;
          this.config.meta.dragging = dta.id;
          this.config.meta.draggingPos = dta.pos;
          this.setState({config: this.config});
        } else if ((dta.theKey === 32 && this.config.meta.dragging) ||
                   (this.config.meta.dragging && (dta.theKey === 13 || dta.theKey === 77))) {
          dropId = this.config.meta.dragging;
          let moved = this.config.list.splice(this.config.meta.draggingPos, 1);
          this.config.list.splice(this.config.meta.overPos, 0, moved[0]);
          this.config.meta.dragging = this.config.meta.draggingPos =
            this.config.meta.over = this.config.meta.overPos = null;
          this.setState({config: this.config});
          this.props.callBack(this.config);
        } else if (dta.theKey === 40 || dta.theKey === 38) {
          let newPos = this.findNewPos(dta);
          if (newPos !== false) {
            let elm = document.querySelector('[data-id="' + this.config.list[newPos].id + '"]');
            if (elm) {
              elm.focus();
            }
          }
        }
        break;
      case 'listArrowDown':
        if (!this.config.meta.dragging) {
          let elm = document.querySelector('[data-id="' + this.config.list[0].id + '"]');
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
      default:
        console.error('incorrect callback: ' + dta.action);
    }
  }
});

export default DDSControl;
