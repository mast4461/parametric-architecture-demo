import React from "react";

export default class ControlPanel extends React.Component {
  render() {
    return (
      <div id="control-panel">
        <div>
          <input type="range"/>
          <hr/>
        </div>
        <div>
          <input type="color"/>
          <hr/>
        </div>
      </div>
    )
  }
}