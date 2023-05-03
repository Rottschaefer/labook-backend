import { UserDatabase } from "../database/UserDatabase";
import { SignUpInputUserDTO, SignUpOutputUserDTO } from "../dtos/Users/SignUpDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { USER_ROLES, User, UserDB } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getUsers = async () => {
        const usersDB = await this.userDatabase.getUsers()

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        // const output = users.map((user) => ({
        //     id: user.getId(),
        //     name: user.getName(),
        //     email: user.getEmail(),
        //     password: user.getPassword(),
        //     role: user.getRole(),
        //     created_at: user.getCreatedAt()
        // }))

        const output = users

        return output
    }

    public signUp = async (input: SignUpInputUserDTO): Promise<SignUpOutputUserDTO> => {
        const {name, email, password } = input

        const id = this.idGenerator.generate()

        const newUser = new User(
            id,
            name,
            email,
            password,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const newUserDB: UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        await this.userDatabase.signUp(newUserDB)

        return ({token})

    }
}