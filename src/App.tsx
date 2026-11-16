import { useCallback, useEffect, useState } from 'react';
import { readPath, routeHref } from './lib/routing';
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
    if (currentPath === '/') document.title = `${publicData.profile.labName} | ${publicData.profile.institution}`;
    else if (currentPath.startsWith('/about')) document.title = `About | ${base}`;
    else if (currentPath.startsWith('/people')) document.title = `People | ${base}`;
    else if (currentPath.startsWith('/research')) document.title = `Research | ${base}`;
    else if (currentPath.startsWith('/publications')) document.title = `Publications | ${base}`;
    else if (currentPath.startsWith('/news')) document.title = `News | ${base}`;
    else if (currentPath.startsWith('/teaching')) document.title = `Teaching | ${base}`;
    else if (currentPath.startsWith('/opportunities')) document.title = `Opportunities | ${base}`;
    else if (currentPath.startsWith('/contact')) document.title = `Contact | ${base}`;
    else if (currentPath.startsWith('/admin')) document.title = `CMS Administration | ${base}`;
  }, [currentPath, publicData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold tracking-widest text-[#8E6F3E] uppercase">
            Purdue University
          </p>
          <p className="font-serif text-xl text-black">Loading Laboratory Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !publicData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E5E2DC] rounded-md p-8 max-w-md text-center space-y-3">
          <h1 className="font-serif text-2xl font-semibold text-black">Connection Error</h1>
          <p className="text-sm text-neutral-600">{error || 'Laboratory data unavailable.'}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadBootstrap();
            }}
            className="px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (currentPath.startsWith('/admin') && isStaticSite) {
    return <main className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl">CMS administration</h1>
      <p>CMS editing requires the laboratory server. This website publishes the public laboratory content.</p>
      <a href={routeHref('/')} onClick={(event) => { event.preventDefault(); navigate('/'); }}>Return to the laboratory website</a>
    </main>;
  }

  if (currentPath.startsWith('/admin')) {
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
        currentUser={currentUser}
      />
      {publicData.profile.reviewNote && <p className="bg-[#CFB991] text-black px-4 py-3 text-sm text-center">{publicData.profile.reviewNote}</p>}
      <main className="flex-1">{renderPublicPage()}</main>
      <PublicFooter profile={publicData.profile} onNavigate={navigate} />
    </div>
  );
}
