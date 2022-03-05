class AppError extends Error {
    constructor (msg, code) {
      super();
      this.status = 200;
      this.code = code;
      this.message = msg;
    }
  }
  
  module.exports = AppError;
  