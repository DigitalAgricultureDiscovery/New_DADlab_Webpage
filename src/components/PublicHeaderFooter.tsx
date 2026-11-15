import { routeHref } from '../lib/routing';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SiteProfile, UserAccount } from '../types/cms';

export interface NavItem {
  label: string;
  path: string;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'People', path: '/people' },
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Teaching', path: '/teaching' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Contact', path: '/contact' },
];

interface HeaderProps {
  profile: SiteProfile;
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: UserAccount | null;
}

export const PublicHeader: React.FC<HeaderProps> = ({
  profile,
  currentPath,
  onNavigate,
  currentUser,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white border-b border-[#CFB991]/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href={routeHref('/')}
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-white hover:text-[#CFB991] transition-colors max-w-[55%] lg:max-w-[30%] leading-tight shrink-0"
        >
          {profile.shortTitle}
        </a>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary Navigation">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={routeHref(item.path)}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`relative py-1 text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active ? 'text-[#CFB991]' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#CFB991]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={routeHref('/admin')}
            onClick={(e) => handleLinkClick(e, '/admin')}
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold bg-[#CFB991] text-black rounded hover:bg-[#DFCCA8] transition-colors whitespace-nowrap shrink-0"
          >
            {currentUser ? 'CMS Dashboard' : 'Admin Login'}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden p-2 text-neutral-200 hover:text-[#CFB991] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0D0D0D] border-t border-neutral-800 px-4 py-4 space-y-1">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={routeHref(item.path)}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`block px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  active
                    ? 'text-[#CFB991] bg-neutral-900'
                    : 'text-neutral-200 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-3 mt-2 border-t border-neutral-800">
            <a
              href={routeHref('/admin')}
              onClick={(e) => handleLinkClick(e, '/admin')}
              className="block w-full text-center px-4 py-2.5 text-xs font-semibold bg-[#CFB991] text-black rounded hover:bg-[#DFCCA8]"
            >
              {currentUser ? 'CMS Dashboard' : 'Admin Login'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

interface FooterProps {
  profile: SiteProfile;
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<FooterProps> = ({ profile, onNavigate }) => {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-black text-neutral-300 border-t-2 border-[#CFB991]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-neutral-800">
          <div className="md:col-span-5 space-y-3">
            <p className="text-xs font-semibold tracking-wider text-[#CFB991] uppercase">
              {profile.institution}
            </p>
            <h2 className="font-serif text-2xl font-semibold text-white">
              {profile.labName}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              {profile.department}. {profile.missionStatement}
            </p>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <h3 className="font-sans text-xs font-semibold tracking-wider text-[#CFB991] uppercase">
              Laboratory Location
            </h3>
            <p className="text-neutral-300">{profile.piName}</p>
            <p className="text-neutral-400">{profile.labAddress}</p>
            <p className="text-neutral-400">
              Email:{' '}
              <a
                href={`mailto:${profile.piEmail}`}
                className="text-white underline underline-offset-4 hover:text-[#CFB991]"
              >
                {profile.piEmail}
              </a>
            </p>
            <p className="text-neutral-400">Office Hours: {profile.officeHours}</p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <h3 className="font-sans text-xs font-semibold tracking-wider text-[#CFB991] uppercase">
              Directory
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <a
                    href={routeHref(item.path)}
                    onClick={(e) => handleLink(e, item.path)}
                    className="text-neutral-400 hover:text-[#CFB991] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} {profile.labName} · {profile.institution}, West Lafayette, IN
          </p>
          <a
            href={routeHref('/admin')}
            onClick={(e) => handleLink(e, '/admin')}
            className="text-neutral-400 hover:text-[#CFB991] transition-colors"
          >
            Laboratory Content Management Portal →
          </a>
        </div>
      </div>
    </footer>
  );
};
