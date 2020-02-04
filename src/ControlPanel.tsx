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
  depth: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  },
  height: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.01,
    defaultValue: 1,
  },
};

export class ControlPanel extends React.Component<ControlPanelProps> {
  private controlValues = Object.entries(controls)
    .reduce((acc, [controlName, options]) => {
      acc[controlName] = options.defaultValue;
      return acc;
    }, {} as {[key: string]: any});

  onInput(event: any) {
    this.controlValues[event.target.id] = event.target.value;

    this.forceUpdate();

    this.props.onInput(this.controlValues);
  }

  render() {
    const handleInput = this.onInput.bind(this);
    return (
      <div className="control-panel">
        {Object.entries(controls).map(([controlName, options]) => {
          return (<div key={controlName}>
            <div>&nbsp;{controlName}: {this.controlValues[controlName]}</div>
            <input id={controlName} {...options} onInput={handleInput}></input>
            <hr/>
          </div>);
        })}
      </div>
    )
  }
} 