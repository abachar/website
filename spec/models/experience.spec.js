var chai      = require('chai'),
    expect    = chai.expect,
    mongoose  = require('mongoose'),
    mockgoose = require('mockgoose'),
    fixtures  = require('./fixtures.js');

// Mock mongoose
mockgoose(mongoose);

describe('Experience', function () {
    var experience;

    beforeEach(function (done) {
        mockgoose.reset();
        experience = require('../../models/experience');
        experience.model.create(fixtures.experiences, function() {
            done();
        });
    });

    it('should retrieve all experiences', function (done) {
        experience.findAll(function (err, experiences) {
            expect(!!err).to.be.false();
            expect(experiences).to.have.length(2);

            for (var index = 1; index <= 2; index++) {
                var experience = experiences[index - 1];

                expect(experience).to.have.property('name').and.equal('Experience ' + index);
                expect(experience).to.have.property('start').and.equalDate(new Date(2000 + index, 0, 1));
                expect(experience).to.have.property('end').and.equalDate(new Date(2000 + index, 11, 31));
                expect(experience).to.have.property('employer').and.equal('Employer ' + index);
                expect(experience).to.have.property('job').and.equal('Job ' + index);
                expect(experience).to.have.property('client').and.equal('Client ' + index);
                expect(experience).to.have.property('description').and.equal('Description ' + index);
            }
            done();
        });
    });
});