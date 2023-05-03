export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

interface Create {
    id: string,
    name: string
}

export interface PostModel {
    id: string,
    // creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: Create
}

export class Post{
    constructor(
       private id: string,
       private creator_id: string,
       private content: string,
       private likes: number,
       private dislikes: number,
       private created_at: string,
       private updated_at: string
    ){}

    public getId = ():string => {
        return this.id
    }

    public setId = (value: string) => {
        return this.id = value
    }

    public getCreatorId = ():string => {
        return this.creator_id
    }

    public setCreatorId = (value: string) => {
        return this.creator_id = value
    }
    
    public getContent = ():string => {
        return this.content
    }

    public setContent = (value: string) => {
        return this.content = value
    }
    
    public getLikes = ():number => {
        return this.likes
    }

    public setLikes = (value: number) => {
        return this.likes = value
    }
    
    public getDislikes = ():number => {
        return this.dislikes
    }

    public setDislikes = (value: number) => {
        return this.dislikes = value
    }
    
    public getCreatedAt = ():string => {
        return this.created_at
    }

    public setCreatedAt = (value: string) => {
        return this.created_at = value
    }

    public getUpdatedAt = ():string => {
        return this.updated_at
    }

    public setUpdatedAt = (value: string) => {
        return this.updated_at = value
    }
}