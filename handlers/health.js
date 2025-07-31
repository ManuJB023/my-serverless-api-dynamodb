module.exports.health = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'API is healthy!',
      timestamp: new Date().toISOString(),
      stage: process.env.STAGE || 'dev',
      version: process.env.VERSION || '1.0.0'
    }, null, 2),
  };
};