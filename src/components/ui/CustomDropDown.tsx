import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    className?: string;
}

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    disabled = false,
    className = '',
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string) => {
        onChange(value);
        setIsOpen(false);
        setSearchTerm('');
    };

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`w-full flex items-center justify-between p-2 border rounded-md text-left ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
                    } ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className={`truncate ${!value ? 'text-gray-400' : ''}`}>
                    {selectedOption?.label || placeholder}
                </span>
                <FiChevronDown
                    className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white p-2 border-b">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                        }`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;