import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { Experience as ExperienceType } from "../../types";
import DataLoader from "../common/DataLoader";

const Experience = () => {
  const {
    data: experiences,
    isLoading,
    error,
  } = useApi<ExperienceType[]>(() => apiService.experience.getAll());

  return (
    <div id="experience" className="mx-auto p-4 md:w-5/6 lg:w-7/12 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-brand-light dark:text-brand-dark">
        Experience
      </h2>
      <DataLoader<ExperienceType[]>
        isLoading={isLoading}
        error={error}
        data={experiences}
        emptyMessage="No experience listed yet."
      >
        {(data) => (
          <div className="space-y-6">
            {data.map((exp) => (
              <div key={exp.id} className="border-l-2 border-brand-light dark:border-brand-dark pl-4 ml-2">
                <h3 className="text-xl font-semibold text-brand-light dark:text-brand-dark">
                  {exp.role}
                </h3>
                <div className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
                  {exp.company}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-500 mb-3 font-mono">
                  {exp.start_date} - {exp.end_date || "Present"}
                </div>
                <p className="text-sm whitespace-pre-line text-neutral-700 dark:text-neutral-300">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </DataLoader>
    </div>
  );
};

export default Experience;
