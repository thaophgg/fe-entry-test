import React from "react";

type SettingTitleProps = {
  label: string
}
const SettingTitle = (props: SettingTitleProps) => {
  const { label } = props
  return <span className={'grow text-[#AAAAAA] text-xs leading-5 font-normal'}>{label}</span>
}

export default React.memo(SettingTitle)