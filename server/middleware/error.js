const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred.";
  const extraDetails = err.extraDetails || "No additional details provided.";

  // Log the error details for debugging purposes
  console.error(
    `Error Status: ${status}, Message: ${message}, Details: ${extraDetails}`
  );

  // Send a standardized error response to the client
  return res.status(status).json({
    error: {
      message,
      extraDetails,
    },
  });
};

module.exports = errorMiddleware;
