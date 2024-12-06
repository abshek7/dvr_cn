import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
 

const App = () => (
  <Router>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
      </Routes>
    </TooltipProvider>
  </Router>
);

export default App;

