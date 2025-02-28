import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/home.page";
import ContactPage from "./pages/contact.page";
import AboutPage from "./pages/about.page";
import WorkPage from "./pages/work.page";
import ProjectDetailPage from "./pages/project-detail.page";
import StorePage from "./pages/store.page";
import ProductDetailPage from "./pages/product-detail.page";
import BlogPage from "./pages/blog.page";
import BlogPostPage from "./pages/blog-post.page";

// Admin pages
import AdminProductDashboard from "./pages/admin/admin-product-dashboard.page";
// import AdminDashboard from "./pages/admin/admin-dashboard.page";
import AdminBlogDashboard from "./pages/admin/admin-blog-dashboard.page";
// import AdminMediaLibrary from "./pages/admin/admin-media-library.page";
// import AdminSettings from "./pages/admin/admin-settings.page";

// Auth pages
// import LoginPage from "./pages/auth/login.page";
// import AuthGuard from "./components/auth/AuthGuard";

function App() {
  return (
    <Router>
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
        
        {/* Auth Routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        
        {/* Admin Routes - In a real app, these would be wrapped with AuthGuard */}
        {/* <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} /> */}
        <Route path="/admin/products" element={<AdminProductDashboard />} />
        <Route path="/admin/blog" element={<AdminBlogDashboard />} />
        {/* <Route path="/admin/media" element={<AuthGuard><AdminMediaLibrary /></AuthGuard>} /> */}
        {/* <Route path="/admin/settings" element={<AuthGuard><AdminSettings /></AuthGuard>} /> */}
        
        {/* 404 Route would go here */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App