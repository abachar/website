var chai      = require('chai'),
    expect    = chai.expect,
    mongoose  = require('mongoose'),
    mockgoose = require('mockgoose'),
    fixtures  = require('./fixtures.js');

// Mock mongoose
mockgoose(mongoose);

describe('Competence', function () {
    var competence;

    beforeEach(function (done) {
        mockgoose.reset();
        competence = require('../../models/competence');
        competence.model.create(fixtures.competences, function() {
            done();
        });
    });

    it('should retrieve all competences', function (done) {
        competence.findAll(function (err, competences) {
            expect(err).to.be.undefined();
            expect(competences).to.have.length(5);

            for (var index = 1; index <= 5; index++) {
                var competence = competences[index - 1];
                expect(competence).to.have.property('name').and.equal('Competence ' + index);
                expect(competence).to.have.property('level').and.equal('' + index);
            }

            done();
        });
    });
});