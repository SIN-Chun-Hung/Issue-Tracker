const mongoose = require('mongoose');
const { Schema } = mongoose; 

const SchemaOfIssue = new Schema({
  issue_title : {type: String, required: true}, 
  issue_text: {type: String, required: true}, 
  created_on: Date, 
  updated_on: Date, 
  created_by: {type: String, required: true}, 
  assigned_to: String, 
  open: Boolean, 
  status_text: String
});
const SchemaOfProject = new Schema({
  name: {type: String, required: true}, 
  issues: [SchemaOfIssue]
});

const IssueModel = mongoose.model('IssueModel', SchemaOfIssue); 
const ProjectModel = mongoose.model('ProjectModel', SchemaOfProject); 

exports.IssueModel = IssueModel; 
exports.ProjectModel = ProjectModel; 

