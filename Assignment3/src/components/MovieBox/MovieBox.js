import React from 'react'
import './MovieBox.css';
export const MovieBox = ({movie}) => {
  
    return (
        <div className="MovieBox">
                    <img src={"https://www.themoviedb.org/t/p/w600_and_h900_bestv2"+movie.poster_path} width="100%"  alt="movie img"/>
                    <h5>{movie.title}</h5>
                    <h4>Release Date: {movie.release_date}</h4>
        </div>
    )
}
