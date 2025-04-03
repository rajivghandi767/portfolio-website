// src/components/pages/ProjectsPage.tsx
import Projects from "../sections/Projects";
import { Section } from "../common/Section";

const ProjectsPage = () => {
  return (
    <Section id="projects-page">
      <Projects limit={12} /> {/* Show more projects on the dedicated page */}
    </Section>
  );
};

export default ProjectsPage;
