// importing the admin schema model
import Admin from "../db/models/admin";
// uuid is used for jwt authentication
import { v4 as uuidv4 } from "uuid";
// importing the blacklist schema model
import Blacklist from "../db/models/blacklist";

// admin service class handles admin authentication
export default class AdminService {


    public async register(
        username: string,
        password: string
      ): Promise<{id: string, username: string, token: string}> {
        try {
            const registeredAdmin = await Admin.create({ username, password});
            if (!registeredAdmin){
                throw new Error;
            }
            const uuid = uuidv4();
            const token = registeredAdmin.createJWT(uuid);
            return {
                id: registeredAdmin.id,
                username: registeredAdmin.username,
                token,
            };
        } catch (error){
            throw error;
        }    
    }

    public async login(
        username: string,
        password: string
    ): Promise<{username: string, token: string}> {
        const user = await Admin.findOne({ username });
        if(!user){
          throw new Error("user not found");
        }
        const isCorrectPassword = await user.comparePassword(password);
        if(!isCorrectPassword){
          throw new Error("incorrect username or password");
        }
        const uuid = uuidv4();
        const token = user.createJWT(uuid);
        return{
            username: user.username,
            token,
        };
    }
    

    // when a user logs out, their token is added to the blacklist schema
    public async logout(jti: string): Promise<void> {
        await Blacklist.create({ object: jti, kind: "jti" });
    }
}
