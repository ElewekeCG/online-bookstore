export interface UserCreationParams {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  province: string;
  postCode: string;
  country: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  province: string;
  postCode: string;
  country: string;
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