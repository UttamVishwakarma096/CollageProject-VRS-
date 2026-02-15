import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Layout from "../layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SavedCar from "../pages/SavedCar";
import AllVehicles from "../pages/AllVehicles";
import CarDetails from "../pages/CarCetails";
import Compare from "../pages/Compare";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/saved_car" element={<SavedCar />} />
          </Route>

          <Route path="/cars" element={<AllVehicles />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/car/:id" element={<CarDetails />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
