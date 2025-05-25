import React from "react";
import { GenderOptions, GenderEnum } from "@/lib/constants/gender";

type GenderSelectProps = {
  value: GenderEnum;
  onChange: (value: GenderEnum) => void;
  className?: string;
};

const GenderSelect: React.FC<GenderSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as GenderEnum)}
      className={className}
    >
      {GenderOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default GenderSelect;
