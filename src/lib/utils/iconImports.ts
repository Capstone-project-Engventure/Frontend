import React from 'react';

// Centralized icon imports for better tree shaking
// Instead of importing individual icons in each component

// Lucide React Icons (most commonly used)
export {
  Bold as LuBold,
  Italic as LuItalic, 
  Strikethrough as LuStrikethrough,
  Heading1 as LuHeading1,
  Heading2 as LuHeading2,
  List as LuList,
  ListOrdered as LuListOrdered,
  Send as LuSend,
  BookOpen as LuBookOpen,
  Clock as LuClock,
  Check as LuCheck,
  GraduationCap as LuGraduationCap,
  FileText as LuFileText,
  Save as LuSave,
  Eye as LuEye,
  Triangle as LuTriangle,
  EyeOff as LuEyeClosed,
  Volume2 as LuVolume2,
  Award as LuAward,
  Headphones as LuHeadphones
} from 'lucide-react';

// Hero Icons (commonly used)
export {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiX,
  HiSearch,
  HiDownload,
  HiUpload
} from 'react-icons/hi';

// Font Awesome Icons (sparingly used)
export {
  FaUser,
  FaCalendarAlt,
  FaCalendarCheck,
  FaSearch
} from 'react-icons/fa';

export {
  FaRegLightbulb,
  FaEarthAmericas
} from 'react-icons/fa6';

// Other icon libraries
export { BiCategory } from 'react-icons/bi';
export { TbNotes } from 'react-icons/tb';
export { GiSpellBook } from 'react-icons/gi';
export { RiFileUserFill } from 'react-icons/ri';
export { FiSun, FiMoon, FiMonitor, FiVolume2 } from 'react-icons/fi';

// Icon component factory for dynamic loading
export const createIconComponent = (IconComponent: React.ComponentType<any>) => {
  return (props: any) => React.createElement(IconComponent, props);
};

// Lazy icon loader for heavy icon sets
export const loadIconSet = async (iconSet: 'lucide' | 'heroicons' | 'fontawesome') => {
  switch (iconSet) {
    case 'lucide':
      return await import('lucide-react');
    case 'heroicons':
      return await import('react-icons/hi');
    case 'fontawesome':
      return await import('react-icons/fa');
    default:
      return null;
  }
}; 