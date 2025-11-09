import React from "react";

import Tooltip from "./Tooltip";
import { approxEqual } from "../utils";

export type StepperControlProps = {
  value?: number;
  defaultValue?: number;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  onChange?: (value: number) => void;
  formater?: (value: string) => string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export type StepperControlRef = {
  setValue: (value?: number) => void;
  disable: (control?: 'increase' | 'decrease') => void;
  enable: (control?: 'increase' | 'decrease') => void;
  getValue: () => number;
  getPreviousValue: () => number;
}

const plusIcon = <svg width="20" height="20" viewBox="0 0 20 20" className="group-disabled/button:fill-[#AAAAAA] fill-[#f9f9f9]" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.75 4.75C10.75 4.33579 10.4142 4 10 4C9.58579 4 9.25 4.33579 9.25 4.75V9.25H4.75C4.33579 9.25 4 9.58579 4 10C4 10.4142 4.33579 10.75 4.75 10.75H9.25L9.25 15.25C9.25 15.6642 9.58579 16 10 16C10.4142 16 10.75 15.6642 10.75 15.25V10.75H15.25C15.6642 10.75 16 10.4142 16 10C16 9.58579 15.6642 9.25 15.25 9.25H10.75V4.75Z" />
</svg>
const minusIcon = <svg width="20" height="20" viewBox="0 0 20 20" className="group-disabled/button:fill-[#AAAAAA] fill-[#f9f9f9]" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M4 9.75C4 9.33579 4.33579 9 4.75 9L15.25 9C15.6642 9 16 9.33579 16 9.75C16 10.1642 15.6642 10.5 15.25 10.5H4.75C4.33579 10.5 4 10.1642 4 9.75Z" />
</svg>

const STEPPER_BUTTON_CLASS = 'bg-transparent focus:ring-transparent cursor-pointer transition-colors outline-none hover:bg-[#3B3B3B] peer-hover:bg-[#3B3B3B] peer-focus:bg-[#212121]'

const defaultFormater = (value?: string, defaultValue: string = '0') => {
  if (!value) return defaultValue;

  if (/^-/.test(value)) {
    return '0';
  }

  if (/(\.+\d*){2,}/.test(value)) { // Remove .2323.2312.2323
    return defaultValue;
  }

  const match = value.match(/^(\d+(\.\d+)?).*/);

  if (match) {
    return match[1]
  }

  return defaultValue;
}

const StepperControl = React.forwardRef<StepperControlRef, StepperControlProps>((props, ref) => {
  const {
    onChange,
    formater,
    precision = 1,
    value: valueProps,
    defaultValue = 1.0,
    onBlur,
    min = 0,
    max,
    step = 1.0
  } = props;

  const [value, setValue] = React.useState<string>(`${(valueProps || defaultValue).toFixed(precision)}`);
  const [disableDecrease, setDisableDecrease] = React.useState<boolean>(false);
  const [disableIncrease, setDisableIncrease] = React.useState<boolean>(false);
  const prevValueThatValid = React.useRef<string>(`${(valueProps || defaultValue).toFixed(precision)}`);

  const skipOnChange = React.useRef<boolean>(false);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw
      .replace(/,/g, '.') // replace all ',' with '.'
      .replace(/\.+/g, '.') // remove dunplicate '.'
      .replace(/\s+/g, '') // delete all spaces
      .replace(/(\d+)-/, '-$1') // move '-' to the front
      .replace(/-0/, '-') // remove leading zero after '-'
      .replace(/^0([^.\n]+)/, '$1') // remove leading zero, but keep '0' itself
    setValue(cleaned);
  }, []);

  const handleIncrease = React.useCallback(() => {
    setValue((prev) => {
      const num = parseFloat(prev) || 0;
      const newValue = (num + step).toFixed(precision)
      if (isValid(newValue)) {
        prevValueThatValid.current = newValue
        return newValue;
      } else {
        prevValueThatValid.current = `${max}`;
        return `${max ?? prev}`
      }
    });
  }, [step, precision, max]);

  const handleDecrease = React.useCallback(() => {
    setValue((prev) => {
      const num = parseFloat(prev) || 0;
      const newValue = (num - step).toFixed(precision)
      if (isValid(newValue)) {
        prevValueThatValid.current = newValue
        return newValue;
      } else {
        prevValueThatValid.current = `${min}`;
        return `${min ?? prev}`
      }
    });
  }, [step, precision, min]);

  const isValid = React.useCallback((val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return false;

    if (num < min) return false;

    if (max !== undefined && num > max) return false;

    return true;
  }, [min, max]);

  const handleBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>((e) => {
    const value = e.target.value;

    if (!value) {
      setValue('0');
      return;
    }

    let newValue: string;
    if (formater) {
      newValue = formater(value);
    } else {
      newValue = defaultFormater(value, prevValueThatValid.current);
    }

    if (newValue !== prevValueThatValid.current && isValid(newValue)) {
      prevValueThatValid.current = newValue;
    }

    setValue(newValue);
    onBlur?.(e);
  }, [formater, onBlur, isValid]);

  React.useImperativeHandle(ref, () => ({
    setValue(value?: number) {
      skipOnChange.current = true;
      setValue(`${value}` || prevValueThatValid.current);
      setTimeout(() => skipOnChange.current = false);
    },
    disable(control) {
      if (control === 'increase') {
        setDisableIncrease(true);
      } else if (control === 'decrease') {
        setDisableDecrease(true);
      } else {
        setDisableDecrease(true);
        setDisableIncrease(true);
      }
    },
    enable(control) {
      if (control === 'increase') {
        setDisableIncrease(false);
      } else if (control === 'decrease') {
        setDisableDecrease(false);
      } else {
        setDisableDecrease(false);
        setDisableIncrease(false);
      }
    },
    getValue() {
      return parseFloat(value);
    },
    getPreviousValue() {
      return parseFloat(prevValueThatValid.current);
    }
  }), [value]);

  React.useEffect(() => {
    if (!skipOnChange.current) onChange?.(parseFloat(value));
  }, [value, onChange]);

  React.useEffect(() => {
    skipOnChange.current = true;
    setValue((valueProps || defaultValue).toFixed(precision));
    setTimeout(() => skipOnChange.current = false);
  }, [valueProps, defaultValue, precision]);

  React.useEffect(() => { // if value reaches min or max, disable corresponding button
    if (approxEqual(parseFloat(value), min)) {
      setDisableDecrease(true);
    } else if (disableDecrease) {
      setDisableDecrease(false);
    }

    if (max !== undefined) {
      if (approxEqual(parseFloat(value), max) || parseFloat(value) > max) {
        setDisableIncrease(true);
      } else if (disableIncrease) {
        setDisableIncrease(false);
      }
    }

  }, [value, disableDecrease, disableIncrease, min, max]);

  return (
    <>
      <div
        className="grid grid-cols-[36px_minmax(50px,1fr)_36px] bg-[#212121] *:w-full *:text-center rounded-lg transition-all duration-200 
        box-border focus-within:outline-1 focus-within:outline-[#3C67FF]"
      >
        <input
          type="text"
          id="quantity-input"
          className="order-2 peer bg-transparent text-center text-[#F9F9F9] text-sm h-9 hover:bg-[#3B3B3B] transition-colors focus:bg-[#212121] focus:outline-none"
          onChange={handleChange}
          value={value}
          onBlur={handleBlur}
          required
        />

        <Tooltip
          title="Value must greater than 0"
          className={`${STEPPER_BUTTON_CLASS} rounded-s-lg order-1`}
          isShow={disableDecrease}
        >
          <button
            type="button"
            id="decrement-button"
            data-input-counter-decrement="quantity-input"
            className="group/button h-full"
            onClick={handleDecrease}
            disabled={disableDecrease}
          >
            {minusIcon}
          </button>
        </Tooltip>

        <Tooltip
          title="Value must smaller than 100"
          className={`${STEPPER_BUTTON_CLASS} rounded-e-lg order-3`}
          isShow={disableIncrease}
        >
          <button
            type="button"
            id="increment-button"
            className="group/button h-full"
            onClick={handleIncrease}
            disabled={disableIncrease}
          >
            {plusIcon}
          </button>
        </Tooltip>
      </div>
    </>
  )
})

export default React.memo(StepperControl)
