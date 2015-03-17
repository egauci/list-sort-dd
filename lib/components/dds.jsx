'use strict';

import React from 'react';

let DDS = React.createClass({
  propTypes: {
    list: React.PropTypes.array.esRequired
  },
  render() {
    return (
      <div className="dds">
        <ul>
          this.props.list.map(itm => {
            return (
              <li key={itm.id}
              >itm.label</li>
            );
          });
        </ul>
      </div>
    );
  }

});

export default DDS;
