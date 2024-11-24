const validate = (schema) => async (req, res, next) => {
  try {
    // Validate and parse request body using the provided schema
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    const status = 422; // Unprocessable Entity status code
    const message = "Input validation failed";
    const extraDetails = err.errors
      ? err.errors[0].message
      : "Unknown validation error";

    // Log the validation error for debugging purposes
    console.error(`Validation error: ${message}`, {
      status,
      extraDetails,
      requestBody: req.body,
    });

    // Forward the error to the error-handling middleware
    const error = {
      status,
      message,
      extraDetails,
    };
    next(error);
  }
};

module.exports = validate;
