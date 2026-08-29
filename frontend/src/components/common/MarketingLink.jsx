import { Link } from 'react-router-dom';
import { getMarketingHref } from '../../utils/hosts.js';

export default function MarketingLink({ to, children, ...props }) {
  const href = getMarketingHref(to);

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
