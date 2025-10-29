/**
 * Success response class for consistent API responses
 */
class SuccessResponse {
  /**
   * Create a success response
   * @param {string} message - Success message
   * @param {*} data - Response data
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  constructor(message, data = null, statusCode = 200) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.success = true;
  }

  /**
   * Send the response
   * @param {import('express').Response} res - Express response object
   * @returns {import('express').Response} Express response
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      status: 'success',
      message: this.message,
      data: this.data,
    });
  }
}

/**
 * Success response for resource creation (201)
 */
class CreatedResponse extends SuccessResponse {
  constructor(message, data = null) {
    super(message, data, 201);
  }
}

/**
 * Success response for no content (204)
 */
class NoContentResponse extends SuccessResponse {
  constructor(message = 'No content') {
    super(message, null, 204);
  }

  send(res) {
    return res.status(this.statusCode).end();
  }
}

export { SuccessResponse, CreatedResponse, NoContentResponse };
