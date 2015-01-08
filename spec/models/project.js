var chai      = require('chai'),
    expect    = chai.expect,
    mongoose  = require('mongoose'),
    mockgoose = require('mockgoose'),
    fixtures  = require('./fixtures.js');

// Mock mongoose
mockgoose(mongoose);

describe('Project', function () {
    var project;

    beforeEach(function (done) {
        mockgoose.reset();
        project = require('../../models/project');
        project.model.create(fixtures.projects, function() {
            done();
        });
    });

    it('should retrieve all projects', function (done) {
        project.findAll(function (err, projects) {
            expect(err).to.be.undefined();
            expect(projects).to.have.length(3);

            expect(projects[0]).to.have.property('code').and.equal('project-1');
            expect(projects[1]).to.have.property('code').and.equal('project-2');
            expect(projects[2]).to.have.property('code').and.equal('project-3');
            done();
        });
    });

    it('should retrieve last tow projects', function (done) {
        project.findLastTwo(function (err, projects) {
            expect(err).to.be.null();
            expect(projects).to.have.length(2);

            expect(projects[0]).to.have.property('code').and.equal('project-1');
            expect(projects[1]).to.have.property('code').and.equal('project-2');
            done();
        });
    });
});