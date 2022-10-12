import Cors from "micro-cors"
import { ApolloServer,gql } from "apollo-server-micro"
import {schema} from "../../graphql/schema"
import { createContext } from "../../graphql/context"
const cors = Cors()

const typeDefs = gql`
    type Query{
        sayHello: String
    }

`

const resolvers = {
    Query:{
        sayHello(parent:any,args:any,ctx:any){
            return 'Hello World'
        }
    }
}

const apolloServer = new ApolloServer({schema,context:createContext})

const startServer = apolloServer.start()
export default cors(async function handler(req,res){
    if(req.method === 'OPTIONS'){
        res.end()
        return false
    }
    await startServer
    await apolloServer.createHandler({path:'/api/graphql'})(req,res)
})

export  const  config  =  {
    api:  {
        bodyParser:  false
    }
};


