import Bio from "../sections/Bio";
import Projects from "../sections/Projects";
import Blog from "../sections/Blog";
import Wallet from "../sections/Wallet";
import Contact from "../sections/Contact";
import { LazySection } from "../common/LazySection";

const HomePage = () => {
  return (
    <>
      <Bio />
      <Projects limit={3} />
      <LazySection>
        <Blog limit={3} />
      </LazySection>
      <LazySection>
        <Wallet limit={4} />
      </LazySection>
      <LazySection>
        <Contact />
      </LazySection>
    </>
  );
};

export default HomePage;
