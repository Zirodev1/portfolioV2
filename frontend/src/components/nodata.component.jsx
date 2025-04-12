import PropTypes from 'prop-types';

const NoDataMessage = ({ message }) => {
  return (
    <div className="text-center w-full p-8 rounded-lg border border-gray-700 my-6">
      <p className="text-xl text-gray-400">{message}</p>
    </div>
  );
};

NoDataMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default NoDataMessage;