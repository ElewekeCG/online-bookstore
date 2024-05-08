import { StatusCodes } from "http-status-codes";

import {
    Body, 
    Controller,
    // Delete,
    OperationId, 
    Post,
    // Request,
    Route,
    // Security,
    Tags, 
} from "tsoa";

// this request allows us to specify the data type of the request object itself
// import { Request as ExpressRequest } from "express";

// import {
//     LoginParams,
//     UserAndCredentials,
//     UserCreationParams
// } from "../services/models/auth-model";

import AdminService from "../services/admin-service";

@Route("/api/v1/admin")
@Tags("Admin")
export class AdminController extends Controller {
    @Post("register")
    @OperationId("registerAdmin")
    public async register(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{id: string, username: string, token: string}> {
        this.setStatus(StatusCodes.CREATED);
        return new AdminService().register(requestBody.username, requestBody.password);
    }

    @Post("/login")
    @OperationId("loginAdmin")
    public async login(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{username: string, token: string}> {
        this.setStatus(StatusCodes.OK);
        return new AdminService().login(requestBody.username, requestBody.password);
    }
}
