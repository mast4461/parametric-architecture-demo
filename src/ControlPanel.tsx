import React, { InputHTMLAttributes } from "react";

export interface ControlPanelProps {
  onInput: Function;
}

const controls: {[key: string]: InputHTMLAttributes<HTMLInputElement>} = {
  width: {
    type: "range",
    min: 100,
    max: 40*100,
    step: 1,
    defaultValue: 20*100,
  },
  depth: {
    type: "range",
    min: 100,
    max: 40*100,
    step: 1,
    defaultValue: 10*100,
  },
  height: {
    type: "range",
    min: 100,
    max: 30*100,
    step: 1,
    defaultValue: 12*100,
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
            <div>{controlName} {this.controlValues[controlName]}</div>
            <input id={controlName} {...options} onInput={handleInput}></input>
            <hr/>
          </div>);
        })}
      </div>
    )
  }
} 