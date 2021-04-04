import React,{useState,useEffect} from "react"
import './App.css';
import { MovieBox } from './components/MovieBox/MovieBox';
import axios from 'axios';
import { QueryForm } from "./components/QueryForm/QueryForm";
import { CastCard } from "./components/CastCard/CastCard";
import { QueryFormGuessMovie } from "./components/QueryFormGuessMovie/QueryFormGuessMovie";

function App() {

  const [movie,setMovie]=useState({});
  const [cast,setCast]=useState({});
  const [answeredMovies,setAnsweredMovies]=useState([]);
  const [answeredCast,setAnsweredCast]=useState([]);
  const [score,setScore]=useState(0)


const pushcastinList=(cast)=>{
  const list=[...answeredCast];
  list.push(cast);
  setAnsweredCast(list);

}

const pushmovieinList=(movie)=>{
  const list=[...answeredMovies];
  list.push(movie);
  setAnsweredMovies(list);
  
}


  const [castRightAnwser,setCastRightAnwser]=useState(false);
   const key="6cdf537f81c643dafe161ca25dab6ba0";
  const query="Star%20Wars%20episode%206";
   const getMovie=async()=>{
     const data= await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&page=1&include_adult=false`);
      setMovie(data.data.results[0]);
  }
 
  useEffect(()=>{
     getMovie();
  },[])
    


  return (
    <div className="App">
      <h1>Movie Quiz</h1>
        <h3>Score: <strong>{score}</strong></h3>
     <MovieBox movie={movie}/>
     <QueryForm movie={movie}  setCast={setCast} pushcastinList={pushcastinList} setScore={setScore} answeredCast={answeredCast}/>
     {cast.id&&<CastCard cast={cast}/>}
     {cast.id&&<QueryFormGuessMovie cast={cast} setCast={setCast} setScore={setScore} setMovie={setMovie} answeredMovies={answeredMovies} pushmovieinList={pushmovieinList} />}
   
    
    </div>
  );
}

export default App;
