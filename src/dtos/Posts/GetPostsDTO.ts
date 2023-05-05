import z from "zod";


export interface GetPostsInputDTO{
    token: string
}

export interface GetPostsOutputDTO{
    content: string,
}

interface Creator {
    id: string,
    name: string
}

export interface GetPostsOutputDTO{
    id: string,
    // creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: Creator
}

export const GetPostsSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)