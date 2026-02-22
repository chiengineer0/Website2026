import { trackEvent } from '@/lib/analytics';

type TrackableCtaLinkProps = {
  href: string;
  label: string;
  eventName: string;
  className: string;
};

export function TrackableCtaLink({ href, label, eventName, className }: TrackableCtaLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        trackEvent(eventName, { href, label });
      }}
    >
      {label}
    </a>
  );
}
