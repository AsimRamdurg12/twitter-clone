import React from "react";
import { data, Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";

import RightPanel from "./components/RightPanel";
import Sidebar from "./components/SideBar";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;

        if (!res.ok) throw new Error(data.error || "Something went Wrong");
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {data && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={data ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!data ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!data ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={data ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={data ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {data && <RightPanel />}
      <Toaster />
    </div>
  );
};

export default App;
