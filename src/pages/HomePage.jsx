import Home from '../components/Home';
import FeaturedProjects from '../components/FeaturedProjects';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import About from '../components/About';
import Contact from '../components/Contact';
import useDocumentMeta from '../hooks/useDocumentMeta';
import useReveal from '../hooks/useReveal';
import { SEO } from '../config/constants';
import { ROUTES } from '../routing/navigation';

export default function HomePage() {
  useReveal();
  useDocumentMeta({ title: SEO.title, description: SEO.description, path: ROUTES.home });

  return (
    <>
      <Home />
      <FeaturedProjects />
      <Services />
      <Skills />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
