import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod"
import { Request, Response } from "express"
import { BaseError } from "../errors/BaseError";
import { GetPostsInputDTO } from "../dtos/Posts/GetPostsDTO";
import { CreatePostSchema } from "../dtos/Posts/CreatePostDTO";
import { EditPostInputSchema } from "../dtos/Posts/EditPostDTO";
import { DeletePostInputSchema } from "../dtos/Posts/DeletePostDTO";
import { LikePostInputSchema } from "../dtos/Posts/LikePostDTO";


export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public getPosts = async (req: Request, res: Response) => {

        try {

            const tokenInput = req.headers.authorization as string

            const token: GetPostsInputDTO = {
                token: tokenInput
            }

            const output = await this.postBusiness.getPosts(token)

            res.status(200).send(output)

        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }

            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {

        try {

            const input = CreatePostSchema.parse({
                creator_id: req.body.creatorId,
                content: req.body.content,
                token: req.headers.authorization
            })

            await this.postBusiness.createPost(input)

            res.status(200).send({ content: input.content })

        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }

            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {

        try {

            const input = EditPostInputSchema.parse({
                id: req.body.id,
                token: req.headers.authorization,
                content: req.body.content
            })

            await this.postBusiness.editPost(input)

            res.status(200).send({ content: input.content })

        }
        catch (error) {

            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }

            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {

        try {

            const input = DeletePostInputSchema.parse({
                id: req.body.id,
                token: req.headers.authorization
            })

            await this.postBusiness.deletePost(input)

            res.status(200).send({message: "Post deletado"})

        }
        catch (error) {

            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }

            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likePost = async (req: Request, res: Response) => {

        try {

            const input = LikePostInputSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            })

            await this.postBusiness.likePost(input)

            res.status(200).send({message: "like dado no post", id: input.id})

        }
        catch (error) {

            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }

            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}