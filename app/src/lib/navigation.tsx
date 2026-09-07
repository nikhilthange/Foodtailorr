'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, useParams as useNextParams, usePathname, useSearchParams } from 'next/navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export function Link({ to, href, children, ...props }: LinkProps) {
  const destination = (to && typeof to === 'string' && to.trim() !== '') 
    ? to 
    : (href && typeof href === 'string' && href.trim() !== '') 
      ? href 
      : '/';
  return (
    <NextLink href={destination} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useParams<T extends Record<string, string | string[]>>() {
  const params = useNextParams();
  return (params || {}) as T;
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
  };
}

export { usePathname, useSearchParams };

export default Link;
