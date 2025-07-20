import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import type { IBaseItem } from "../api";
import { MotionValue } from "framer-motion";

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

interface BigMovieOverlayProps {
  item: IBaseItem;
  onClose: () => void;
  layoutId?: string;
  y?: MotionValue<number>;
}

export default function BigMovieOverlay({
  item,
  onClose,
  layoutId,
  y,
}: BigMovieOverlayProps) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <Overlay
            onClick={onClose}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <BigMovie
            style={{
              top: y,
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url(${makeImagePath(
                item.backdrop_path ?? "",
                "w500"
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
            layoutId={layoutId}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3, type: "tween" }}
            >
              <BigTitle>{item.title || item.name}</BigTitle>
              <BigOverview>{item.overview}</BigOverview>
              {/* 필요하다면 mediaType, category 등 추가 정보 표시 가능 */}
            </motion.div>
          </BigMovie>
        </>
      )}
    </AnimatePresence>
  );
}
