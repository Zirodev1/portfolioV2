import PropTypes from 'prop-types';

const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
  if (state?.totalDocs <= state?.results?.length) {
    return null;
  }

  return (
    <button
      onClick={() => fetchDataFun({ page: state.page + 1, user_id: state.user_id })}
      className="text-gray-300 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-md mt-8 mx-auto block"
    >
      Load More
    </button>
  );
};

LoadMoreDataBtn.propTypes = {
  state: PropTypes.shape({
    page: PropTypes.number,
    totalDocs: PropTypes.number,
    results: PropTypes.array,
    user_id: PropTypes.string
  }),
  fetchDataFun: PropTypes.func.isRequired
};

export default LoadMoreDataBtn;