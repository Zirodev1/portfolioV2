import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home.page";
import ContactPage from "./pages/contact.page";
import AboutPage from "./pages/about.page";
import WorkPage from "./pages/work.page";
import ProjectDetailPage from "./pages/project-detail.page";
import StorePage from "./pages/store.page";
import ProductDetailPage from "./pages/product-detail.page";
import BlogPage from "./pages/blog.page";
import BlogPostPage from "./pages/blog-post.page";
import ProfilePage from "./pages/profile.page";
import CheckoutSuccessPage from "./pages/CheckoutPage";

// Admin pages
import AdminProductDashboard from "./pages/admin/admin-product-dashboard.page";
import ProductFormPage from "./pages/admin/product-form.page";
import AdminProjectDashboard from "./pages/admin/admin-project-dashboard.page";
import ProjectFormPage from "./pages/admin/project-form.page";
import AdminDashboard from "./pages/admin/admin-dashboard.page";
import AdminBlogDashboard from "./pages/admin/admin-blog-dashboard.page";
// import AdminMediaLibrary from "./pages/admin/admin-media-library.page";
// import AdminSettings from "./pages/admin/admin-settings.page";

// Auth pages
// import LoginPage from "./pages/auth/login.page";
// import AuthGuard from "./components/auth/AuthGuard";

// Create UserContext
export const UserContext = createContext({});

function App() {
  // User authentication state
  const [userAuth, setUserAuth] = useState({
    accessToken: null,
    username: null,
    isAdmin: false
  });

  // Check for existing auth on component mount
  useEffect(() => {
    // Check localStorage or sessionStorage for stored authentication data
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserAuth({
          accessToken: storedToken,
          username: user.username,
          isAdmin: user.isAdmin || false
        });
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#1E3A8A',
              },
            },
            error: {
              style: {
                background: '#991B1B',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage/>} />
          <Route path="/contact" element={<ContactPage />}/>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          
          {/* Checkout and Purchase Routes */}
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          
          {/* Auth Routes */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          
          {/* Admin Routes - In a real app, these would be wrapped with AuthGuard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductDashboard />} />
          <Route path="/admin/products/new" element={<ProductFormPage />} />
          <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />
          <Route path="/admin/projects" element={<AdminProjectDashboard />} />
          <Route path="/admin/projects/new" element={<ProjectFormPage />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectFormPage />} />
          <Route path="/admin/blog" element={<AdminBlogDashboard />} />
          {/* <Route path="/admin/media" element={<AuthGuard><AdminMediaLibrary /></AuthGuard>} /> */}
          {/* <Route path="/admin/settings" element={<AuthGuard><AdminSettings /></AuthGuard>} /> */}
          
          {/* 404 Route would go here */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App