import React from "react";

type OptionControlProps = {
  onChange?: (value: string) => void;
}
const LABEL_CLASS = 'text-xs text-[#AAAAAA] leading-5 rounded-[6px] h-8 flex items-center justify-center font-medium cursor-pointer transition-colors duration-200 has-checked:text-[#F9F9F9] has-checked:bg-[#424242] '
const OptionControl = (props: OptionControlProps) => {
  const { onChange } = props;
  const handleUnitChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const selectedUnit = (e.target as HTMLInputElement).value;
    onChange?.(selectedUnit);
  }
  
  return (
      <div className="w-full p-0.5 gap-0.5 inline-flex items-center bg-[#212121] rounded-lg *:grow *:text-center *:select-none">
        <label htmlFor="unit-px-1" className={LABEL_CLASS}>
          <input
            name="unit-1"
            id="unit-px-1"
            type="radio"
            value="percent"
            className="hidden"
            defaultChecked
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
            className="peer/percent hidden"
            onClick={handleUnitChange}
          />
          px
        </label>
      </div>

  )
}

export default React.memo(OptionControl);