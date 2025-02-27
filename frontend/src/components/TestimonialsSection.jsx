import PropTypes from 'prop-types';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = ({ testimonials }) => {
  return (
    <div className="p-10 md:p-16 pt-0">
      <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

TestimonialsSection.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  ).isRequired
};

export default TestimonialsSection;