import { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

// CMS-editable links can be internal paths ("/services"), in-page anchors ("#services") or full URLs.
// Router <Link> breaks external URLs and a plain <a> reloads the whole app for internal ones.
export default function SmartLink({ to, children, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = to || '/';
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    const external = /^https?:/i.test(href);
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}
