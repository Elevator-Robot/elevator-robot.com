import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Replace with your region if different
const amplify = new AWS.Amplify();

async function unassociateDomain() {
  try {
    const params = {
      appId: 'dh6e4d2mc0nxp',
      domainName: 'elevator-robot.com'
    };

    const response = await amplify.deleteAppDomain(params).promise();
    console.log('Domain unassociated successfully:', response);
  } catch (error) {
    console.error('Error unassociating domain:', error);
    process.exit(1);
  }
}

unassociateDomain();
