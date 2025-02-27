import { CgHome } from "react-icons/cg";
import { MdWorkOutline } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { MdOutlineTravelExplore } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const SideBar = () => {

  const sidebarItems = [
    {
      list: 'Home',
      url: "/",
      icon: <CgHome />
    },
    {
      list: 'Work',
      url: "/work",
      icon: <MdWorkOutline />
    },
    {
      list: 'Store',
      url: "/store",
      icon: <MdOutlineStorefront />
    },
    {
      list: 'Ventures - coming soon',
      url: "/ventures",
      icon: <MdOutlineTravelExplore />
    },
    {
      list: 'Blog',
      url: "/blog",
      icon: <IoNewspaperOutline />
    },
    {
      list: 'About',
      url: "/about",
      icon: <FaRegUserCircle />
    },
    {
      list: 'Contact',
      url: "/contact",
      icon: <IoMailOutline />
    },
  ]

  return (
    <div className="h-screen border-r sticky top-0 border-gray-700 w-[339px]">
    <ul>
      <li className="py-6 px-8 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Lee Acevedo</h2>
        <p className="text-gray-400">Full-Stack Engineer</p>
      </li>
      {
        sidebarItems.map((item, id) => {
          return <li className="py-5 px-8 border-b border-gray-700 hover:cursor-pointer text-gray-400 " key={id}>
            <Link className="flex items-center gap-2 text-xl" to={item.url}>
              {item.icon} {item.list}
            </Link>
            </li>
        })
      }
    </ul>
    </div>
  )
}

export default SideBar;