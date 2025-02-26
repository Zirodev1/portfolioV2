import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/home.page";
import ContactPage from "./pages/contact.page";
import AboutPage from "./pages/about.page";


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/about" element={<AboutPage /> } />
      </Routes>
    </Router>
  )
}

export default App
