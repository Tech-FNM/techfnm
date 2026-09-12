import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardHome from './DashboardHome';
import LeadsManager from './LeadsManager';
import UserManager from './UserManager';
import PostManager from './PostManager';
import PageManager from './PageManager';
import MediaManager from './MediaManager';
import ServicesManager from './ServicesManager';
import PortfolioManager from './PortfolioManager';
import HeaderManager from './HeaderManager';
import FooterManager from './FooterManager';
import SettingsManager from './SettingsManager';

export default function AdminDashboard() {
  const { tab: pathTab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryTab = searchParams.get('tab');

  // If someone lands on old ?tab= URL, redirect smoothly to clean /admin/:tab URL
  useEffect(() => {
    if (queryTab) {
      if (queryTab === 'overview' || queryTab === 'dashboard') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(`/admin/${queryTab}`, { replace: true });
      }
    }
  }, [queryTab, navigate]);

  // Determine current active section from clean URL path param or fallback query param
  const currentTab =
    (pathTab === 'dashboard' || pathTab === 'overview' ? 'overview' : pathTab) ||
    queryTab ||
    'overview';

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <DashboardHome />;
      case 'leads':
        return <LeadsManager />;
      case 'users':
        return <UserManager />;
      case 'posts':
        return <PostManager />;
      case 'homepage':
        return <PageManager forcedPageId="page-home" />;
      case 'pages':
        return <PageManager />;
      case 'media':
        return <MediaManager />;
      case 'services':
        return <ServicesManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'header':
        return <HeaderManager />;
      case 'footer':
        return <FooterManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <AdminLayout activeTab={currentTab}>
      {renderContent()}
    </AdminLayout>
  );
}
