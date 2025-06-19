
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditProductList from "./pages/EditProductList";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import DiagnosisResult from "./pages/DiagnosisResult";
import { AddressProvider } from "@/contexts/AddressContext";
import { SuppliesProvider } from "@/contexts/SuppliesContext";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SuppliesProvider>
          <AddressProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/diagnosis" element={<Index />} />
              <Route path="/diagnosis-result" element={<DiagnosisResult />} />
              <Route path="/edit-products" element={<EditProductList />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </AddressProvider>
          </SuppliesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
