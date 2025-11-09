import React from "react";

import InputControl from "./setting-layout";
import StepperControl, { type StepperControlRef } from './StepperControl'
import OptionControl, { type ValueType as UnitType } from "./OptionControl";

export type UnitValueType = {
  value?: number;
  unit?: UnitType;
}
export type UnitValueProps = {
  value?: UnitValueType;
  onChange?: (value?: UnitValueType) => void;
}

const DEFAULT_VALUE: UnitValueType = { unit: 'pixel', value: 1.0 };

const UnitValue = (props: UnitValueProps) => {
  const { value: valueProps, onChange } = props
  
  const [value, setValue] = React.useState<UnitValueType>(valueProps || DEFAULT_VALUE);
  const stepperControlRef = React.useRef<StepperControlRef>(null);
  const skipOnChange = React.useRef<boolean>(false);

  const handleUnitChange = React.useCallback((value: string) => {
    const newValue = value as UnitType;
    setValue(oldValue => ({ value: oldValue?.value, unit: newValue }));

    const stepper = stepperControlRef.current

    if (newValue === 'percent' && stepper && stepper.getValue() > 100) {
      stepperControlRef.current?.setValue(100);
    }
  }, []);

  const handleStepperChange = React.useCallback((value: number) => {
    
  }, []);

  const handleStepperBlur = React.useCallback(() => {
    const stepper = stepperControlRef.current
    if (!stepper) return;

    const stepperValue = stepper.getValue();

    if (value.unit === 'percent' && (stepperValue > 100)) {
      stepper.setValue(stepper.getPreviousValue());
    }
    if (stepperValue < 0) {
      stepperControlRef.current?.setValue(0);
    }

  }, [value]);

  React.useEffect(() => {
    if (onChange && !skipOnChange.current) {
      onChange(value);
    }
  }, [onChange, value]);

  React.useEffect(() => {
    skipOnChange.current = true;
    setValue(valueProps || DEFAULT_VALUE);
    setTimeout(() => skipOnChange.current = false);
  }, [valueProps]);

  return (
    <div className="bg-[#151515] flex flex-col p-4 gap-4">
      <InputControl label="Unit">
        <OptionControl
          onChange={handleUnitChange}
          value={value.unit}
        />
      </InputControl>
      <InputControl label="Value">
        <StepperControl
          value={value.value}
          ref={stepperControlRef}
          onChange={handleStepperChange}
          onBlur={handleStepperBlur}
          min={0}
          max={value.unit === 'percent' ? 100 : Infinity}
          step={1}
        />
      </InputControl>
    </div>
  )
}

export default React.memo<UnitValueProps>(UnitValue)
