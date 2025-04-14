import React from 'react';

const SkillsSection = () => {
  // Skills data organized by category
  const skillsData = {
    frontend: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3/SCSS', level: 85 },
      { name: 'JavaScript', level: 95 },
      { name: 'React', level: 90 },
      { name: 'Vue.js', level: 80 },
      { name: 'Tailwind CSS', level: 85 },
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'RESTful APIs', level: 85 },
      { name: 'GraphQL', level: 65 },
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Figma', level: 80 },
      { name: 'Jest', level: 75 },
      { name: 'CI/CD', level: 70 },
    ]
  };

  // Helper function to render skill bars
  const renderSkillBar = (skill) => (
    <div key={skill.name} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-300">{skill.name}</span>
        <span className="text-gray-400">{skill.level}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full">
        <div 
          className="h-2 bg-blue-600 rounded-full" 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-10 md:px-16 ">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-10">Skills & Technologies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend Skills */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Frontend</h3>
            {skillsData.frontend.map(renderSkillBar)}
          </div>
          
          {/* Backend Skills */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Backend</h3>
            {skillsData.backend.map(renderSkillBar)}
          </div>
          
          {/* Tools & Others */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Tools & Others</h3>
            {skillsData.tools.map(renderSkillBar)}
          </div>
        </div>
        
        <div className="mt-12 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Other Skills & Competencies</h3>
          <div className="flex flex-wrap gap-3">
            {['UI/UX Design', 'Responsive Design', 'Performance Optimization', 'SEO', 'Accessibility', 
              'Progressive Web Apps', 'Agile Methodology', 'Technical Writing', 'Mentoring', 'Problem Solving'
            ].map(skill => (
              <span 
                key={skill} 
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 