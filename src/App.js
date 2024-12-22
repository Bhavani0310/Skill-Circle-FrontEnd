import React, { useEffect, useState } from "react";
import "./index.css"
import "@fortawesome/fontawesome-free/css/all.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import navigationRoutes from "./routes/auth-route";
import providerRoutes from "./routes/provider-route";
import Home from "./pages/Home";
import ProtectedRouter from "./middleware/ProtectedRouter";
import ProviderRouter from "./middleware/ProviderRouter";
import nonAuthRoute from "./routes/non-auth-route";
import SuspenseLayout from "./components/SuspenseLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <Routes>
          <Route element={<SuspenseLayout />}>
            <Route path="/" element={<Home />} />

            <Route element={<ProtectedRouter />}>
              <Route>
                {navigationRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element}>
                    {route.children &&
                      route.children.map((child, childIndex) => (
                        <Route
                          key={childIndex}
                          path={child.path}
                          element={child.element}
                        />
                      ))}
                  </Route>
                ))}
              </Route>
            </Route>

            <Route element={<ProviderRouter/>}>
              <Route>
                {providerRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element}>
                    {route.children &&
                      route.children.map((child, childIndex) => (
                        <Route
                          key={childIndex}
                          path={child.path}
                          element={child.element}
                        />
                      ))}
                  </Route>
                ))}
              </Route>
            </Route>  

            {nonAuthRoute.map((route, index) => {
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
