import { useCallback, useEffect, useState } from 'react';
import { readPath, routeHref, splitPath } from './lib/routing';
import { SITE_CONTENT } from './data/content';
import { PublicHeader, PublicFooter } from './components/PublicHeaderFooter';
import { IntroSplash } from './components/IntroSplash';
import { introWanted } from './lib/intro';
import { resolveMediaUrl } from './lib/mediaAssets';
import { HomePage } from './pages/HomePage';
import { PeoplePage } from './pages/PeoplePage';
import { AboutPage } from './pages/AboutPage';
import { ResearchPage } from './pages/ResearchPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { NewsPage } from './pages/NewsPage';
import { TeachingPage } from './pages/TeachingPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ContactPage } from './pages/ContactPage';

const publicData = SITE_CONTENT;

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => readPath());
  const { route: routePath, query } = splitPath(currentPath);
  // Decided before the first paint so the page never flashes before the intro.
  const [showIntro, setShowIntro] = useState(() => Boolean(publicData.profile.logoUrl) && introWanted());

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
    if (routePath === '/') document.title = `${publicData.profile.labName} | ${publicData.profile.institution}`;
    else if (routePath.startsWith('/about')) document.title = `About | ${base}`;
    else if (routePath.startsWith('/people')) document.title = `People | ${base}`;
    else if (routePath.startsWith('/research')) document.title = `Research | ${base}`;
    else if (routePath.startsWith('/publications')) document.title = `Publications | ${base}`;
    else if (routePath.startsWith('/news')) document.title = `News | ${base}`;
    else if (routePath.startsWith('/teaching')) document.title = `Teaching | ${base}`;
    else if (routePath.startsWith('/opportunities')) document.title = `Opportunities | ${base}`;
    else if (routePath.startsWith('/contact')) document.title = `Contact | ${base}`;
  }, [routePath]);

  const renderPublicPage = () => {
    if (routePath === '/' || routePath === '') {
      return <HomePage data={publicData} onNavigate={navigate} />;
    }
    if (routePath === '/people') return <PeoplePage profile={publicData.profile} />;
    if (routePath === '/about') {
      return <AboutPage profile={publicData.profile} onNavigate={navigate} />;
    }
    if (routePath === '/research' || routePath.startsWith('/research/')) {
      const slug = routePath.startsWith('/research/')
        ? routePath.replace('/research/', '')
        : undefined;
      return (
        <ResearchPage
          projects={publicData.allProjects}
          publications={publicData.allPublications}
          researchAreas={publicData.profile.researchAreas}
          selectedSlug={slug}
          topicParam={slug ? undefined : query.get('topic')}
          onNavigate={navigate}
        />
      );
    }
    if (routePath === '/publications') {
      return <PublicationsPage publications={publicData.allPublications} scholarUrl={publicData.profile.googleScholarUrl} />;
    }
    if (routePath === '/news' || routePath.startsWith('/news/')) {
      const slug = routePath.startsWith('/news/')
        ? routePath.replace('/news/', '')
        : undefined;
      return (
        <NewsPage news={publicData.allNews} selectedSlug={slug} onNavigate={navigate} />
      );
    }
    if (routePath === '/teaching') {
      return <TeachingPage courses={publicData.courses} profile={publicData.profile} />;
    }
    if (routePath === '/opportunities') {
      return (
        <OpportunitiesPage opportunities={publicData.opportunities} onNavigate={navigate} />
      );
    }
    if (routePath === '/contact') {
      return <ContactPage profile={publicData.profile} />;
    }
    return <HomePage data={publicData} onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {showIntro && (
        <IntroSplash
          logoUrl={resolveMediaUrl(publicData.profile.logoUrl)}
          labName={publicData.profile.labName}
          shortTitle={publicData.profile.shortTitle}
          onDone={() => setShowIntro(false)}
        />
      )}
      <PublicHeader
        profile={publicData.profile}
        currentPath={routePath}
        onNavigate={navigate}
      />
      {publicData.profile.reviewNote && <p className="bg-[#CFB991] text-black px-4 py-3 text-meta text-center">{publicData.profile.reviewNote}</p>}
      {/* Keyed on the full path so each page change replays a short fade-in. */}
      <main key={currentPath} className="flex-1 page-enter">{renderPublicPage()}</main>
      <PublicFooter profile={publicData.profile} onNavigate={navigate} />
    </div>
  );
}
