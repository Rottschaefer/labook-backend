import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod"
import { Request, Response } from "express"
import { BaseError } from "../errors/BaseError";


export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {

        try{
        
        const output = await this.postBusiness.getPosts()

        res.status(200).send(output)
        
        }
        catch(error){
            if(error instanceof ZodError){
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

        try{

        const input = {
            creatorId: req.body.creatorId,
            content: req.body.content
        }
        
        await this.postBusiness.createPost(input)

        res.status(200).send({content: input.content})
        
        }
        catch(error){
            if(error instanceof ZodError){
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