
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string): string => {
  const baseName = 'DSE College Finder';
  
  switch (pathname) {
    case '/':
      return `${baseName} | Home`;
    case '/admin':
      return `${baseName} | Admin`;
    case '/admin-auth':
      return `${baseName} | Admin Login`;
    case '/admin-panel':
      return `${baseName} | Admin Panel`;
    case '/feedback':
      return `${baseName} | Feedback`;
    case '/about':
      return `${baseName} | About Us`;
    default:
      return baseName;
  }
};

export const PageTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = title;
  }, [location.pathname]);

  return null;
};
