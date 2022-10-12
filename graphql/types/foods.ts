
import { link } from "fs"
import {objectType,extendType,idArg, stringArg, intArg} from "nexus"
import { Context } from "../context"

export const Food = objectType({
    name:'Food',
    definition(t) {
        t.id('id'),
        t.string('name'),
        t.int('price'),
        t.int('quantity'),
        t.string('category'),
        t.boolean('veg')
    },
})

export const allFoods = extendType({
    type:'Query',
    definition(t) {
        t.nonNull.list.field('allFoods',{
            type: Food,
            resolve(parent,args,ctx:Context){
                return ctx.prisma.food.findMany()
            }
        })
    },
})

export const findFoodByID = extendType({
    type:'Query',
    definition(t){
        t.field('findFoodByID',{
            type:Food,
            args:{
                id: idArg()
            },
            async resolve(parent,args,ctx){
                return await ctx.prisma.food.findUnique({
                    where:{
                        id: Number(args.id)
                    }
                })
            }
        })
    }
})

export const textSearch = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('textSearch',{
            type:Food,
            args:{
                query:stringArg()
            },
            async resolve(parent,args,ctx:Context){
                let query = args.query?.replaceAll(" ","&")
                return await ctx.prisma.food.findMany({
                    where:{
                        name:{
                            search: query
                        }
                    }
                })
            }
        })
    },
})

export const Edge = objectType({
    name:'Edge',
    definition(t) {
        t.int('cursor')
        t.field('node',{
            type:Food
        })
    },
})

export const PageInfo = objectType({
    name:'PageInfo',
    definition(t) {
        t.int('endCursor')
        t.boolean('hasNextPage')
    },
})

export const Response = objectType({
    name:'Response',
    definition(t) {
        t.field('pageInfo',{type:PageInfo})
        t.list.field('edges',{
            type:Edge
        })
    },
})

export const FetchItems = extendType({
    type:'Query',
    definition(t) {
        t.field('fetchItems',{
            type:Response,
            args:{
                first:intArg(),
                after:intArg()
            },
            async resolve(parent,args,ctx){
                let queryResults = null
                if(args.after){
                    queryResults = await ctx.prisma.food.findMany({
                        take: args.first,
                        skip:1,
                        cursor:{
                            id:args.after
                        }
                    })
                }
                else{
                    queryResults = await ctx.prisma.food.findMany({
                        take:args.first
                    })
                }
                if(queryResults.length>0){
                    const lastLinkInResults = queryResults[queryResults.length-1]
                    const myCursor = lastLinkInResults.id

                    const secondQueryResults = await ctx.prisma.food.findMany({
                        take:args.first,
                        cursor:{
                            id:myCursor
                        },
                        orderBy:{
                            id:'asc'
                        }
                    })
                    const result = {
                        pageInfo:{
                            endCursor: myCursor,
                            hasNextPage: secondQueryResults.length>=args.first
                        },
                        edges:queryResults.map(f=>({
                            cursor: f.id,
                            node:f
                        }))
                    }
                    return result
                }
                return {
                    pageInfo:{
                        endCursor:null,
                        hasNextPage:false
                    },
                    edges:[]
                }
            }
        })    
    },
})