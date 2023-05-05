import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"

    public getUsers = async () => {
        const users = await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        return users
    }

    public signUp = async (newUserDB: UserDB) => {

        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUserDB)
        
    }

    public findUSerByEmail = async (email: string): Promise<UserDB> => {
        const [userDB]: UserDB[] = await BaseDatabase.connection(UserDatabase.TABLE_USERS).where({email: email})

        return userDB
    }
}