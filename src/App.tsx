
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateBond from "./pages/CreateBond";
import Bond from "./pages/Bond";
import { BondProvider } from "./context/bond";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BondProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateBond />} />
            <Route path="/bond" element={<Bond />} />
            <Route path="/join/:code" element={<CreateBond />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BondProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
