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
      <Router basename="/react-movie">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<Home />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:tvId" element={<Tv />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
