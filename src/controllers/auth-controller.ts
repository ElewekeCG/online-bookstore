// importing status code that will be used alongside responses
import { StatusCodes } from "http-status-codes";

/* importing typescript open API decorators to allow me 
 define the required meta-information in the controller code
 and also generate API documentation.*/
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

// importing the param specification interfaces
import {
    LoginParams,
    UserAndCredentials,
    UserCreationParams
} from "../services/models/auth-model";

// importing auth service class
import {AuthService} from "../services/auth-service";

// tsoa decorator that specifies the base path of the controller
@Route("/api/v1/auth")
@Tags("Auth")
/*auth controller class inherits the tsoa controller class and its basic
functionality */
export class AuthController extends Controller {
    // specifies that this is a HTTP POST request
    @Post("register")
    @OperationId("registerUser")
    public async register(
        // specifies the request body params
        @Body() requestBody: UserCreationParams
    ): Promise<UserAndCredentials> {
        this.setStatus(StatusCodes.CREATED);
        // new instance of the auth service class performs operation
        return new AuthService().register(requestBody);
    }

    // specifies that this is a HTTP POST request
    @Post("/login")
    @OperationId("loginUser")
    public async login(
        @Body() requestBody: LoginParams
    ): Promise<UserAndCredentials> {
        this.setStatus(StatusCodes.OK);
        return new AuthService().login(requestBody);
    }

    // specifies that this is a HTTP DELETE request
    @Delete()
    @Security("jwt")
    @OperationId("logoutUser")
    public async logout(
        // specifying the data type of the request object
        @Request() request: ExpressRequest
    ): Promise<void> {
        this.setStatus(StatusCodes.NO_CONTENT);
        const user = request.user as {jti: string};
        await new AuthService().logout(user.jti);
    }
}