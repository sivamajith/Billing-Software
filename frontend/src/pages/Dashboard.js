import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(getDashboardPath(user.role), { replace: true });
    else navigate('/login', { replace: true });
  }, [user, navigate, getDashboardPath]);

  return null;
};

export default Dashboard;
