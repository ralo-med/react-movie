import { useLocation } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import { searchMovies, searchTvs } from "../api";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  padding-top: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoResult = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [
    { data: movieData, isLoading: movieLoading },
    { data: tvData, isLoading: tvLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["search", "movies", keyword],
        queryFn: () => searchMovies(keyword || ""),
        enabled: !!keyword,
      },
      {
        queryKey: ["search", "tvs", keyword],
        queryFn: () => searchTvs(keyword || ""),
        enabled: !!keyword,
      },
    ],
  });

  const isLoading = movieLoading || tvLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {movieData?.results.length === 0 && tvData?.results.length === 0 ? (
            <NoResult>No results found for "{keyword}"</NoResult>
          ) : (
            <>
              {movieData && movieData.results.length > 0 && (
                <Slider
                  data={movieData}
                  title={`Movies matching "${keyword}"`}
                  media_type="movie"
                />
              )}
              {tvData && tvData.results.length > 0 && (
                <Slider
                  data={tvData}
                  title={`TV Shows matching "${keyword}"`}
                  media_type="tv"
                />
              )}
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
