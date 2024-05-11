export default interface AuthenticatedUser {
  id: string;
  email: string;
  jti: string;
  iss: string;
  // isAdmin: boolean;
}

// export enum UserRoles {
//   Admin = 'admin',
//   User = 'user',
// }