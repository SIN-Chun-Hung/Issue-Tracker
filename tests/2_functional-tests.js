const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let idSaver;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  after(function() {
    chai.request(server).get('/api')
  });

  suite('Routing Tests', function() {

    suite('Post request tests', function() {
      test('Create an issue with every field: POST request to', function(done) {
        chai.request(server).post('/api/issues/testprojects')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'FccIssue',
            issue_text: 'functional test fcc',
            created_by: 'simon',
            assigned_to: 'myname',
            status_text: 'abc'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'FccIssue');
            assert.equal(res.body.issue_text, 'functional test fcc');
            assert.equal(res.body.created_by, 'simon');
            assert.equal(res.body.assigned_to, 'myname');
            assert.equal(res.body.status_text, 'abc');
            idSaver = res.body._id;
            done();
          });
      });

      test('Create an issue with only required fields: POST request to', function(done) {
        chai.request(server).post('/api/issues/testprojects')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'FccIssue',
            issue_text: 'functional test fcc',
            created_by: 'simon',
            assigned_to: '',
            status_text: ''
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'FccIssue');
            assert.equal(res.body.issue_text, 'functional test fcc');
            assert.equal(res.body.created_by, 'simon');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            done();
          });
      });

      test('Create an issue with missing required fields: POST request to', function(done) {
        chai.request(server).post('/api/issues/testprojects')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'FccIssue',
            issue_text: '',
            created_by: '',
            assigned_to: '',
            status_text: 'abc'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      });

    });

    suite('Get request tests', function() {
      test('View issues on a project: GET request to', function(done) {
        chai.request(server).get('/api/issues/specialfcctest')
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.length, 1); 
          done();  
        });
      });

      test('View issues on a project with one filter: GET request to',function(done) {
        chai.request(server).get('/api/issues/testprojects')
        .query({
          _id: '63f8d9ec797bd9287d37d2d3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.deepEqual(res.body[0], {issue_title: "FccIssue", issue_text:"functional test fcc", created_on:"2023-02-24T15:38:20.179Z", updated_on:"2023-02-24T15:38:20.179Z", created_by:"simon", assigned_to:"", open: true, status_text:"", _id: "63f8d9ec797bd9287d37d2d3"});
          done();
        });
      });

      test('View issues on a project with multiple filters: GET request to',function(done) {
        chai.request(server).get('/api/issues/testprojects')
        .query({
          _id: '63f8d9ec797bd9287d37d2d3',
          issue_title: 'FccIssue',
          issue_text: 'functional test fcc'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.deepEqual(res.body[0], {issue_title: "FccIssue", issue_text:"functional test fcc", created_on:"2023-02-24T15:38:20.179Z", updated_on:"2023-02-24T15:38:20.179Z", created_by:"simon", assigned_to:"", open: true, status_text:"", _id: "63f8d9ec797bd9287d37d2d3"});
          done();
        });
      });
      
    });

    suite('Put request tests', function() {

      test('Update one field on an issue: PUT request to',function(done) {
        chai.request(server).put('/api/issues/testprojects')
        .send({
          _id: '63f787cc1b1bb3be588a176d',
          issue_title: 'abcde' 
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '63f787cc1b1bb3be588a176d');
          done();
        });
      });

      test('Update multiple fields on an issue: PUT request to',function(done) {
        chai.request(server).put('/api/issues/testprojects')
        .send({
          _id: '63f8d14dd50dbdccd4d93ed2',
          issue_title: 'abcde',
          issue_text: 'update gogogo'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '63f8d14dd50dbdccd4d93ed2');
          done();
        });
      });
      
      test('Update an issue with missing _id: PUT request to',function(done) {
        chai.request(server).put('/api/issues/testprojects')
        .send({
          issue_title: 'abcde', 
          issue_text: 'abcde is interesting'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.error, 'missing _id');
          done();
        });
      });

      test('Update an issue with no fields to update: PUT request to',function(done) {
        chai.request(server).put('/api/issues/testprojects')
        .send({
          _id: '63f78763a3050db91f2bb040'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
      });

      test('Update an issue with an invalid _id: PUT request to',function(done) {
        chai.request(server).put('/api/issues/testprojects')
        .send({
          _id: 'rjhijer487t847857843ufhdhfhd',
          issue_title: 'myname', 
          issue_text: 'mynameee'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.error, 'could not update');
          done();
        });
      }); 
    });

    suite('Delete request tests', function() {
      test('Delete an issue: DELETE request to', function(done) {
        chai.request(server).delete('/api/issues/testprojects')
        .send({_id: idSaver})
        .end(function (err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
      });

      test('Delete an issue with an invalid _id: DELETE request to', function(done) {
        chai.request(server).delete('/api/issues/testprojects')
        .send({_id: 'omgjuhduhewsidhud22221111'})
        .end(function (err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.error, 'could not delete');
          done();
        });
      });

      test('Delete an issue with missing _id: DELETE request to', function(done) {
        chai.request(server).delete('/api/issues/testprojects')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body.error, 'missing _id');
          done();
        });
      });
    });

  });
});
