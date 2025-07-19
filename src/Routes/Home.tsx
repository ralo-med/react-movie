import { useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  type IBaseItem,
} from "../api";
import { makeImagePath } from "../utils";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 20px;
  margin-top: -100px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  aspect-ratio: 3 / 4;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 20px;
  font-size: 46px;
  position: absolute;
  bottom: 125px;
  width: calc(100% - 40px);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: 600;
`;

const BigOverview = styled.p`
  padding: 0 20px;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 40px);
  height: 120px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const bigMovieY = useTransform(scrollY, (y) => y + 100);

  const [
    { data: nowPlayingData, isLoading: nowPlayingLoading },
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
    { data: upcomingData, isLoading: upcomingLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["movies", "nowPlaying"],
        queryFn: getNowPlayingMovies,
      },
      {
        queryKey: ["movies", "popular"],
        queryFn: getPopularMovies,
      },
      {
        queryKey: ["movies", "topRated"],
        queryFn: getTopRatedMovies,
      },
      {
        queryKey: ["movies", "upcoming"],
        queryFn: getUpcomingMovies,
      },
    ],
  });

  const isLoading =
    nowPlayingLoading || popularLoading || topRatedLoading || upcomingLoading;

  const onOverlayClick = () => navigate("/");

  const findMovieAndCategory = (
    movieId: string
  ): { movie: IBaseItem | undefined; category: string | undefined } => {
    if (nowPlayingData?.results.find((m: IBaseItem) => m.id === +movieId)) {
      return {
        movie: nowPlayingData.results.find(
          (m: IBaseItem) => m.id === +movieId
        )!,
        category: "Now Playing",
      };
    }
    if (popularData?.results.find((m: IBaseItem) => m.id === +movieId)) {
      return {
        movie: popularData.results.find((m: IBaseItem) => m.id === +movieId)!,
        category: "Popular Movies",
      };
    }
    if (topRatedData?.results.find((m: IBaseItem) => m.id === +movieId)) {
      return {
        movie: topRatedData.results.find((m: IBaseItem) => m.id === +movieId)!,
        category: "Top Rated Movies",
      };
    }
    if (upcomingData?.results.find((m: IBaseItem) => m.id === +movieId)) {
      return {
        movie: upcomingData.results.find((m: IBaseItem) => m.id === +movieId)!,
        category: "Upcoming Movies",
      };
    }
    return { movie: undefined, category: undefined };
  };

  const { movie: clickedMovie, category: clickedMovieCategory } = bigMovieMatch
    ?.params.movieId
    ? findMovieAndCategory(bigMovieMatch.params.movieId)
    : { movie: undefined, category: undefined };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].title}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>

          {nowPlayingData && (
            <Slider
              data={nowPlayingData}
              title="Now Playing"
              media_type="movie"
            />
          )}
          {popularData && (
            <Slider
              data={popularData}
              title="Popular Movies"
              media_type="movie"
            />
          )}
          {topRatedData && (
            <Slider
              data={topRatedData}
              title="Top Rated Movies"
              media_type="movie"
            />
          )}
          {upcomingData && nowPlayingData && (
            <Slider
              data={{
                ...upcomingData,
                results: upcomingData.results.filter(
                  (movie: IBaseItem) =>
                    !nowPlayingData.results.some(
                      (nowPlayingMovie: IBaseItem) =>
                        nowPlayingMovie.id === movie.id
                    )
                ),
              }}
              title="Upcoming Movies"
              media_type="movie"
            />
          )}

          <AnimatePresence>
            {bigMovieMatch && clickedMovie ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: bigMovieY,
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                  layoutId={`${clickedMovieCategory}-${clickedMovie.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.3, type: "tween" }}
                  >
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </motion.div>
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
