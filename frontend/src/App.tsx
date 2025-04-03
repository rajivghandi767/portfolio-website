// src/App.tsx
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Lazy-loaded page components
const HomePage = lazy(() => import("./components/pages/HomePage"));
const ProjectsPage = lazy(() => import("./components/pages/ProjectsPage"));
const BlogPage = lazy(() => import("./components/pages/BlogPage"));
const BlogPost = lazy(() => import("./components/pages/BlogPost"));
const WalletPage = lazy(() => import("./components/pages/WalletPage"));
const ContactPage = lazy(() => import("./components/pages/ContactPage"));

// Layout component for all pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen m-auto font-mono scroll-smooth pt-2 pb-2 flex flex-col">
      <Header />
      <main className="pb-16 flex-grow">
        <Suspense
          fallback={
            <div className="flex justify-center items-center pt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
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

          {/* Blog routes */}
          <Route
            path="/blog"
            element={
              <Layout>
                <BlogPage />
              </Layout>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <Layout>
                <BlogPost />
              </Layout>
            }
          />

          {/* Other pages */}
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

          {/* Catch-all redirect to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
