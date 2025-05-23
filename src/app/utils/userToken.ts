import jwt_decode from 'jwt-decode';

export function getUserFromToken(): { role: string; username: string } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = (jwt_decode as unknown as (token: string) => any)(token);
    return {
      username: decoded.username,
      role: decoded.role,
    };
  } catch (e) {
    console.error('Token inválido', e);
    return null;
  }
}
