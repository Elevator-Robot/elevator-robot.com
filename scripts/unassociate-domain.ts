import AWS from 'aws-sdk';

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
