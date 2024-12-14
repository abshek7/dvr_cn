import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import DistanceVectorSimulator from "./pages/DistanceVectorSimulator";

const App = () => (
  <Router>
      <Toaster />
  <Routes>
        <Route path="/" element={<DistanceVectorSimulator />} />
  </Routes>
  </Router>
);

export default App;

