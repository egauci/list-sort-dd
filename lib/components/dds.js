import React from 'react';

/*
 * DDS is a drag/drop list reordering component. It renders a
 * ul element and handles drag/drop and equivalent keyboard events.
 * Events that may cause state change result in a callback to
 * the container component.
 */

let DDS = React.createClass({
  propTypes: {
    config: React.PropTypes.shape({meta: React.PropTypes.object.isRequired,
                                   list: React.PropTypes.array.isRequired}).isRequired,
    callBack: React.PropTypes.func.isRequired
  },
  componentDidUpdate() {
    this.props.callBack({
      action: 'didUpdate'
    });
  },
  render() {
    return (
      <div className="dds" role="application">
        <ul tabIndex="0" onKeyDown={this.listKey}>
          {
            this.props.config.list.map((itm, ix) => {
              return (
                <li
                  key={itm.id}
                  data-id={itm.id}
                  data-pos={String(ix)}
                  draggable="true"
                  tabIndex="-1"
                  aria-grabbed= {this.props.config.meta.dragging &&
                                 this.props.config.meta.dragging === itm.id ?
                                 'true' : 'false'}
                  aria-dropeffect={this.props.config.meta.dragging &&
                                 this.props.config.meta.dragging !== itm.id ?
                                 'move' : 'none'}
                  className={this.props.config.meta.over &&
                              this.props.config.meta.over === itm.id &&
                              this.props.config.meta.dragging !== itm.id ?
                              'over' : ''}
                  onDragStart={this.onDragStart}
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                  onDragEnd={this.onDragEnd}
                  onDragLeave={this.onDragLeave}
                  onFocus={this.onFocus}
                  onKeyDown={this.onKeyDown}
                >
                  <img src="images/ReorderControl.png" alt="Drag to reorder" className="reord-icon" draggable="false" />
                  {itm.label}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  },
  onDragStart(e) {
    let id = e.currentTarget.getAttribute('data-id'),
        pos = e.currentTarget.getAttribute('data-pos');
    e.dataTransfer.setData('text', '');
    this.props.callBack({
      action: 'onDragStart',
      id: id,
      pos: parseInt(pos, 10)
    });
  },
  onDragOver(e) {
    let id = e.currentTarget.getAttribute('data-id'),
        pos = e.currentTarget.getAttribute('data-pos');
    if (this.props.config.meta.dragging !== id) {
      if (this.props.config.meta.dragging) {
        e.preventDefault(); // allow the drag-over to happen
      }
      if (id !== this.props.config.meta.over) {
        this.props.callBack({
          action: 'onDragOver',
          id: id,
          pos: parseInt(pos, 10)
        });
      }
    }
  },
  onDrop(e) {
    let id = e.currentTarget.getAttribute('data-id'),
        pos = e.currentTarget.getAttribute('data-pos');
    this.props.callBack({
      action: 'onDrop',
          id: id,
          pos: parseInt(pos, 10)
    });
  },
  onDragEnd() {
    this.props.callBack({
      action: 'onDragEnd'
    });
  },
  onDragLeave() {
    this.props.callBack({
      action: 'onDragLeave'
    });
  },
  onFocus(e) {
    let id = e.currentTarget.getAttribute('data-id'),
        pos = e.currentTarget.getAttribute('data-pos');
    this.props.callBack({
      action: 'onFocus',
      id: id,
      pos: parseInt(pos, 10)
    });
  },
  onKeyDown(e) {
    let id = e.currentTarget.getAttribute('data-id'),
        pos = e.currentTarget.getAttribute('data-pos'),
        theKey = e.which;
    this.props.callBack({
      action: 'onKey',
      id: id,
      pos: parseInt(pos, 10),
      theKey: theKey
    });
    if (e.keyCode === 40) {
      e.stopPropagation();
    }
  },
  listKey(e) {
    if (e.keyCode === 40) {
      this.props.callBack({
        action: 'listArrowDown'
      });
    }
  }

});

export default DDS;
