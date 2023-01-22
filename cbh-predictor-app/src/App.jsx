import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./pages/header/header";
import HomeScreen from "./pages/home/home";
import LoginForm from "./components/forms/loginForm";
import BingChart from "./pages/charts/bingGraphs";
import GoogleChart from "./pages/charts/googleGraphs";
import LeadChart from "./pages/charts/leadGraphs";
import OrderChart from "./pages/charts/orderGraphs";
import TableScreen from "./pages/table/tablescreen";
import NoPage from "./pages/nopage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<HomeScreen/>} />
          <Route path="login" element={<LoginForm/>} />
          <Route path="charts/bing" element={<BingChart/>} />
          <Route path="charts/google" element={<GoogleChart/>} />
          <Route path="charts/lead" element={<LeadChart/>} />
          <Route path="charts/order" element={<OrderChart/>} />
          <Route path="table/bing" element={<TableScreen table='Bing'/>} />
          <Route path="table/google" element={<TableScreen table='Google'/>} />
          <Route path="table/lead" element={<TableScreen table='Lead'/>} />
          <Route path="table/order" element={<TableScreen table='Order'/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
