import { Request } from "express";
import jwt from "jsonwebtoken";
import Blacklist from "../db/models/blacklist";
import { UnauthorizedError } from "../errors";

import AuthenticatedUser from "./models/authenticated-user";

export async function expressAuthentication(
  req: Request,
  securityName: string,
  _scopes?: string[]
): Promise<AuthenticatedUser> {
  // get the token out of the HTTP header
  const authHeader = req.headers.authorization;
  if(!authHeader){
    throw new UnauthorizedError();
  }
  const isBearer = authHeader.startsWith("Bearer");
  if(!authHeader || !isBearer){
    throw new UnauthorizedError();
  }
  const token = authHeader.split(" ")[1];

  if (securityName == "jwt"){
    try {
      // do not ignore rhe expiration
      const user = await jwtAuth(token, false);
      return user;
    } catch (error) {
      throw new UnauthorizedError();
    }
  } else {
    throw new UnauthorizedError();
  }
}

async function jwtAuth(
  token: string,
  ignoreExpiration: boolean = false
  ): Promise<AuthenticatedUser> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    ignoreExpiration: ignoreExpiration,
  }) as {
    userId: string;
    email: string;
    iss: string;
    jti: string;
    isAdmin: boolean;
  };

  const jti = decoded.jti;

  // check if the JTI is in the blacklisted token database
  const blacklisted = await Blacklist.findOne({
    object: jti,
    kind: "jti",
  });

  if (blacklisted) {
    throw new UnauthorizedError();
  }

  const authUser: AuthenticatedUser = {
    id: decoded.userId,
    email: decoded.email,
    jti: jti,
    iss: decoded.iss,
    isAdmin: decoded.isAdmin
  };

  return authUser;
}

