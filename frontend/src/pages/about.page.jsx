import SideBar from "../components/sidebar.component";
import { Link } from "react-router-dom";

import aboutImg from "../imgs/about.png";

const AboutPage = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="border-b w-full h-max mb-16 border-gray-700">
        <main className=" w-[800px] px-12 pt-12 pb-40 mx-auto flex-col items-center justify-center">
          <h1 className="mb-3">About Lee</h1>
          <p className="mb-16 leading-relaxed tracking-wide">
            I am a dedicated and forward-thinking full stack developer, driven
            by a passion for crafting powerful web applications and immersive
            digital experiences. My approach to development emphasizes both
            creativity and precision, making use of the latest tools and
            frameworks to transform ideas into user-centric solutions.
          </p>
          <img className=" mx-auto w-64 h-64 rounded-full" src={aboutImg} />
          <p className="mb-6 mt-16 leading-relaxed tracking-wide text-gray-400">
            With a robust foundation in both front-end and back-end
            technologies, I excel at building applications that blend aesthetics
            with functionality. My journey as a developer has refined my
            understanding of modern design principles, user interaction
            patterns, and the technical intricacies that drive seamless digital
            experiences. This expertise allows me to approach projects
            holistically, ensuring every detail aligns with a projects goals
            and audience needs.
          </p>
          <p className="mb-6 leading-relaxed tracking-wide text-gray-400">
            What distinguishes my work is my dedication to innovation and
            versatility. From React and Node.js to Vite, I leverage a diverse
            toolkit to create adaptable and scalable solutions. My commitment to
            exploring emerging technologies empowers me to deliver efficient,
            optimized, and future-ready applications. This dedication to
            continuous learning means my work remains at the cutting edge,
            providing clients and users with high-quality, performant solutions.
          </p>
          <p className="mb-6 leading-relaxed tracking-wide text-gray-400">
            Whether I’m building responsive layouts, architecting efficient
            back-end systems, or fine-tuning the user experience, my goal is
            always to exceed expectations. I am passionate about creating
            impactful work that resonates with users, and I pride myself on
            delivering products that are both practical and visually engaging.
          </p>
          <p className="mb-6 leading-relaxed tracking-wide text-gray-400">
            I invite you to explore my portfolio, where you’ll find a collection
            of projects that highlight my expertise across various frameworks
            and my commitment to exceptional user experiences. Each project
            exemplifies my enthusiasm for full stack development and my drive to
            turn complex concepts into intuitive, impactful solutions.
          </p>
          <p className="mb-6 leading-relaxed tracking-wide text-gray-400">
            Thank you for visiting my portfolio. I look forward to connecting
            and exploring how my skills can bring your vision to life. Together,
            we can create innovative solutions that push the boundaries of
            what’s possible in web development.
          </p>
        </main>
        <Link to="/contact">Contact Me!</Link>
      </div>
    </div>
  );
};

export default AboutPage;
