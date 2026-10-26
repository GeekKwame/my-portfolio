import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import GlobeFallback from './globe/GlobeFallback';

const HeroGlobe = lazy(() => import('./HeroGlobe'));

class GlobeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div className="relative aspect-square"><GlobeFallback message="Interactive Earth is unavailable. Explore my work below." /></div>
      : this.props.children;
  }
}

/** Mobile visitors download WebGL only when the Earth approaches the viewport. */
export default function GlobeExperience() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEnabled(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const placeholder = <div className="globe-placeholder"><div className="relative aspect-square"><GlobeFallback /></div></div>;
  return <div ref={ref} className="globe-shell"><GlobeBoundary>{enabled ? <Suspense fallback={placeholder}><HeroGlobe /></Suspense> : placeholder}</GlobeBoundary></div>;
}
