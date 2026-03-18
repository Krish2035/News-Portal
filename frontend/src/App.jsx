import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInForm from "./auth/forms/SignInForm";
import SignUpForm from "./auth/forms/SignUpForm";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NewsArticles from "./pages/NewsArticles";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { Toaster } from "./components/ui/sonner";
import PrivateRoute from "./components/shared/PrivateRoute.jsx";
import CreatePost from "./pages/CreatePost";
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import ScrollToTop from "./components/shared/ScrollToTop";
import Search from "./pages/Search";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/news" element={<NewsArticles />} />
        <Route path="/post/:postSlug" element={<PostDetails />} />

        {/* Authenticated User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
        </Route>
      </Routes>
      <Footer />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
};

export default App;