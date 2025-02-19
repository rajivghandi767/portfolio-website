import { React, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Layout component for all pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen m-auto font-mono scroll-smooth text-gray-950 dark:text-gray-50 pt-2 pb-2">
      <div className="block sticky top-0 z-50">
        <Banner isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <NavBar isMenuOpen={isMenuOpen} />
      </div>
      <main className="pb-16">{children}</main>
      <Footer />
    </div>
  );
};

// Home page includes all sections for scrolling navigation
const HomePage = () => (
  <>
    <Bio />
    <Projects />
    <Blog />
    <Wallet />
    <Contact />
  </>
);
const ProjectsPage = () => <Projects />;
const BlogListPage = () => <Blog />;
const WalletPage = () => <Wallet />;
const ContactPage = () => <Contact />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Main pages */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <ProjectsPage />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <BlogListPage />
            </Layout>
          }
        />
        <Route
          path="/wallet"
          element={
            <Layout>
              <WalletPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />

        {/* Blog post detail page */}
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Catch-all redirect to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
