import Select, { 
  SingleValue, 
  MultiValue, 
  StylesConfig, 
  components,
  DropdownIndicatorProps 
} from "react-select";
import { HiChevronDown, HiX } from "react-icons/hi";

export interface OptionType {
  value: string;
  label: string;
}

// Single select props
interface SingleSelectProps {
  objects: OptionType[];
  onChange: (value: OptionType | null) => void;
  value?: OptionType | null;
  placeholder: string;
  multiple?: false;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
}

// Multiple select props
interface MultipleSelectProps {
  objects: OptionType[];
  onChange: (value: OptionType[]) => void;
  value?: OptionType[];
  placeholder: string;
  multiple: true;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
}

type ObjectSelectProps = SingleSelectProps | MultipleSelectProps;

// Custom components for better styling
const DropdownIndicator = (props: DropdownIndicatorProps<OptionType, boolean>) => {
  return (
    <components.DropdownIndicator {...props}>
      <HiChevronDown className="w-4 h-4 text-gray-400" />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <HiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
    </components.ClearIndicator>
  );
};

const CustomSelector = ({
  objects,
  onChange,
  value,
  placeholder,
  multiple = false,
  disabled = false,
  loading = false,
  error = false
}: ObjectSelectProps) => {

  // Unified onChange handler for react-select
  const handleChange = (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
  ) => {
    if (multiple) {
      (onChange as MultipleSelectProps['onChange'])(Array.isArray(newValue) ? newValue : []);
    } else {
      (onChange as SingleSelectProps['onChange'])(newValue as SingleValue<OptionType>);
    }
  };

  // Custom styles with dark mode support
  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: error 
        ? '#ef4444' 
        : state.isFocused 
          ? '#3b82f6' 
          : 'rgb(209, 213, 219)',
      borderRadius: '8px',
      boxShadow: state.isFocused 
        ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
        : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
      },
      backgroundColor: disabled 
        ? 'rgb(243, 244, 246)' 
        : 'rgb(255, 255, 255)',
      cursor: disabled ? 'not-allowed' : 'default',
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: disabled 
          ? 'rgb(55, 65, 81)' 
          : 'rgb(31, 41, 55)',
        borderColor: error 
          ? '#ef4444' 
          : state.isFocused 
            ? '#3b82f6' 
            : 'rgb(75, 85, 99)',
        color: 'rgb(243, 244, 246)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6b7280',
      fontSize: '14px',
    }),
    input: (base) => ({
      ...base,
      fontSize: '14px',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgb(229, 231, 235)',
      zIndex: 50,
      backgroundColor: 'rgb(255, 255, 255)',
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(31, 41, 55)',
        border: '1px solid rgb(75, 85, 99)',
      },
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: '6px',
      margin: '2px 0',
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
          ? '#eff6ff'
          : 'transparent',
      color: state.isSelected
        ? 'white'
        : state.isFocused
          ? '#1e40af'
          : '#374151',
      fontSize: '14px',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#eff6ff',
      borderRadius: '6px',
      border: '1px solid #bfdbfe',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1e40af',
      fontSize: '13px',
      fontWeight: '500',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6b7280',
      borderRadius: '0 6px 6px 0',
      '&:hover': {
        backgroundColor: '#fca5a5',
        color: '#dc2626',
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: '#6b7280',
      fontSize: '14px',
      padding: '12px',
    }),
    loadingMessage: (base) => ({
      ...base,
      color: '#6b7280',
      fontSize: '14px',
      padding: '12px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const formatOptionLabel = (option: OptionType) => (
    <div className="flex items-center">
      <span className="text-sm font-medium">{option.label}</span>
    </div>
  );

  return (
    <div className="w-full">
      <Select<OptionType, boolean>
        options={objects}
        value={value}
        isSearchable
        isClearable
        onChange={handleChange}
        isLoading={loading}
        isMulti={multiple}
        placeholder={placeholder}
        maxMenuHeight={200}
        menuPlacement="auto"
        menuPosition="absolute"
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        components={{
          DropdownIndicator,
          ClearIndicator,
        }}
        noOptionsMessage={() => "No options found"}
        loadingMessage={() => "Loading..."}
        // Performance optimizations
        filterOption={(option, inputValue) => {
          return option.label?.toLowerCase()?.includes(inputValue.toLowerCase()) || false;
        }}
        // Accessibility improvements
        aria-label={placeholder}
        inputId="topic-select"
        name="topic-select"
      />
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          Please select a valid option
        </p>
      )}
      
      {/* Helper text for multiple select */}
      {multiple && value && Array.isArray(value) && value.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length} topic{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default CustomSelector;