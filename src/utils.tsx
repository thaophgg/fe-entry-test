import React from "react";
export const usePreviousPersistent = (value?: any) => {
  const ref = React.useRef({
    value: value,
    prev: undefined
  })
  
  const current = ref.current.value || undefined

  if (value !== current) {
    ref.current = {
      value: value,
      prev: current
    }
  }

  return ref.current.prev
}


const EPSILON = 1e-10;
export function approxEqual(a: number, b: number, eps = EPSILON) {
  return Math.abs(a - b) < eps;
}
