import { useCallback, useEffect, useState } from 'react';
import { readPath, routeHref, splitPath } from './lib/routing';
import { api, isStaticSite } from './lib/api';
import type { PublicBootstrapData, UserAccount } from './types/cms';
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
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => readPath());
  const { route: routePath, query } = splitPath(currentPath);
  const [publicData, setPublicData] = useState<PublicBootstrapData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBootstrap = useCallback(async () => {
    try {
      const [pub, authRes] = await Promise.all([api.getPublicBootstrap(), api.getMe()]);
      setPublicData(pub);
      setCurrentUser(authRes.user);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to laboratory server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

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
    if (!publicData) return;
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
    else if (routePath.startsWith('/admin')) document.title = `CMS Administration | ${base}`;
  }, [routePath, publicData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="text-label uppercase text-purdue-gold-text">
            Purdue University
          </p>
          <p className="text-card-title text-black">Loading Laboratory Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !publicData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E5E2DC] rounded-md p-8 max-w-md text-center space-y-3">
          <h1 className="text-subsection text-black">Connection Error</h1>
          <p className="text-card text-neutral-700">{error || 'Laboratory data unavailable.'}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadBootstrap();
            }}
            className="px-4 py-2 text-button bg-black text-[#CFB991] rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (routePath.startsWith('/admin') && isStaticSite) {
    return <main className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="font-display text-page text-black">CMS administration</h1>
      <p>CMS editing requires the laboratory server. This website publishes the public laboratory content.</p>
      <a href={routeHref('/')} onClick={(event) => { event.preventDefault(); navigate('/'); }}>Return to the laboratory website</a>
    </main>;
  }

  if (routePath.startsWith('/admin')) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        labName={publicData.profile.labName}
        onUserChange={(u) => setCurrentUser(u)}
        onPublicDataChanged={loadBootstrap}
        onNavigate={navigate}
      />
    );
  }

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
      <PublicHeader
        profile={publicData.profile}
        currentPath={routePath}
        onNavigate={navigate}
        currentUser={currentUser}
      />
      {publicData.profile.reviewNote && <p className="bg-[#CFB991] text-black px-4 py-3 text-meta text-center">{publicData.profile.reviewNote}</p>}
      {/* Keyed on the full path so each page change replays a short fade-in. */}
      <main key={currentPath} className="flex-1 page-enter">{renderPublicPage()}</main>
      <PublicFooter profile={publicData.profile} onNavigate={navigate} />
    </div>
  );
}
