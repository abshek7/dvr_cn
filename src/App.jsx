import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DistanceVectorSimulator from "./pages/DistanceVectorSimulator";

const App = () => (
  <Router>
    <TooltipProvider>
      <Toaster />
  <Routes>
        <Route path="/" element={<DistanceVectorSimulator />} />
  </Routes>
     </TooltipProvider>
  </Router>
);

export default App;

