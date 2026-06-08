import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { SkillCategory } from "../../types";
import DataLoader from "../common/DataLoader";

const Skills = () => {
  const {
    data: skillCategories,
    isLoading,
    error,
  } = useApi<SkillCategory[]>(() => apiService.skills.getAll());

  return (
    <div id="skills" className="mx-auto p-4 md:w-5/6 lg:w-7/12 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-brand-light dark:text-brand-dark">
        Skills
      </h2>
      <DataLoader<SkillCategory>
        isLoading={isLoading}
        error={error}
        data={skillCategories}
        emptyMessage="No skills listed yet."
      >
        {(categories) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-5 border border-gray-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4 text-brand-light dark:text-brand-dark">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill.id} 
                      className="px-3 py-1 bg-white dark:bg-neutral-800 text-sm font-medium rounded-full shadow-sm border border-gray-200 dark:border-neutral-700 text-brand-light dark:text-brand-dark"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DataLoader>
    </div>
  );
};

export default Skills;
