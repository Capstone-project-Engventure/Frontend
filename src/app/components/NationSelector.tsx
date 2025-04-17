import React from "react";
import { NationOptions, NationEnum } from "@/lib/constants/nation";

type GenderSelectProps = {
  value: NationEnum;
  onChange: (value: NationEnum) => void;
  className?: string;
};

const NationSelect: React.FC<GenderSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as NationEnum)}
      className={className}
    >
      {NationOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default NationSelect;
