import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TestimonialsSection = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Next testimonial
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Previous testimonial
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 px-10 md:px-16 ">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-center">What Clients Say</h2>
        
        <div className="relative">
          {/* Main testimonial display */}
          <div className="bg-gray-800 rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].author} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-300 mb-4 text-lg italic relative">
                  <span className="text-4xl text-blue-500 absolute -left-5 -top-3">"</span>
                  {testimonials[activeIndex].quote}
                  <span className="text-4xl text-blue-500 ml-2">"</span>
                </p>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{testimonials[activeIndex].author}</h4>
                    <p className="text-gray-400">{testimonials[activeIndex].role} @ {testimonials[activeIndex].company}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button 
                      onClick={prevTestimonial}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 mx-1 rounded-full ${
                  index === activeIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

TestimonialsSection.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default TestimonialsSection;