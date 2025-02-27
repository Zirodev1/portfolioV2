import PropTypes from 'prop-types';

const TestimonialCard = ({ testimonial }) => {
  const { quote, author, role, company, avatar } = testimonial;
  
  return (
    <div className="bg-gray-900 bg-opacity-50 rounded-lg p-8 border border-gray-800">
      <p className="text-gray-300 mb-6">
        &quot;{quote}&quot;
      </p>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={author} 
          className="w-12 h-12 rounded-full mr-4 object-cover" 
        />
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-gray-400">{role} AT {company}</p>
        </div>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    quote: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
  }).isRequired
};

export default TestimonialCard;