import {gql,useQuery} from "@apollo/client"
import React from "react"
import { textSearch } from "../../graphql/types/foods"
import styles from "../../styles/Home.module.css"
export default function List(props:any){
    const req =gql`
    query Search($query: String) {
      textSearch(query: $query) {
        name
        category
        price
      }
    }
  `  
    const {loading,error,data} = useQuery(req,{
      variables:{
        query: props.value
      }
    })
    if(error){

        return <div> </div>
    }
    else if(data){
        return <ul className={styles.ul}>
            {data.textSearch.map((d:any,i:any)=>(<li key={i}>{d.name}</li>))}
        </ul>
    }
    return <div></div>
}