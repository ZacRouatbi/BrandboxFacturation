export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

// Matches exactly what JwtStrategy.validate() returns:
//   { userId: payload.sub, username: payload.username }
// This is the shape of req.user, which is what GET /auth/me returns.
export interface AuthUser {
  userId:   string;
  username: string;
}