interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function Filters({ activeFilter, onFilterChange }: FiltersProps) {
  const categories = ["Todos", "Camisetas", "Calças", "Vestidos", "Acessórios"];
  
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button 
          key={category}
          className={`filter-btn ${
            activeFilter === category
              ? "bg-primary text-white"
              : "bg-white text-neutral-dark"
          } px-4 py-2 rounded-full text-sm shadow`}
          onClick={() => onFilterChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
