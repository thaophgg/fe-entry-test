import React from "react";

import InputControl from "./setting-layout";
import StepperControl, { type StepperControlRef } from './StepperControl'
import OptionControl from "./OptionControl";

export type UnitValueType = {
  value?: number
  unit?: 'percent' | 'pixel'
}
export type UnitValueProps = {
  value?: UnitValueType
  onChange?: (value?: UnitValueProps) => void
}

const UnitValue = () => {
  // const { } = props
  const [unit, setUnit] = React.useState<'percent' | 'pixel'>('percent');
  const stepperControlRef = React.useRef<StepperControlRef>(null);

  const handleUnitChange = (value: string) => {
    const newValue = value as ('percent' | 'pixel');
    setUnit(newValue);

    const stepper = stepperControlRef.current

    if (newValue === 'percent' && stepper && stepper.getValue() > 100) {
      stepperControlRef.current?.setValue(100);
    }
  }

  const handleStepperChange = (value: number) => {
    if (value < 0) {
      stepperControlRef.current?.setValue(0);
    }
  }

  const handleStepperBlur = () => {
    const stepper = stepperControlRef.current
    if (!stepper) return;

    const value = stepper.getValue();
    if (unit === 'percent' && (value > 100)) {
      stepper.setValue(stepper.getPreviousValue());
    }
  }

  return (
    <div className="bg-[#151515] flex flex-col p-4 gap-4">
      <InputControl label="Unit">
        <OptionControl onChange={handleUnitChange} />
      </InputControl>
      <InputControl label="Value">
        <StepperControl
          ref={stepperControlRef}
          onChange={handleStepperChange}
          onBlur={handleStepperBlur}
          min={0}
          max={unit === 'percent' ? 100 : Infinity}
        />
      </InputControl>
    </div>
  )
}

export default React.memo<UnitValueProps>(UnitValue)
