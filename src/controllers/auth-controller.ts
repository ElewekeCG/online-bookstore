import { StatusCodes } from "http-status-codes";

import {
    Body, 
    Controller,
    Delete,
    OperationId, 
    Post,
    Request,
    Route,
    Security,
    Tags, 
} from "tsoa";

// this request allows us to specify the data type of the request object itself
import { Request as ExpressRequest } from "express";

import {
    LoginParams,
    UserAndCredentials,
    UserCreationParams
} from "../services/models/auth-model";

import AuthService, { AuthServiceFactory }  from "../services/auth-service";

@Route("/api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = AuthServiceFactory.createAuthService();
    }

    @Post("register")
    @OperationId("registerUser")
    public async register(
        @Body() requestBody: UserCreationParams
    ): Promise<UserAndCredentials> {
        this.setStatus(StatusCodes.CREATED);
        return this.authService.register(requestBody);
    }

    @Post("/login")
    @OperationId("loginUser")
    public async login(
        @Body() requestBody: LoginParams
    ): Promise<UserAndCredentials> {
        this.setStatus(StatusCodes.OK);
        return this.authService.login(requestBody);
    }

    @Delete()
    @Security("jwt")
    @OperationId("logoutUser")
    public async logout(@Request() request: ExpressRequest): Promise<void> {
        this.setStatus(StatusCodes.NO_CONTENT);
        const user = request.user as {jti: string};
        await this.authService.logout(user.jti);
    }
}