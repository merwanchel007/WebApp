import React, { useState, useEffect } from 'react'
import './QueryForm.css';
import axios from 'axios';
export const QueryForm = ({ movie,pushcastinList,answeredCast,setCast,setScore }) => {

    const [movieCast, setmoviecast] = useState("");
    const [input, setInput] = useState("Enter Actor / Director Name");
    const [error, setError] = useState("");

    useEffect(() => {
        if(movie.id){

                getCastList();
            
        }
    },[movie])

    const submitAnswer = () => {


        if (movieCast && input.trim()) {
          let f=[];  
          const found= movieCast.filter((cast) => {

                if (cast.known_for_department === "Acting" || cast.known_for_department === "Directing") {
                    if (cast.name.toLowerCase() === input.toLowerCase()) {
                         f=answeredCast.filter((c)=>input.toLowerCase()===c.toLowerCase());
                        if(f.length===0){
                         setCast(cast)
                         setScore((score)=>{
                             return score+1;
                         })
                         pushcastinList(cast.name);
                        }
                        return cast;
                    }
                }

            })
            if(f.length!==0){
                setError("Cast or Director name cannot be repeat");
            }
           else if(found.length===0){
               setError("Wrong answer please try again");
            }
            
        }
     


    }

    const key = "6cdf537f81c643dafe161ca25dab6ba0";
    const getCastList = async () => {
        if(movie.id){
             const data = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&query=${input}`);
        if (data.data) {
            setmoviecast(data.data.cast)       

        }
        }
       

    }



    return (
        <div className="QueryForm">
            <h4>What is the name of one of a actor or director of above movie ?</h4>
            <input className="in" type="text" name="director" value={input} onChange={(e) => {setInput(e.target.value);setError("")}} />
            <button onClick={()=>{submitAnswer()}}>Submit</button>
            {error!==""?<p className="error">{error}</p>:""}
          
        </div>
    )
}
