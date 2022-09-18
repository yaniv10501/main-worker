class ResourceNotFound extends Error {
  constructor(req, res, next) {
    super('Requested resource not found');
    this.name = 'ResourceNotFound';
    this.status = 404;
    next(this);
  }
}

module.exports = (req, res, next) => new ResourceNotFound(req, res, next);
