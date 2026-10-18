import { FaGithub } from 'react-icons/fa';
import { trackProjectView, trackSocialClick } from '../utils/analytics';

const external = { target: '_blank', rel: 'noopener noreferrer' };

/** Live demo and source links. `variant="text"` renders quiet inline links for dense lists. */
function ProjectLinks({ project, variant = 'buttons', className = '' }) {
  const { live, source } = project.links ?? {};
  if (!live && !source) return null;

  const track = (kind) => () => {
    trackProjectView(project.title);
    trackSocialClick(kind);
  };

  if (variant === 'text') {
    return (
      <p className={`flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] ${className}`}>
        {live && (
          <a href={live} {...external} onClick={track('live_demo')} className="link"
            aria-label={`${project.shortTitle} live demo (opens in a new tab)`}>
            Live demo <span aria-hidden="true">↗</span>
          </a>
        )}
        {source && (
          <a href={source} {...external} onClick={track('github_repo')} className="link"
            aria-label={`${project.shortTitle} source on GitHub (opens in a new tab)`}>
            Source <span aria-hidden="true">↗</span>
          </a>
        )}
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {live && (
        <a href={live} {...external} onClick={track('live_demo')} className="btn-primary !min-h-[42px] !px-4"
          aria-label={`${project.shortTitle} live demo (opens in a new tab)`}>
          Live demo <span aria-hidden="true">↗</span>
        </a>
      )}
      {source && (
        <a href={source} {...external} onClick={track('github_repo')} className="btn-secondary !min-h-[42px] !px-4"
          aria-label={`${project.shortTitle} source on GitHub (opens in a new tab)`}>
          <FaGithub size={15} aria-hidden="true" /> Source
        </a>
      )}
    </div>
  );
}

export default ProjectLinks;
