import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import SkipToContent from "./components/SkipToContent";
import StructuredData from "./components/StructuredData";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastProvider } from "./context/ToastContext";
import ThemeProvider from "./theme/ThemeProvider";
import usePathname from "./hooks/usePathname";
import { ROUTES, scrollToHash } from "./routing/navigation";

const PAGES = {
  [ROUTES.home]: HomePage,
  [ROUTES.projects]: ProjectsPage,
};

function App({ initialPath }) {
  const path = usePathname(initialPath);
  const Page = PAGES[path] ?? NotFoundPage;

  // The browser tries to jump to the hash before React has rendered the target.
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <StructuredData />
          <SkipToContent />
          <ScrollProgress />
          <NavBar path={path} />
          <main id="main" tabIndex={-1} className="outline-none">
            <Page key={path} />
          </main>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
