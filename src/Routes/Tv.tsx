import { useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  getAiringTodayTvs,
  getOnTheAirTvs,
  getPopularTvs,
  getTopRatedTvs,
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

const BigTv = styled(motion.div)`
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

function Tv() {
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId");
  const { scrollY } = useScroll();
  const bigTvY = useTransform(scrollY, (y) => y + 100);

  const [
    { data: airingTodayData, isLoading: airingTodayLoading },
    { data: onTheAirData, isLoading: onTheAirLoading },
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["tv", "airingToday"],
        queryFn: getAiringTodayTvs,
      },
      {
        queryKey: ["tv", "onTheAir"],
        queryFn: getOnTheAirTvs,
      },
      {
        queryKey: ["tv", "popular"],
        queryFn: getPopularTvs,
      },
      {
        queryKey: ["tv", "topRated"],
        queryFn: getTopRatedTvs,
      },
    ],
  });

  const isLoading =
    airingTodayLoading || onTheAirLoading || popularLoading || topRatedLoading;

  const onOverlayClick = () => navigate("/tv");

  const findTvAndCategory = (
    tvId: string
  ): { tv: IBaseItem | undefined; category: string | undefined } => {
    if (airingTodayData?.results.find((t: IBaseItem) => t.id === +tvId)) {
      return {
        tv: airingTodayData.results.find((t: IBaseItem) => t.id === +tvId)!,
        category: "Airing Today",
      };
    }
    if (onTheAirData?.results.find((t: IBaseItem) => t.id === +tvId)) {
      return {
        tv: onTheAirData.results.find((t: IBaseItem) => t.id === +tvId)!,
        category: "On The Air",
      };
    }
    if (popularData?.results.find((t: IBaseItem) => t.id === +tvId)) {
      return {
        tv: popularData.results.find((t: IBaseItem) => t.id === +tvId)!,
        category: "Popular",
      };
    }
    if (topRatedData?.results.find((t: IBaseItem) => t.id === +tvId)) {
      return {
        tv: topRatedData.results.find((t: IBaseItem) => t.id === +tvId)!,
        category: "Top Rated",
      };
    }
    return { tv: undefined, category: undefined };
  };

  const { tv: clickedTv, category: clickedTvCategory } = bigTvMatch?.params.tvId
    ? findTvAndCategory(bigTvMatch.params.tvId)
    : { tv: undefined, category: undefined };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].name}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>

          {airingTodayData && (
            <Slider
              data={airingTodayData}
              title="Airing Today"
              media_type="tv"
            />
          )}
          {onTheAirData && (
            <Slider data={onTheAirData} title="On The Air" media_type="tv" />
          )}
          {popularData && (
            <Slider data={popularData} title="Popular" media_type="tv" />
          )}
          {topRatedData && (
            <Slider data={topRatedData} title="Top Rated" media_type="tv" />
          )}

          <AnimatePresence>
            {bigTvMatch && clickedTv ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{
                    top: bigTvY,
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url(${makeImagePath(
                      clickedTv.backdrop_path,
                      "w500"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                  layoutId={`${clickedTvCategory}-${clickedTv.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.3, type: "tween" }}
                  >
                    <BigTitle>{clickedTv.name}</BigTitle>
                    <BigOverview>{clickedTv.overview}</BigOverview>
                  </motion.div>
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
