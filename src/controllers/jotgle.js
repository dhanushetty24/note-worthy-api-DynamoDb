const { DynamoDBClient, ScanCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb"); 
const Joi = require('joi')

//Client initialization
const dynamodb = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const TABLE_NAME = process.env.TABLE_NAME;

//Create a new jotgle
exports.createJotgle = (req,res) => {
  const {
    title,
    description
  } = req.body;

  const schema = Joi.object()
  .keys({
    title: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(new Error("Input must be a string between 5 and 50 characters long, and cannot be empty.")),
    description: Joi.string()
    .max(500)
    .error(new Error("Input must be a string less than 500 characters long."))
  });

  const result = schema.validate({
    title,
    description
  });

  if (result.error) {
    return res.status(400).send({
      error: result.error.message
    });
  };

  return res.status(201).send({
    id: 87654,
    title, 
    description, 
    message: "Jotgle created successfully."
  });
}

//Fetch all jotgles
exports.getJotgles = async (req,res) => {
  try {
    const input = {
      TableName: TABLE_NAME
    };
    const command = new ScanCommand(input);
    const response = await dynamodb.send(command);
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Internal Server Error'});
  };
};

//Fetch a specific jotgles
exports.getAJotgle = async (req,res) => {
  try {
    const id = req.params?.id;
    const input = {
      TableName: TABLE_NAME,
      Key: {
        "id": {
          "S": `${id}`
        }
      }
    };

    const command = new GetItemCommand(input);
    const response = await dynamodb.send(command);
    if (!response.Item) {
      return res.status(404).send({ message: 'Jotgle not found' });
    }

    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Internal Server Error'});
  }
}

//Update a jotgle
exports.updateJotgle = (req,res) => {
  const {
    title,
    description
  } = req.body;

  const schema = Joi.object()
  .keys({
    title: Joi.string()
      .min(5)
      .max(50)
      .error(new Error("Input must be a string between 5 and 50 characters long.")),
    description: Joi.string()
      .max(500)
      .error(new Error("Input must be a string less than 500 characters long."))
  })
  .or('title', 'description') // Ensures at least one is required.
  .error(new Error("At least one of 'title' or 'description' must be provided."));


  const result = schema.validate({
    title,
    description
  });

  if (result.error) {
    return res.status(400).send({
      error: result.error.message
    });
  };

  return res.status(200).send({
    id: 87654,
    title, 
    description, 
    message: "Jotgle updated."
  });
}

//Delete a specific jotgles
exports.deleteJotgle = (req,res) => {
  const id = req.params.id;
  return res.status(200).send(
    {
     message: 'Jotgle deleted successfully.'
    });
}
