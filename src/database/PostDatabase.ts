import { PostDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"



    public getPosts = async () => {
        const posts = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)

        const users = await BaseDatabase.connection(PostDatabase.TABLE_USERS)

        return ([posts, users])
    }

    public createPost = async (NewPostDB: PostDB) => {

        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(NewPostDB)

    }

    public editPost = async (id: string, content: string) => {

        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update({ content: content, updated_at: new Date().toISOString() }).where({ id })
    }

    public deletePost = async (id: string) => {

        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({ id })
    }

    public likePost = async (likesNumber: number, dislikesNumber: number, post_id: string, user_id: string, like: boolean) => {

            await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update({ likes: likesNumber, dislikes: dislikesNumber }).where({ id: post_id })

            await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).update({ like: 1 }).where({ post_id, user_id })
        
    }

    public dislikePost = async (likesNumber: number, dislikesNumber: number, post_id: string, user_id: string, like: boolean) => {
   
            await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update({ likes: likesNumber, dislikes: dislikesNumber }).where({ id: post_id })

            await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).update({ like: 0 }).where({ post_id, user_id })

    }

    public verifyLike = async (post_id: string, user_id: string) => {

        let [likes_dislikes] = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).where({ post_id, user_id })

        let isLiked

        if(!likes_dislikes){
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert({ user_id, post_id, like: 2}).where({ post_id, user_id });

        [likes_dislikes] = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).where({ post_id, user_id })

        isLiked = likes_dislikes.like
        }
        else if(likes_dislikes){
            isLiked = likes_dislikes.like
        }

        return isLiked
    }

}