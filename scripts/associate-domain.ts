import AWS from 'aws-sdk';

const amplify = new AWS.Amplify();

async function associateDomain() {
  try {
    const params = {
      appId: 'dh6e4d2mc0nxp',
      domainName: 'elevator-robot.com',
      subDomainSettings: [
        {
          prefix: 'www',
          branchName: 'main'
        }
      ]
    };

    const response = await amplify.createDomainAssociation(params).promise();
    console.log('Domain association created successfully:', response);
  } catch (error) {
    console.error('Error associating domain:', error);
    process.exit(1);
  }
}

associateDomain();