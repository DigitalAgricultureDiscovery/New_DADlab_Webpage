import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Settings,
  Inbox,
  Shield,
  ArrowRightLeft,
  HelpCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { api, type AdminWorkspaceData } from '../../lib/api';
import type { UserAccount, MediaAsset } from '../../types/cms';
import { AdminLogin } from './AdminLogin';
import { PreviewModal, type PreviewPayload } from './PreviewModal';
import { NewsManager, PublicationsManager, ProjectsManager } from './CmsSectionsPart1';
import { CoursesManager, OpportunitiesManager, MediaManager } from './CmsSectionsPart2';
import {
  ProfileManager,
  InquiriesManager,
  UsersSecurityManager,
  RedirectsBackupManager,
  AdminGuideView,
} from './CmsSystemSections';

type AdminTab =
  | 'overview'
  | 'news'
  | 'publications'
  | 'projects'
  | 'courses'
  | 'opportunities'
  | 'media'
  | 'profile'
  | 'inquiries'
  | 'users'
  | 'backups'
  | 'guide';

interface AdminDashboardProps {
  currentUser: UserAccount | null;
  labName: string;
  onUserChange: (user: UserAccount | null) => void;
  onPublicDataChanged: () => Promise<void>;
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  labName,
  onUserChange,
  onPublicDataChanged,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [workspace, setWorkspace] = useState<AdminWorkspaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadWorkspace = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getWorkspace();
      setWorkspace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadWorkspace();
    } else {
      setWorkspace(null);
    }
  }, [currentUser]);

  const refreshAll = async () => {
    await Promise.all([loadWorkspace(), onPublicDataChanged()]);
  };

  const handleMediaUploaded = (asset: MediaAsset) => {
    if (!workspace) return;
    setWorkspace({
      ...workspace,
      media: [asset, ...workspace.media],
    });
  };

  const handleLogout = async () => {
    await api.logout();
    onUserChange(null);
    onNavigate('/');
  };

  if (!currentUser) {
    return (
      <AdminLogin
        labName={labName}
        onSuccess={(user) => onUserChange(user)}
        onNavigate={onNavigate}
      />
    );
  }

  const unreadInquiries = workspace?.inquiries.filter((i) => i.status === 'unread').length ?? 0;

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'news', label: 'News & Announcements', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'publications', label: 'Publications', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'projects', label: 'Research Projects', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses & Teaching', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Lab Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'media', label: 'Media & Documents', icon: <FolderOpen className="w-4 h-4" /> },
    {
      id: 'inquiries',
      label: 'Contact Inquiries',
      icon: <Inbox className="w-4 h-4" />,
      badge: unreadInquiries > 0 ? unreadInquiries : undefined,
    },
    { id: 'profile', label: 'Site Profile & Team', icon: <Settings className="w-4 h-4" /> },
    { id: 'users', label: 'Users & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'backups', label: 'Redirects & Backups', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'guide', label: 'Admin Guide', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col lg:flex-row">
      {/* Sidebar (260px on desktop) */}
      <aside className="lg:w-[260px] bg-black text-neutral-300 shrink-0 flex flex-col border-r border-neutral-800">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-[#CFB991] uppercase">
              Purdue Lab CMS
            </p>
            <p className="font-serif text-base font-semibold text-white truncate max-w-[190px]">
              {workspace?.profile.shortTitle || labName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-1.5 text-neutral-300 hover:text-white"
            aria-label="Toggle CMS Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:block flex-1 p-3 space-y-1 overflow-y-auto`}
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium rounded transition-colors ${
                  active
                    ? 'bg-[#CFB991] text-black font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded ${
                      active ? 'bg-black text-[#CFB991]' : 'bg-neutral-800 text-[#CFB991]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 text-xs space-y-2">
          <div className="truncate">
            <p className="font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] text-neutral-400 capitalize">
              {currentUser.role === 'admin' ? 'Administrator (PI)' : 'Lab Editor'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-700 rounded text-neutral-200 hover:border-[#CFB991] hover:text-[#CFB991] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Administration</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-black">{activeLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-neutral-300 rounded hover:border-black text-black whitespace-nowrap shrink-0"
          >
            View Live Website
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              {error}
            </div>
          )}

          {loading && !workspace ? (
            <div className="bg-white border border-neutral-200 rounded-md p-8 text-sm text-neutral-500">
              Loading laboratory CMS workspace...
            </div>
          ) : workspace ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="font-serif text-3xl font-semibold text-black">
                      Content Management Overview
                    </h1>
                    <p className="text-sm text-neutral-600 mt-1">
                      Approved updates published here appear immediately on the public Purdue laboratory website.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('news')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">News &amp; Events</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {workspace.news.length}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        {workspace.news.filter((n) => n.status === 'published').length} published ·{' '}
                        {workspace.news.filter((n) => n.status === 'draft').length} drafts
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('publications')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">Publications</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {workspace.publications.length}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        {workspace.publications.filter((p) => p.status === 'published').length} published papers
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">Research Projects</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {workspace.projects.length}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        {workspace.projects.filter((p) => p.project_status === 'ongoing').length} ongoing ·{' '}
                        {workspace.projects.filter((p) => p.project_status === 'completed').length} completed
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">Purdue Courses</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {workspace.courses.length}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        {workspace.courses.filter((c) => c.status === 'active').length} active ·{' '}
                        {workspace.courses.filter((c) => c.status === 'archived').length} archived
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('opportunities')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">Lab Openings</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {workspace.opportunities.filter((o) => o.position_status === 'Open').length}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        open positions ({workspace.opportunities.length} total)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="bg-white border border-neutral-200 rounded-md p-5 text-left hover:border-black transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#8E6F3E] uppercase">Inquiries</p>
                      <p className="font-serif text-3xl font-semibold text-black mt-2 tabular-nums">
                        {unreadInquiries}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                        unread messages ({workspace.inquiries.length} total)
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'news' && (
                <NewsManager
                  items={workspace.news}
                  mediaAssets={workspace.media}
                  onMediaUploaded={handleMediaUploaded}
                  onRefresh={refreshAll}
                  onPreview={setPreview}
                  authorName={currentUser.name}
                />
              )}

              {activeTab === 'publications' && (
                <PublicationsManager
                  items={workspace.publications}
                  mediaAssets={workspace.media}
                  onMediaUploaded={handleMediaUploaded}
                  onRefresh={refreshAll}
                  onPreview={setPreview}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsManager
                  items={workspace.projects}
                  publications={workspace.publications}
                  researchAreas={workspace.profile.researchAreas || []}
                  mediaAssets={workspace.media}
                  onMediaUploaded={handleMediaUploaded}
                  onRefresh={refreshAll}
                  onPreview={setPreview}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesManager
                  items={workspace.courses}
                  mediaAssets={workspace.media}
                  onMediaUploaded={handleMediaUploaded}
                  onRefresh={refreshAll}
                  onPreview={setPreview}
                />
              )}

              {activeTab === 'opportunities' && (
                <OpportunitiesManager
                  items={workspace.opportunities}
                  onRefresh={refreshAll}
                  onPreview={setPreview}
                />
              )}

              {activeTab === 'media' && (
                <MediaManager items={workspace.media} onRefresh={refreshAll} />
              )}

              {activeTab === 'inquiries' && (
                <InquiriesManager items={workspace.inquiries} onRefresh={refreshAll} />
              )}

              {activeTab === 'profile' && (
                <ProfileManager
                  profile={workspace.profile}
                  mediaAssets={workspace.media}
                  onMediaUploaded={handleMediaUploaded}
                  onRefresh={refreshAll}
                  isAdmin={currentUser.role === 'admin'}
                />
              )}

              {activeTab === 'users' && (
                <UsersSecurityManager
                  users={workspace.users}
                  currentUser={currentUser}
                  onRefresh={refreshAll}
                />
              )}

              {activeTab === 'backups' && (
                <RedirectsBackupManager
                  redirects={workspace.redirects}
                  isAdmin={currentUser.role === 'admin'}
                  onRefresh={refreshAll}
                />
              )}

              {activeTab === 'guide' && <AdminGuideView />}
            </>
          ) : null}
        </main>
      </div>

      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
};
