import { useSearchParams } from 'react-router-dom';
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
import SettingsManager from './SettingsManager';

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

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
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
}
