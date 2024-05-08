import { v4 as uuidv4 } from "uuid";
import Blacklist from "../db/models/blacklist";
import Customer from "../db/models/customer";

import { 
  LoginParams, 
  UserAndCredentials, 
  UserCreationParams 
} from "./models/auth-model";

import {  
  UnauthorizedError
} from "../errors";

export class AuthServiceFactory {
  public static createAuthService(): AuthService {
    return AuthService.createInstance();
  }
}

export default class AuthService {
    
  private constructor() {}

  public static createInstance(): AuthService {
    return new AuthService();
  }

  public async register(
    params: UserCreationParams
  ): Promise<UserAndCredentials> {
    try {
        const registeredCustomer = await Customer.create(params);
        if (!registeredCustomer){
            throw new UnauthorizedError();
        }
        const uuid = uuidv4();
        const token = registeredCustomer.createJWT(uuid);
        return {
            id: registeredCustomer.id,
            firstName: registeredCustomer.firstName,
            email: registeredCustomer.email,
            token,
        };
    } catch (error){
        throw error;
    }    
  }

  public async login(params: LoginParams): Promise<UserAndCredentials> {
    const user = await Customer.findOne({ email: params.email });
    if(!user){
      throw new UnauthorizedError();
    }
    const isCorrectPassword = await user.comparePassword(params.password);
    if(!isCorrectPassword){
      throw new UnauthorizedError();
    }
    const uuid = uuidv4();
    const token = user.createJWT(uuid);
    return{
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        token,
    };
  }

  public async logout(jti: string): Promise<void> {
    await Blacklist.create({ object: jti, kind: "jti" });
  }
}