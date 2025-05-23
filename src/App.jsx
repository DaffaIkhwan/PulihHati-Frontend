import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  return (
     <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-2 sm:px-4 py-8 w-full">
              <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                <img alt="Vite Logo" height="80" src={viteLogo} width="80" />
                <img alt="React Logo" height="80" src={reactLogo} width="80" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mt-4">
                Vite + React Tailwind PWA Boilerplate
              </h1>
              <p className="max-w-sm sm:max-w-md md:max-w-2xl mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                Kickstart your next Vite, React, Tailwind and PWA project with
                this boilerplate.
              </p>
            </div>
          }
        />
        <Route path="/service" element={<div className="p-8">Service Page</div>} />
        <Route path="/about" element={<div className="p-8">About Us Page</div>} />
        <Route path="/signin" element={<div className="p-8">Sign In Page</div>} />
        <Route path="/signup" element={<div className="p-8">Sign Up Page</div>} />
      </Routes>
    </>
  );
}