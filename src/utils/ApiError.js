class Apierror extends Error {
  constructor(
    status_code,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.status_code = status_code;
    this.data = null;
    this.message = message;
    this.succes = false;
    this.errors = this.errors;

    if (stack) {
      this.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { Apierror };
