import Link from '../components/Link';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { PERSONAL_INFO } from '../config/constants';
import { ROUTES, currentPath } from '../routing/navigation';

export default function NotFoundPage() {
  useDocumentMeta({
    title: `Page not found | ${PERSONAL_INFO.name}`,
    description: 'This page does not exist.',
    path: currentPath(),
  });

  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center pt-28 pb-24">
      <p className="label">404</p>
      <h1 className="section-title mt-3 max-w-[16ch]">There&apos;s nothing at this address.</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to={ROUTES.home} className="btn-primary">Back to the homepage</Link>
        <Link to={ROUTES.projects} className="btn-secondary">Browse projects</Link>
      </div>
    </div>
  );
}
