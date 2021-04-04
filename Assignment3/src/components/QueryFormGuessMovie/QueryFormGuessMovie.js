import React, { useState, useEffect } from 'react'
import './QueryFormGuessMovie.css';
import axios from 'axios';
export const QueryFormGuessMovie = ({ cast,setMovie,answeredMovies,pushmovieinList,setCast,setScore}) => {

    const [movies, setMovies] = useState("");
    const [input, setInput] = useState("Enter Movie Name");
    const [error, setError] = useState("");

    useEffect(() => {
        if(cast.id){
                getMovieList();
            
        }
    },[cast])

    const submitAnswer = () => {
let f=[],found=[];
               

        if (movies && input.trim()) {
               f=answeredMovies.filter((c)=>input.toLowerCase()===c.toLowerCase());
                         if(f.length===0){
          found= movies.filter((movie) => {
         
                    if (movie.title.toLowerCase() === input.toLowerCase()) {

                     
                       setScore((score)=>{
                             return score+1;
                         })
                                setMovie(movie);
                                pushmovieinList(movie.title);
                                setCast({});
                        
                        return cast;
                    }
                

            })
            } 
         
                if(f.length===0){
                    setError("Cast or Director name cannot be repeat");
                }
                else if(found.length===0){
                    setError("Wrong answer please try again");
                }
            
        }
     


    }

    const key = "6cdf537f81c643dafe161ca25dab6ba0";
    const getMovieList = async () => {
        if(cast.id){
             const data = await axios.get(`http://api.themoviedb.org/3/discover/movie?with_cast=${cast.id}&api_key=${key}`);
        if (data.data) {
            // setmoviecast(data.data.cast)    
            setMovies(data.data.results);   

        }
        }
       

    }



    return (
        <div className="QueryFormGuessMovie">
            <h4>What is the name of a movie where this person was actor or director?</h4>
            <input className="in" type="text" name="director" value={input} onChange={(e) => {setInput(e.target.value);setError("")}} />
            <button onClick={()=>{submitAnswer()}}>Submit</button>
            {error!==""?<p className="error">{error}</p>:""}
          
        </div>
    )
}
