import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignInForm from "./auth/forms/SignInForm"
import SignUpForm from "./auth/forms/SignUpForm"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import NewsArticles from "./pages/NewsArticles"
import Header from "./components/shared/Header"
import Footer from "./components/shared/Footer"
import { Toaster } from "./components/ui/sonner"
import PrivateRoute from "./components/shared/PrivateRoute.jsx"

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/news" element={<NewsArticles />} />
      </Routes>

      <Footer />

      <Toaster />
    </BrowserRouter>
  );
}

export default App