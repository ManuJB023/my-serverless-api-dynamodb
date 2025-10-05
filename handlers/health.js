module.exports.health = async () => {
  const isOffline = process.env.IS_OFFLINE === 'true';

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'API is healthy!',
      environment: isOffline ? 'offline (local)' : 'AWS Lambda',
      stage: process.env.STAGE || 'unknown',
      version: process.env.VERSION || 'unknown',
      timestamp: new Date().toISOString(),
    }),
  };
};
