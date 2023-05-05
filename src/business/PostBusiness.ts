import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO } from "../dtos/Posts/CreatePostDTO";
import { DeletePostInputDTO } from "../dtos/Posts/DeletePostDTO";
import { EditPostInputDTO } from "../dtos/Posts/EditPostDTO";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/Posts/GetPostsDTO";
import { LikePostInputDTO } from "../dtos/Posts/LikePostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Post, PostDB, PostModel } from "../models/Posts";
import { USER_ROLES, UserDB } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO[]> => {

        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const [postsDB, usersDB] = await this.postDatabase.getPosts()

        const posts = postsDB.map((postDB) => {
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

        const output: GetPostsOutputDTO[] = posts.map((post) => {

            const creator: UserDB = usersDB.find((userDB) => userDB.id === post.getCreatorId())

            return ({
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

    public createPost = async (input: CreatePostInputDTO) => {


        const {content, token } = input

        const payload = this.tokenManager.getPayload(token)

        console.log(payload)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newPostDB: PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes: newPost.getDislikes(),
            created_at: newPost.getCreatedAt(),
            updated_at: newPost.getUpdatedAt()
        }

        this.postDatabase.createPost(newPostDB)

    }

    public editPost = async (input: EditPostInputDTO) => {

        const { id, token, content } = input


        const payload = this.tokenManager.getPayload(token)


        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const [posts] = await this.postDatabase.getPosts()

        console.log(content)


        const postDB = posts.find((post) => { return (post.id === id && post.creator_id === payload.id) })

        if (!postDB) {
            throw new BadRequestError("Este usuário não possui nenhum post com esse id")
        }

        await this.postDatabase.editPost(id, content)
    }

    public deletePost = async (input: DeletePostInputDTO) => {

        const { id, token } = input


        const payload = this.tokenManager.getPayload(token)


        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const [posts] = await this.postDatabase.getPosts()

        let postDB = []

        if (payload.role === USER_ROLES.NORMAL) {
            postDB = posts.find((post) => { return (post.id === id && post.creator_id === payload.id) })
        }

        if (payload.role === USER_ROLES.ADMIN) {
            postDB = posts.find((post) => { return (post.id === id) })
            console.log(payload.role)
        }


        if (!postDB) {
            throw new BadRequestError("Este usuário não possui nenhum post com esse id")
        }

        await this.postDatabase.deletePost(id)
    }

    public likePost = async (input: LikePostInputDTO) => {

        const { id, token, like } = input


        const payload = this.tokenManager.getPayload(token)


        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const [posts] = await this.postDatabase.getPosts()

        const postDB = posts.find((post) => { return (post.id === id) })

        if (postDB) {
            const isYourPost = posts.find((post) => { return (post.id === id && post.creator_id === payload.id) })
            if (isYourPost) {
                throw new BadRequestError("Não é possível dar like ou dislike no próprio post")
            }
        }


        if (!postDB) {
            throw new BadRequestError("Não existe nenhum post com esse id")
        }

        const isLiked = await this.postDatabase.verifyLike(id, payload.id)

        console.log(isLiked)

        let likesNumber = postDB.likes
        let dislikesNumber = postDB.dislikes

        if (like) {


            if (isLiked === 1) {
                throw new BadRequestError("O usuário já deu like esse post")
            }

            if (isLiked === 0) {
                likesNumber = postDB.likes + 1
                dislikesNumber = postDB.dislikes - 1
            }
            else if (isLiked === 2) {
                likesNumber = postDB.likes + 1
                dislikesNumber = 0
            }

            // const alreadyLiked = 1

            await this.postDatabase.likePost(likesNumber, dislikesNumber, id, payload.id, like)
        }

        else if (!like) {
            if (isLiked === 0) {
                throw new BadRequestError("O usuário já deu dislike esse post")
            }

            if (isLiked === 1) {
                likesNumber = postDB.likes - 1
                dislikesNumber = postDB.dislikes + 1
            }
            else if (isLiked === 2) {
                likesNumber = 0
                dislikesNumber = postDB.dislikes + 1
            }


            await this.postDatabase.dislikePost(likesNumber, dislikesNumber, id, payload.id, like)


        }
    }
}