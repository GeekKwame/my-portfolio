import { useEffect, useState } from 'react';
import { currentPath, onNavigate } from '../routing/navigation';

export default function usePathname() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => onNavigate(() => setPath(currentPath())), []);

  return path;
}
