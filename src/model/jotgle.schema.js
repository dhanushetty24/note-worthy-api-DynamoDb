const dynamoose = require("dynamoose");

// Define the schema for "jotgle-table"
const jotgleSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create a model for the table
exports.default = dynamoose.model('jotgle-table', jotgleSchema);
