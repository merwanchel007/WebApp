import React, { useState, useEffect } from 'react'
import './CastCard.css';
import axios from 'axios';
export const CastCard = ({ cast }) => {

    return (
        <div className="CastCard">
            <img src={"https://www.themoviedb.org/t/p/w300_and_h450_bestv2/" + cast.profile_path} width="100%" alt="movie img" />
            <h3>{cast.name}</h3>
        </div>
    )
}
