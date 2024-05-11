export interface UserCreationParams {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export interface UserAndCredentials {
  id: string;
  firstName: string;
  email: string;
  token: string;
}

  
export interface LoginParams {
  email: string;
  password: string;
} 

