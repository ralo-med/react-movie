import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import type { IGetResult, IBaseItem } from "../api";

const SliderWrapper = styled.div`
  position: relative;
  margin-bottom: 300px;
  top: -150px;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 60px;
`;

const SliderTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 36px;
  font-weight: 600;
  margin: 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled(motion.button)`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  color: ${(props) => props.theme.white.lighter};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 300;

  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: none;
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
`;

const SliderContainer = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  background-size: cover;
  background-position: center center;
  aspect-ratio: 3 / 4;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background: linear-gradient(
    to top,
    ${(props) => props.theme.black.veryDark},
    transparent
  );
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween" as const,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween" as const,
    },
  },
};

const offset = 6;

interface ISliderProps {
  data: IGetResult;
  title: string;
  media_type: "movie" | "tv";
  onBoxClicked?: (itemId: number) => void;
}

const rowVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? window.outerWidth + 10 : -window.outerWidth - 10,
    };
  },
  center: {
    x: 0,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? window.outerWidth + 10 : -window.outerWidth - 10,
    };
  },
};

function Slider({ data, title, media_type, onBoxClicked }: ISliderProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  const filteredResults = data.results.filter(
    (item: IBaseItem) => !!item.backdrop_path
  );
  const totalMovies = filteredResults.length;
  const maxIndex = Math.ceil(totalMovies / offset) - 1;

  const paginate = (newDirection: number) => {
    if (leaving || !data) return;
    toggleLeaving();
    let newIndex = index + newDirection;
    if (newIndex > maxIndex) newIndex = 0;
    if (newIndex < 0) newIndex = maxIndex;
    setIndex(newIndex);
    setPage([page + 1, newDirection]);
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const defaultBoxClick = (itemId: number) => {
    navigate(`/${media_type === "movie" ? "movies" : "tv"}/${itemId}`);
  };

  return (
    <SliderWrapper>
      <SliderHeader>
        <SliderTitle>{title}</SliderTitle>
        <NavigationButtons>
          <NavButton
            onClick={() => paginate(-1)}
            disabled={leaving}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </NavButton>
          <NavButton
            onClick={() => paginate(1)}
            disabled={leaving}
            whileTap={{ scale: 0.9 }}
          >
            →
          </NavButton>
        </NavigationButtons>
      </SliderHeader>
      <SliderContainer>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={direction}
        >
          <Row
            key={page}
            custom={direction}
            variants={rowVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
          >
            {filteredResults
              .slice(offset * index, offset * index + offset)
              .map((item: IBaseItem) => (
                <Box
                  layoutId={`${title}-${item.id}`}
                  key={item.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() =>
                    onBoxClicked
                      ? onBoxClicked(item.id)
                      : defaultBoxClick(item.id)
                  }
                  transition={{ type: "tween" }}
                  style={{
                    backgroundImage: `url(${makeImagePath(
                      item.backdrop_path,
                      "w500"
                    )})`,
                    backgroundColor: "transparent",
                  }}
                >
                  <Info variants={infoVariants}>
                    <h4>{item.title || item.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </SliderContainer>
    </SliderWrapper>
  );
}

export default Slider;
