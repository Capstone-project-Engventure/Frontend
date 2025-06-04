// components/TopicSelect.tsx
import Select from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface ObjectSelectProps {
  objects: OptionType[];
  onChange: (value: OptionType | null) => void;
  value?: OptionType | null;
  placeholder?: string;
  multiple?: boolean;
}

const CustomSelector = ({
  objects,
  onChange,
  value,
  placeholder,
  multiple=false
}: ObjectSelectProps) => {
  return (
    <Select
      options={objects}
      value={value}
      onChange={onChange}
      isSearchable
      placeholder={placeholder || "Tìm kiếm chủ đề..."}
      maxMenuHeight={200} //
      menuPlacement="auto"
      menuPosition="absolute"
      isClearable={true}
      isMulti={multiple}
      styles={{
        menuList: (base) => ({
          ...base,
          maxHeight: "300px",
        }),
      }}
    />
  );
};

export default CustomSelector;
