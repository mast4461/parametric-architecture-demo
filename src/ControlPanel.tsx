import React, { InputHTMLAttributes } from "react";

export interface ControlPanelProps {
  onInput: Function;
}

const controls: {[key: string]: InputHTMLAttributes<HTMLInputElement>} = {
  width: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  },
  // depth: {
  //   type: "range",
  //   min: 1,
  //   max: 10,
  //   step: 0.01,
  //   defaultValue: 1,
  // },
  height: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  },
  cellWidth: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 1,
  },
  cellHeight: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 1,
  },
  // mainColor: {
  //   type: "color",
  //   defaultValue: "#8471ff",
  // }
};

const getters: {[type: string]: (el: HTMLInputElement) => any} = {
  range: el => el.valueAsNumber,
  color: el => el.value,
}

export const controlValues = Object.entries(controls)
  .reduce((acc, [controlName, options]) => {
    acc[controlName] = options.defaultValue;
    return acc;
  }, {} as {[key: string]: any});

export class ControlPanel extends React.Component<ControlPanelProps> {

  onInput(event: any) {
    controlValues[event.target.id] = getters[event.target.type](event.target);

    this.forceUpdate();

    this.props.onInput(controlValues);
  }

  render() {
    const handleInput = this.onInput.bind(this);
    return (
      <div className="control-panel">
        {Object.entries(controls).map(([controlName, options]) => {
          return (<div key={controlName}>
            <div>&nbsp;{controlName}: {controlValues[controlName]}</div>
            <input id={controlName} {...options} onInput={handleInput}></input>
            <hr/>
          </div>);
        })}
      </div>
    )
  }
} 