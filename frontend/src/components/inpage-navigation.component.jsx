import { useEffect, useRef, useState } from "react";

export let activeTabRef;
export let activaeTabLineRef;


const InPageNavigation = ( { routes, defaultHidden = [ ], defaultActiveIndex = 0, children } ) => {
  activaeTabLineRef = useRef();
  activeTabRef = useRef()
  

  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState= (btn,i) => {
    let { offsetWidth, offsetLeft} = btn;

    activaeTabLineRef.current.style.width = offsetWidth + "px";
    activaeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNavIndex(i)
  }

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex)
  },[])

  return (
    <>
      <div className="relative mb-8  border-b border-grey flex flex-wrap overflow-x-auto">
        {
          routes.map((route, i) => {
            return (
              <button 
                ref={i == defaultActiveIndex ? activeTabRef : null}
                key={i}  
                className={"p-4 px-5 capitalize " + ( defaultHidden.includes(route) ? " md:hidden" : " ")}
                onClick={(e) => { changePageState(e.target, i)}} 
              >
                {route}
              </button>
            )
          })
        }

        <hr ref={activaeTabLineRef} className="absolute bottom-0 duration-300 border-dark-grey"/>

      </div>

      { Array.isArray(children) ? children[inPageNavIndex] : children }
    </>
  )
}

export default InPageNavigation;