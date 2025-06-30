
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = (pathname: string) => {
      switch (pathname) {
        case '/':
          return 'DSE College Finder – Home';
        case '/admin':
          return 'DSE College Finder – Admin';
        case '/admin-auth':
          return 'DSE College Finder – Admin Login';
        case '/admin-panel':
          return 'DSE College Finder – Admin Panel';
        case '/feedback':
          return 'DSE College Finder – Feedback';
        case '/about':
          return 'DSE College Finder – About';
        default:
          return 'DSE College Finder';
      }
    };

    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  return null;
};
