import { jwtDecode } from 'jwt-decode';
import { useAppSelector } from '@/store';

interface AuthData {
  id: number;
  name: string;
  username?: string;
  admin: boolean;
  exp: Date;
}

export const parseToken = (token: string | null): AuthData | undefined => {
  if (!token) return undefined;

  const result = jwtDecode(token);

  if (
    result &&
    typeof result === 'object' &&
    'first_name' in result &&
    typeof result.first_name === 'string' &&
    'sub' in result &&
    typeof result.sub === 'number' &&
    'exp' in result &&
    typeof result.exp === 'number'
  ) {
    const name = `${result.first_name} ${'last_name' in result && typeof result.last_name === 'string' ? result.last_name : ''}`;
    const admin = 'admin' in result && typeof result.admin === 'boolean' ? result.admin : false;
    const exp = new Date(result.exp * 1000);

    return {
      id: result.sub,
      admin,
      name,
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
