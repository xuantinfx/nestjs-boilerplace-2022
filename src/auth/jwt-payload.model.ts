export interface JwtPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}
