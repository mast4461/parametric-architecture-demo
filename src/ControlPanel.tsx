import React, { InputHTMLAttributes } from "react";

type InputType = "range" | "color";
const t = (obj: InputHTMLAttributes<HTMLInputElement> & {type: InputType}) => obj;

const controls = {
  width: t({
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  }),
  height: t({
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  }),
  color: t({
    type: "color",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: "#ed2151",
  }),
};

type ControlName = keyof typeof controls;

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