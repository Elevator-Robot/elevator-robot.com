const awsConfig = {
  Auth: {
    region: "YOUR_AWS_REGION",
    userPoolId: "YOUR_USER_POOL_ID",
    userPoolWebClientId: "YOUR_APP_CLIENT_ID",
    // any other configuration
  },
  // Additional services that you might use e.g., API Gateway, S3
};

export default awsConfig;
