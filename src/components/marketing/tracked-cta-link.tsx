"use client";

import Link, { type LinkProps } from "next/link";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type CtaTrackProperties = {
  pagePath: string;
  surface: string;
  ctaLabel: string;
  ctaHref: string;
};

type TrackedCtaLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName?: string;
    trackProps: CtaTrackProperties;
  };

export function TrackedCtaLink({
  eventName = "marketing_cta_click",
  trackProps,
  onClick,
  ...props
}: TrackedCtaLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    track(eventName, {
      page_path: trackProps.pagePath,
      surface: trackProps.surface,
      cta_label: trackProps.ctaLabel,
      cta_href: trackProps.ctaHref,
    });
  }

  return <Link {...props} onClick={handleClick} />;
}
