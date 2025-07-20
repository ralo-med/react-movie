import { useLocation, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import { searchMovies, searchTvs } from "../api";
import Slider from "../components/Slider";
import type { IBaseItem } from "../api";
import { useScroll, useTransform } from "framer-motion";
import BigMovieOverlay from "../components/BigMovieOverlay";

const Wrapper = styled.div`
  padding-top: 150px;
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

const SliderSection = styled.div`
  margin-bottom: 60px;
`;

const SearchInfo = styled.div`
  padding: 120px 60px 0 60px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 18px;
  font-weight: 700;
`;

const ResultSummary = styled.p`
  color: ${(props) => props.theme.white.darker};
  font-size: 24px;
  font-weight: 600;
  line-height: 1.6;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bigMovieY = useTransform(scrollY, (y) => y + 100);

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

  console.log("Movie Data:", movieData);
  console.log("TV Data:", tvData);

  const isLoading = movieLoading || tvLoading;

  // 실제로 슬라이더에 표시되는(필터된) 개수 계산
  const filteredMovies =
    movieData?.results?.filter((m: IBaseItem) => m.backdrop_path) || [];
  const filteredTvs =
    tvData?.results?.filter((t: IBaseItem) => t.backdrop_path) || [];
  const filteredMovieCount = filteredMovies.length;
  const filteredTvCount = filteredTvs.length;

  // 쿼리스트링에서 movie/tv id 추출
  const movieId = new URLSearchParams(location.search).get("movie");
  const tvId = new URLSearchParams(location.search).get("tv");
  const clickedMovie = movieId
    ? movieData?.results.find((m: IBaseItem) => m.id === +movieId)
    : undefined;
  const clickedTv = tvId
    ? tvData?.results.find((t: IBaseItem) => t.id === +tvId)
    : undefined;

  // 슬라이더 박스 클릭 시 쿼리스트링 변경
  const onMovieBoxClicked = (itemId: number) => {
    const params = new URLSearchParams(location.search);
    params.set("movie", itemId.toString());
    params.delete("tv");
    navigate(`${location.pathname}?${params.toString()}`);
  };
  const onTvBoxClicked = (itemId: number) => {
    const params = new URLSearchParams(location.search);
    params.set("tv", itemId.toString());
    params.delete("movie");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // 오버레이 닫기
  const onOverlayClick = () => {
    const params = new URLSearchParams(location.search);
    params.delete("movie");
    params.delete("tv");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      {!isLoading && (
        <SearchInfo>
          <Title>Search for "{keyword}"</Title>
          <ResultSummary>
            Movie: {filteredMovieCount}
            <br />
            Tv: {filteredTvCount}
          </ResultSummary>
        </SearchInfo>
      )}
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            {movieData?.results.length === 0 && tvData?.results.length === 0 ? (
              <NoResult>No results found for "{keyword}"</NoResult>
            ) : (
              <>
                {movieData && filteredMovieCount > 0 && (
                  <SliderSection>
                    <Slider
                      data={{ ...movieData, results: filteredMovies }}
                      title="Movies"
                      media_type="movie"
                      onBoxClicked={onMovieBoxClicked}
                    />
                  </SliderSection>
                )}
                {tvData && filteredTvCount > 0 && (
                  <SliderSection>
                    <Slider
                      data={{ ...tvData, results: filteredTvs }}
                      title="TV Shows"
                      media_type="tv"
                      onBoxClicked={onTvBoxClicked}
                    />
                  </SliderSection>
                )}
              </>
            )}
            {movieData && clickedMovie && (
              <BigMovieOverlay
                item={clickedMovie}
                onClose={onOverlayClick}
                layoutId={`Movies-${clickedMovie.id}`}
                y={bigMovieY}
              />
            )}
            {tvData && clickedTv && (
              <BigMovieOverlay
                item={clickedTv}
                onClose={onOverlayClick}
                layoutId={`TV Shows-${clickedTv.id}`}
                y={bigMovieY}
              />
            )}
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Search;
