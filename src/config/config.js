const dynamoose = require("dynamoose");

// Configuration for AWS SDK
const ddb = new dynamoose.aws.ddb.DynamoDB({
  "credentials": {
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
  },
  "region": process.env.AWS_DEFAULT_REGION
});

try {
  // Set DynamoDB instance to Dynamoose
  dynamoose.aws.ddb.set(ddb);
  console.log("DynamoDB configured successfully!");
} catch (error) {
  console.error("Failed to configure DynamoDB:", error);
  throw error;
}
