import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import MovieCard from "../../components/movieCard";
import Preloader from "../../components/PreLoader/PreLoader";

const MyFavourites = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const GetAllFavouriteMovies = async () => {
    try {
      const response = await axiosInstance.get("/users/favourites");
      setMovies(response.data);
      setLoading(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsInitialLoad(false);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    GetAllFavouriteMovies();
  }, []);

  if (loading) {
    return <Preloader setLoading={setLoading} />;
  }

  return (
    <div className="justify-center items-center px-20 bg-background1 min-h-screen">
      <h1 className="text-4xl font-montserrat font-bold mb-8 text-center text-primary_text">
        My Favourite Movies
      </h1>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 bg-background1">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-primary_text">
          Add some movies as favourite ...
        </p>
      )}
    </div>
  );
};

export default MyFavourites;
