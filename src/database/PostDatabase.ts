import { PostDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"


    public getPosts = async () => {
        const posts = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)

        const users = await BaseDatabase.connection(PostDatabase.TABLE_USERS)

        return ([posts, users]) 
    }

    public createPost =async (NewPostDB: PostDB) => {
        
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(NewPostDB)

    } 
}