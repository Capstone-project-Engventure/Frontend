// components/TopicSelect.tsx
import Select from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface TopicSelectProps {
  topics: OptionType[];
  onChange: (value: OptionType | null) => void;
  value?: OptionType | null;
}

const TopicSelect = ({ topics, onChange, value }: TopicSelectProps) => {
  return (
    <Select
      options={topics}
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

export default TopicSelect;
