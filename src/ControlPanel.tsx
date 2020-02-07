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

export const controlValues = Object.entries(controls).reduce((acc, [controlName, {defaultValue}]) => {
    acc[controlName] = defaultValue;
    return acc;  
  }, {} as any) as Record<ControlName, any>;

export default class ControlPanel extends React.Component {
  handleInput(event: any) {
    const el = event.target as HTMLInputElement;
    controlValues[el.id as ControlName] = el.value;
    this.forceUpdate();
  };

  render() {
    const handleInput = this.handleInput.bind(this);
    return (
      <div id="control-panel">
        {Object.entries(controls).map(([controlName, options]) => (
          <div key={controlName} className="control-widget">
            <header>{controlName}: {controlValues[controlName as ControlName]}</header>
            <input {...options} id={controlName} onInput={handleInput}/>
            <hr/>
          </div>
        ))}
      </div>
    )
  }
}