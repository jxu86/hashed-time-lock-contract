const Joi = require('joi');
const {AppError} = require('../lib');

class BaseService {
  constructor (options = {}, schema = {}, ctx, ignore = false) {
    this.options = options;
    this.schema = schema;
    this.ctx = ctx;
    if (!ignore) this._validOptions();
  }

  warnError (msg, code = 1) {
    throw new AppError(msg, code);
  }

  _validOptions () {
    const {error, value} = Joi.validate(this.options, this.schema);
    if (error) {
      this.warnError(error.message || error.details[0].message);
    }
    this.options = value;
  }
}
module.exports = BaseService;
