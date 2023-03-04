'use strict';
const mongoose = require('mongoose');
const Issue = require('../models').IssueModel;
const Project = require('../models').ProjectModel;

const ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      const _id = req.query._id;
      const issue_title = req.query.issue_title;
      const issue_text = req.query.issue_text;
      const created_by = req.query.created_by;
      const assigned_to = req.query.assigned_to;
      const open = req.query.open;
      const status_text = req.query.status_text;

      Project.aggregate([
        { $match: { name: project } },
        { $unwind: '$issues' },
        _id != undefined ?
          { $match: { 'issues._id': ObjectId(_id) } } :
          { $match: {} },
        issue_title != undefined ?
          { $match: { 'issues.issue_title': issue_title } } :
          { $match: {} },
        issue_text != undefined ?
          { $match: { 'issues.issue_text': issue_text } } :
          { $match: {} },
        created_by != undefined ?
          { $match: { 'issues.created_by': created_by } } :
          { $match: {} },
        assigned_to != undefined ?
          { $match: { 'issues.assigned_to': assigned_to } } :
          { $match: {} },
        open != undefined ?
          { $match: { 'issues.open': open } } :
          { $match: {} },
        status_text != undefined ?
          { $match: { 'issues.status_text': status_text } } :
          { $match: {} }
      ]).exec(function(err, data) {
        if (!data) {
          return res.json([]);
        } else {
          let projectIssues = data.map(function(item) {
            return item.issues;
          });
          return res.json(projectIssues);
        }
      });
    })

    .post(function(req, res) {
      let project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      const newIssue = new Issue({
        issue_title: issue_title || '',
        issue_text: issue_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || '',
        assigned_to: assigned_to || '',
        open: true,
        status_text: status_text || ''
      });

      Project.findOne({ name: project }, function(err, data) {
        if (!data) {
          const newProject = new Project({ name: project });
          newProject.issues.push(newIssue);
          newProject.save(function(err, data) {
            if (err || !data) {
              res.send('Saving error occurs');
            } else {
              res.json(newIssue);
            }
          });
        } else {
          data.issues.push(newIssue);
          data.save(function(err, data) {
            if (err || !data) {
              res.send('Saving error occurs');
            } else {
              res.json(newIssue);
            }
          });
        }
      });

    })

    .put(function(req, res) {
      let project = req.params.project;

      const _id = req.body._id;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      const open = req.body.open;

      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.json({ error: 'no update field(s) sent', '_id': _id });
        return;
      }

      Project.findOne({ name: project }, function(err, data) {
        if (err || !data) {
          res.json({ error: 'could not update', '_id': _id });
        } else {
          let locatedData = data.issues.id(_id);

          if (!locatedData) {
            res.json({ error: 'could not update', '_id': _id });
            return;
          }

          locatedData.issue_title = issue_title || locatedData.issue_title;
          locatedData.issue_text = issue_text || locatedData.issue_text;
          locatedData.created_by = created_by || locatedData.created_by;
          locatedData.assigned_to = assigned_to || locatedData.assigned_to;
          locatedData.status_text = status_text || locatedData.status_text;
          locatedData.open = open;
          locatedData.updated_on = new Date();

          data.save(function(err, data) {
            if (err || !data) {
              return res.json({ error: 'could not update', '_id': _id });
            } else {
              return res.json({ result: 'successfully updated', '_id': _id });
            }
          });
        }
      });

    })

    .delete(function(req, res) {
      let project = req.params.project;

      const _id = req.body._id;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

      Project.findOne({ name: project }, function(err, data) {
        if (err || !data) {
          return res.json({ error: 'could not delete', '_id': _id });
        } else {
          const targetData = data.issues.id(_id);
          if (!targetData) {
            return res.json({ error: 'could not delete', '_id': _id });
          }

          targetData.remove();

          data.save(function(err, data) {
            if (err || !data) {
              return res.json({ error: 'could not delete', '_id': _id });
            } else {
              return res.json({ result: 'successfully deleted', '_id': _id });
            }
          });
        }
      });
    });

};
