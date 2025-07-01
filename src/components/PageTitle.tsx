
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string): string => {
  const baseName = 'FindMyClg - by Awej';
  
  switch (pathname) {
    case '/':
      return `Home | ${baseName}`;
    case '/admin':
      return `Admin | ${baseName}`;
    case '/admin-auth':
      return `Admin Login | ${baseName}`;
    case '/admin-panel':
      return `Admin Panel | ${baseName}`;
    case '/feedback':
      return `Feedback | ${baseName}`;
    case '/about':
      return `About Us | ${baseName}`;
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
