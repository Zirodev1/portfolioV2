import SideBar from "../components/sidebar.component"

const ContactPage = () => {

  return (
    <div className="flex ">
    <SideBar />
    <div className="border-b w-full h-max border-gray-700">

    <main className="h-[650px] w-[800px] px-12 pt-12 pb-40 mx-auto flex-col items-center justify-center">
      <div className="mb-14">
        <h1 className="mb-3">Lets Chat</h1>  
        <p className="text-gray-400">if you would like to talk about potential projects, send a massage or can email me directly at</p>
        <p>lee.acevedo786@gmail.com</p>
      </div>
    <form>
      <div className="mb-3 flex gap-4">
        <input className="w-1/2 p-2 rounded-md" type="text" placeholder="Name" />
        <input className="w-1/2 p-2 rounded-md" type="email" placeholder="Email" />
      </div>
      <textarea className="w-full h-44 p-3 mb-3" placeholder="Message" />
      <button className="w-full bg-blue-400 text-black py-3 rounded-md" type="submit" >Send Message</button>
    </form>
    </main>
    </div>
  </div>
  )
}

export default ContactPage;