import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

// This is a single-page project, so App.jsx is intentionally sparse.
// If you're merging this into your existing michaelcalle.com router
// instead of deploying it standalone, drop the <BrowserRouter> here
// and just add <Route path="/ant" element={<Home />} /> to your
// existing route tree.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
