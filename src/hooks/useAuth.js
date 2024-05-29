import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/reducers/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const loginUser = (user) => dispatch(login(user));
  const logoutUser = () => dispatch(logout());

  return { isAuthenticated, loginUser, logoutUser };
};