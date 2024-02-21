import { jwtDecode } from 'jwt-decode';
import { useAppSelector } from '@/store';

export const parseToken = (token: string | null) => {
  if (!token) return undefined;

  const result = jwtDecode(token);

  if (
    result &&
    typeof result === 'object' &&
    'username' in result &&
    typeof result.username === 'string' &&
    'sub' in result &&
    typeof result.sub === 'string' &&
    'exp' in result &&
    typeof result.exp === 'number'
  ) {
    const name = 'name' in result && typeof result.name === 'string' ? result.name : '';
    const admin = 'admin' in result && typeof result.admin === 'boolean' ? result.admin : false;
    const exp = new Date(result.exp * 1000);

    return {
      id: result.sub,
      login: result.username,
      name,
      admin,
      exp,
    };
  }
};

const useAuthData = () => {
  const { token } = useAppSelector(({ auth }) => auth);
  const result = parseToken(token);

  return result;
};

export default useAuthData;
