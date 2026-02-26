"use server"

import { currentUser } from "@/features/auth/actions"
import db from "@/lib/db"
import { TemplateFolder } from "../lib/path-to-json"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

type PlaygroundWithTemplateFiles = {
    templateFiles: Array<{
        content: Prisma.JsonValue
    }>
}

export const getPlaygroundById = async (id: string): Promise<PlaygroundWithTemplateFiles | null> => {
    try{
        const playground = await db.playground.findUnique({
            where: { id },
            select: {
                templateFiles: {
                    select: {
                        content: true,
                    }
                }
            }
        })
        return playground
    }
    catch(error){
        console.log(error)
        return null
    }
}
