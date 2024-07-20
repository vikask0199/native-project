export default {
  _dbConnectionSuccessful: false,
  get dbConnectionSuccessful() {
    return this._dbConnectionSuccessful;
  },
  set dbConnectionSuccessful(value) {
    this._dbConnectionSuccessful = value;
  },
};
