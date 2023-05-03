import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO } from "../dtos/Posts/CreatePostDTO";
import { Post, PostDB, PostModel } from "../models/Posts";
import { UserDB } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator
    ){}

    public getPosts = async () => {
        
        const [postsDB, usersDB] = await this.postDatabase.getPosts()

        const posts = postsDB.map((postDB)=>{
            return new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at
            )
        })

        const output: PostModel[] = posts.map((post)=>{

            const creator: UserDB = usersDB.find((userDB)=>userDB.id === post.getCreatorId())

            return({
                id: post.getId(),
                // creatorId: post.getCreatorId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                createdAt: post.getCreatedAt(),
                updatedAt: post.getUpdatedAt(),
                creator: {
                    id: creator.id,
                    name: creator.name
                }
            })
        })

        return output
    }

    public createPost =async (input: CreatePostInputDTO) => {


        const {creatorId, content} = input

        console.log(creatorId)


        const id = this.idGenerator.generate()

        const newPost =  new Post(
            id,
            creatorId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newPostDB: PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content:newPost.getContent(),
            likes:newPost.getLikes(),
            dislikes:newPost.getDislikes(),
            created_at:newPost.getCreatedAt(),
            updated_at:newPost.getUpdatedAt()
        }

        this.postDatabase.createPost(newPostDB)
    
    }
}