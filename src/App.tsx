import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/shared/Header";
import DialogStored from "./components/shared/DialogStored";
import { ToastProvider } from "./components/providers/ToastProvider";
import HomePage from "./pages/HomePage";
import Learn from "./pages/Learn";
import DevelopersOnchain from "./pages/DevelopersOnchain";
import Developers from "./pages/Developers";
const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/developers-onchain" element={<DevelopersOnchain />} />
            <Route path="/developers-offchain" element={<Developers />} />
            <Route path="*" element={<div className="text-center">Page not found!</div>} />
          </Routes>
        </main>
        <DialogStored />
      </div>
    </ToastProvider>
  );
};

export default App;
