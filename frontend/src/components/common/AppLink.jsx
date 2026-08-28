import { Link } from 'react-router-dom';
import { getAppHref } from '../../utils/hosts.js';

export default function AppLink({ to, children, ...props }) {
  const href = getAppHref(to);

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
}
