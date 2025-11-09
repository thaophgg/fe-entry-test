import React from "react";
import SettingTitle from "./SettingTitle";

type SettingLayoutProps = {
  label: string;
  children: React.ReactNode;
}

const SettingLayout = (props: SettingLayoutProps) => {
  const { label, children} = props;
  return (
    <div className={'w-[248px] flex gap-2 items-center'}>
      <SettingTitle label={label}/>
      <div className="w-[140px]">{children}</div>
    </div>
  )
}
export default React.memo(SettingLayout);