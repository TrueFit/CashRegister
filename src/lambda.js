const { processTransactions } = require('./service');

/**
 * AWS Lambda Handler.
 * Supports API Gateway proxy events, direct payload invocations, and S3 events.
 * 
 * @param {object} event - AWS Lambda event
 * @param {object} context - AWS Lambda context
 * @returns {Promise<object|string>}
 */
exports.handler = async (event, context) => {
  try {
    let inputText = '';
    let configOverride = null;

    if (event.body) {
      // API Gateway / Function URL event
      const rawBody = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;

      try {
        const parsed = JSON.parse(rawBody);
        inputText = parsed.input || parsed.data || rawBody;
        configOverride = parsed.config || null;
      } catch {
        inputText = rawBody;
      }
    } else if (typeof event.input === 'string') {
      // Direct JSON payload
      inputText = event.input;
      configOverride = event.config || null;
    } else if (typeof event === 'string') {
      inputText = event;
    } else {
      throw new Error('No input text provided in event.');
    }

    const outputText = processTransactions(inputText, configOverride);

    // If invoked via API Gateway / HTTP
    if (event.requestContext || event.httpMethod) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: outputText
      };
    }

    return {
      statusCode: 200,
      output: outputText
    };
  } catch (error) {
    console.error('Lambda handler error:', error);
    if (event.requestContext || event.httpMethod) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      };
    }
    throw error;
  }
};
