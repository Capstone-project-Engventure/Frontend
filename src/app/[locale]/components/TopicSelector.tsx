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
}

const CustomSelector = ({ objects, onChange, value }: ObjectSelectProps) => {
  return (
    <Select
      options={objects}
      value={value}
      onChange={onChange}
      isSearchable
      placeholder="Tìm kiếm chủ đề..."
      maxMenuHeight={200} //
      menuPlacement="auto"
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
