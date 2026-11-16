import { useCallback, useEffect, useState } from 'react';
import { readPath, routeHref } from './lib/routing';
import { getSiteData } from './content';
import { PublicHeader, PublicFooter } from './components/PublicHeaderFooter';
import { HomePage } from './pages/HomePage';
import { PeoplePage } from './pages/PeoplePage';
import { AboutPage } from './pages/AboutPage';
import { ResearchPage } from './pages/ResearchPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { NewsPage } from './pages/NewsPage';
import { TeachingPage } from './pages/TeachingPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ContactPage } from './pages/ContactPage';

// Content is bundled with the site (src/content), so there is nothing to load at runtime.
const publicData = getSiteData();

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => readPath());

  useEffect(() => {
    const onPop = () => {
      setCurrentPath(readPath());
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    if (path !== readPath()) {
      window.history.pushState({}, '', routeHref(path));
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Update document title dynamically per route for SEO & browser tabs
  useEffect(() => {
    const base = `${publicData.profile.shortTitle} | ${publicData.profile.institution}`;
    if (currentPath === '/') document.title = `${publicData.profile.labName} | ${publicData.profile.institution}`;
    else if (currentPath.startsWith('/about')) document.title = `About | ${base}`;
    else if (currentPath.startsWith('/research')) document.title = `Research | ${base}`;
    else if (currentPath.startsWith('/publications')) document.title = `Publications | ${base}`;
    else if (currentPath.startsWith('/news')) document.title = `News | ${base}`;
    else if (currentPath.startsWith('/teaching')) document.title = `Teaching | ${base}`;
    else if (currentPath.startsWith('/opportunities')) document.title = `Opportunities | ${base}`;
    else if (currentPath.startsWith('/contact')) document.title = `Contact | ${base}`;
  }, [currentPath]);

  const renderPublicPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage data={publicData} onNavigate={navigate} />;
    }
    if (currentPath === '/people') return <PeoplePage profile={publicData.profile} />;
    if (currentPath === '/about') {
      return <AboutPage profile={publicData.profile} onNavigate={navigate} />;
    }
    if (currentPath === '/research' || currentPath.startsWith('/research/')) {
      const slug = currentPath.startsWith('/research/')
        ? currentPath.replace('/research/', '')
        : undefined;
      return (
        <ResearchPage
          projects={publicData.allProjects}
          publications={publicData.allPublications}
          researchAreas={publicData.profile.researchAreas}
          selectedSlug={slug}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/publications') {
      return <PublicationsPage publications={publicData.allPublications} />;
    }
    if (currentPath === '/news' || currentPath.startsWith('/news/')) {
      const slug = currentPath.startsWith('/news/')
        ? currentPath.replace('/news/', '')
        : undefined;
      return (
        <NewsPage news={publicData.allNews} selectedSlug={slug} onNavigate={navigate} />
      );
    }
    if (currentPath === '/teaching') {
      return <TeachingPage courses={publicData.courses} profile={publicData.profile} />;
    }
    if (currentPath === '/opportunities') {
      return (
        <OpportunitiesPage opportunities={publicData.opportunities} onNavigate={navigate} />
      );
    }
    if (currentPath === '/contact') {
      return <ContactPage profile={publicData.profile} />;
    }
    return <HomePage data={publicData} onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <PublicHeader
        profile={publicData.profile}
        currentPath={currentPath}
        onNavigate={navigate}
      />
      {publicData.profile.reviewNote && <p className="bg-[#CFB991] text-black px-4 py-3 text-sm text-center">{publicData.profile.reviewNote}</p>}
      <main className="flex-1">{renderPublicPage()}</main>
      <PublicFooter profile={publicData.profile} onNavigate={navigate} />
    </div>
  );
}
