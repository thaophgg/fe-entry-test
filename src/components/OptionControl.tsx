import React from "react";

export type ValueType =  'pixel' | 'percent';

export type OptionControlProps = {
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}
const LABEL_CLASS = 'text-xs text-[#AAAAAA] leading-5 rounded-[6px] h-8 flex items-center justify-center font-medium cursor-pointer transition-colors duration-200 has-checked:text-[#F9F9F9] has-checked:bg-[#424242] '
const OptionControl = (props: OptionControlProps) => {
  const { value: valueProps, onChange } = props;

  const [value, setValue] = React.useState<ValueType>(valueProps || 'percent');
  const skipOnChange = React.useRef<boolean>(false);

  const handleUnitChange = React.useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const selectedUnit = (e.target as HTMLInputElement).value as ValueType;
    setValue(selectedUnit);
  }, [onChange]);

  React.useEffect(() => {
    if (onChange && !skipOnChange.current) {
      onChange(value);
    }
  }, [value, onChange]);

  React.useEffect(() => {
    if (!valueProps) return;

    skipOnChange.current = true;
    setValue(valueProps);
    setTimeout(() => skipOnChange.current = false);
  }, [valueProps])
  
  return (
      <div className="w-full p-0.5 gap-0.5 inline-flex items-center bg-[#212121] rounded-lg *:grow *:text-center *:select-none">
        <label htmlFor="unit-px-1" className={LABEL_CLASS}>
          <input
            name="unit-1"
            id="unit-px-1"
            type="radio"
            value="percent"
            className="hidden"
            defaultChecked={value === 'percent'}
            onClick={handleUnitChange}
          />
          %
        </label>

        <label htmlFor="unit-percent-1" className={LABEL_CLASS}>
          <input
            name="unit-1"
            id="unit-percent-1"
            type="radio"
            value="pixel"
            defaultChecked={value === 'pixel'}
            className="peer/percent hidden"
            onClick={handleUnitChange}
          />
          px
        </label>
      </div>

  )
}

OptionControl.displayName = 'OptionControl';

export default React.memo(OptionControl);