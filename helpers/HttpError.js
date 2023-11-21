const errorMessageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  500: "Internal Server Error",
  default: "Something went wrong...",
};

const HttpError = (
  status,
  message = errorMessageList[status] || errorMessageList.default
) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
