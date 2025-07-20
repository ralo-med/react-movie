const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "c4f50010192b2b2f1998f21e7bb44d03";

export interface IBaseItem {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title?: string;
  name?: string;
}

export interface IGetResult {
  page: number;
  results: IBaseItem[];
  total_pages: number;
  total_results: number;
  dates?: {
    maximum: string;
    minimum: string;
  };
}

export type IMovie = IBaseItem;

export type ITv = IBaseItem;

export function getNowPlayingMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAiringTodayTvs() {
  return fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getOnTheAirTvs() {
  return fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTvs() {
  return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTvs() {
  return fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function searchMovies(keyword: string) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function searchTvs(keyword: string) {
  return fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
