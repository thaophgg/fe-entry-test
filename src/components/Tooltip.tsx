import React from 'react';

type TooltipProps = {
  title: string;
  className?: string;
  isShow?: boolean;
}

const ButtonControl = (props: React.PropsWithChildren<TooltipProps>) => {
  const { title, className, isShow = true, children } = props;
  const id = React.useId()

  return (
    <>
    <div id={id} className={`relative inline-block group/tooltip ${className || ''}`}>
      {children}
      <label
        hidden={!isShow}
        htmlFor={id}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
                   opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
                   transition-all duration-200 pointer-events-none whitespace-nowrap z-10
                   bg-[#212121] text-[#F9F9F9] text-xs font-normal leading-5 rounded-lg
                  ">
        {title}
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none"
          className="absolute top-full left-1/2 -translate-x-1/2 w-2 fill-gray-800"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6.99382e-07L4 4L0 0L8 6.99382e-07Z" fill="#212121" />
        </svg>
      </label>
    </div>
    
    </>
  );
};

export default React.memo(ButtonControl);