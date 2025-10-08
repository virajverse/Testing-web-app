import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { t } = useLanguage();

  const categories = [
    { id: 'all', label: t('categories.all') },
    { id: 'websites', label: t('categories.websites') },
    { id: 'mobile-apps', label: t('categories.mobile-apps') },
    { id: 'digital-marketing', label: t('categories.digital-marketing') },
    { id: 'branding', label: t('categories.branding') }
  ];

  return (
    <div className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
