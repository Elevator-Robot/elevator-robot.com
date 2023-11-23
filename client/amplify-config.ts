const amplifyConfig = {
    Auth: {
        region: process.env.GATSBY_APP_AWS_REGION,
        userPoolId: process.env.GATSBY_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.GATSBY_APP_USER_POOL_WEB_CLIENT_ID,
    },
};

export default amplifyConfig;
