'use strict';

import React from 'react';

let DDS = React.createClass({
  propTypes: {
    list: React.PropTypes.array.isRequired
  },
  onDragStart(e) {
    debugger;
  },
  render() {
    return (
      <div className="dds">
        <ul>
          {
            this.props.list.map(itm => {
              return (
                <li
                  key={itm.id}
                  data-id={itm.id}
                  draggable="true"
                  tabIndex="0"
                  aria-grabbed={itm.dragging ? "true" : "false"}
                  aria-dropeffect="none"
                  onDragStart={this.onDragStart}
                >
                  {itm.label}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

});

export default DDS;
