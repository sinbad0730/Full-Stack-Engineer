import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  value?: string;
  className?: string;
  link?: string;
  iconcolor?: string;
  iconSVG?: React.FC<{ className: string }>;
  buttoncolor?: string;
  buttonhovercolor?: string;
  type?: "button" | "submit" | "reset";
  elementType?: "input" | "button";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  link,
  value,
  iconSVG: IconSVGComponent,
  buttoncolor,
  buttonhovercolor,
  type,
  elementType,
}) => {
  const commonProps = {
    onClick,
    type,
    className: `text-white font-semibold drop-shadow-2xl border-none py-5 px-10 rounded-xl text-[1.6rem] flex flex-row gap-4 justify-center items-center cursor-pointer ${buttoncolor} ${buttonhovercolor} max-lg:text-3xl max-lg:py-8 max-lg:px-16 max-lg:rounded-2xl
    shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out w-max backdrop-blur-sm`,
  };

  if (elementType === "input") {
    return <input {...commonProps} value={value}></input>;
  } else {
    return (
      <Link to={link || ""} className="no-underline">
        <button {...commonProps}>
          {IconSVGComponent ? (
            <IconSVGComponent className={"w-max h-10"} />
          ) : (
            <img
              src={buttoncolor || ""}
              alt={`${label}-icon`}
              className={`bg-[${buttoncolor || ""}] w-16 `}
            />
          )}
          {label}
        </button>
      </Link>
    );
  }
};

export default Button;
