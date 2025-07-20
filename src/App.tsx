import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./components/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header />
        <Routes>
          <Route path="/react-movie/" element={<Home />} />
          <Route path="/react-movie/movies/:movieId" element={<Home />} />
          <Route path="/react-movie/tv" element={<Tv />} />
          <Route path="/react-movie/tv/:tvId" element={<Tv />} />
          <Route path="/react-movie/search" element={<Search />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
