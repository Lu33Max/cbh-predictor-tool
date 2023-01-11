import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./pages/header/header";
import HomeScreen from "./pages/home";
import LoginForm from "./components/forms/loginForm";
import BingChart from "./pages/charts/bingGraphs";
import GoogleChart from "./pages/charts/googleGraphs";
import LeadChart from "./pages/charts/leadGraphs";
import OrderChart from "./pages/charts/orderGraphs";
import TableScreen from "./pages/table/tablescreen";
import NoPage from "./pages/nopage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={loggedIn ? <HomeScreen loggedIn={loggedIn}/> : <Navigate replace to="/login"/>} />
          <Route path="login" element={<LoginForm setLoggedIn={setLoggedIn}/>} />
          <Route path="charts/">
            <Route path="bing" element={<BingChart/>} />
            <Route path="google" element={<GoogleChart/>} />
            <Route path="lead" element={<LeadChart/>} />
            <Route path="order" element={<OrderChart/>} />
          </Route>
          <Route path="table/">
            <Route path="bing" element={<TableScreen table='Bing'/>} />
            <Route path="google" element={<TableScreen table='Google'/>} />
            <Route path="lead" element={<TableScreen table='Lead'/>} />
            <Route path="order" element={<TableScreen table='Order'/>} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
