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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        {/* Add more routes as you build them */}
        <Route path="/store" element={<StorePage />}/>
        <Route path="/products/:id" element={<ProductDetailPage />}/>
        <Route path="/blog" element={<BlogPage />}/>
        {/* <Route path="/blog/:slug" element={<BlogPostPage />}/> */}
      </Routes>
    </Router>
  )
}

export default App