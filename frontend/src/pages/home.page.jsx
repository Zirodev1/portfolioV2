import { Link } from "react-router-dom";
import SideBar from "../components/sidebar.component";

import profilePNG from '../imgs/about.png'

const HomePage = () => {
  
  return(
    <div className="flex">
      <SideBar />
      <div className="w-full flex items-center justify-between p-10">
        <img className="w-36 h-36 rounded-sm" src={profilePNG} />
        <Link to="/contact" className="text-green-500 bg-green-900 bg-opacity-35 h-8 text-center w-32"> Open to work</Link>
      </div>
    </div>
  )
}

export default HomePage;