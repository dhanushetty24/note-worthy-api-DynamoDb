const dynamoose = require('dynamoose')
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;

//Create a new jotgle
exports.createJotgle = async (req,res) => {
  try {
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

    const JotgleModel = dynamoose.model('jotgle-table');
    const jotgle = new JotgleModel({
      id: uuidv4(),
      title,
      description
    });
    console.log("your log => ~ exports.createJotgle= ~ jotgle:", jotgle)
    await jotgle.save();
    console.log("your log => ~ exports.createJotgle= ~ jotgle:", jotgle)
  
    return res.status(201).send({
      jotgle, 
      message: "Jotgle created successfully."
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({message: 'Internal Server Error.'});
  }
}

//Fetch all jotgles
exports.getJotgles = async (req,res) => {
  try {
    const JotgleModel = dynamoose.model('jotgle-table');
    const response = await JotgleModel.scan().exec();
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Internal Server Error.'});
  };
};

//Fetch a specific jotgles
exports.getAJotgle = async (req,res) => {
  try {
    const {id} = req.params;
    const JotgleModel = dynamoose.model('jotgle-table');
    const response = await JotgleModel.get(id);
    if (!response) {
      return res.status(404).send({ message: 'Jotgle not found' });
    }

    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Internal Server Error'});
  }
}

//Update a jotgle
exports.updateJotgle = async (req,res) => {
  try {
    const {
      title,
      description
    } = req.body;

    const {id} = req.params;

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
  
    const JotgleModel = dynamoose.model("jotgle-table");
  
    // Fetch the item to ensure it exists
    const existingItem = await JotgleModel.get(id);
    if (!existingItem) {
      return res.status(404).send({ message: "Jotgle not found." });
    }
  
    // Update only the fields provided
    if (title) existingItem.title = title;
    if (description) existingItem.description = description;
  
    // Save the updated item
    await existingItem.save();
  
    return res.status(200).send({
      jotgle: existingItem,
      message: "Jotgle updated successfully.",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({message: 'Internal Server Error.'});
  }
}

//Delete a specific jotgles
exports.deleteJotgle = async (req, res) => {
  try {
    const { id } = req.params; // Assuming ID is passed as a route parameter

    const JotgleModel = dynamoose.model("jotgle-table");

    // Check if the item exists
    const existingItem = await JotgleModel.get(id);
    if (!existingItem) {
      return res.status(404).send({ message: "Jotgle not found." });
    }

    // Delete the item
    await JotgleModel.delete(id);

    return res.status(200).send({
      message: "Jotgle deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};
