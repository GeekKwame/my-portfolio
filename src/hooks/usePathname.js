import { useEffect, useState } from 'react';
import { currentPath, onNavigate } from '../routing/navigation';

export default function usePathname(initialPath) {
  const [path, setPath] = useState(() => initialPath ?? currentPath());

  useEffect(() => onNavigate(() => setPath(currentPath())), []);

  return path;
}
