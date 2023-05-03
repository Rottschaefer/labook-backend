import z from "zod";


export interface CreatePostInputDTO{
    creatorId: string,
    content: string,
}

export interface CreatePostOutputDTO{
    content: string,
}

export const CreatePostSchema = z.object({
    creator_id: z.string({
        required_error: "'creator_id' é obrigatório",
        invalid_type_error: "'creator_id' precisa ser uma string"
    }).min(36,
        "'creator_id' deve ter 36 carecteres"),
    content: z.string({
        required_error: "'content' é obrigatório",
        invalid_type_error: "'content' precisa ser uma string"
    }).min(1, "'content' deve ter pelo menos 1 caractere")
})