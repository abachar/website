var chai      = require('chai'),
    expect    = chai.expect,
    mongoose  = require('mongoose'),
    mockgoose = require('mockgoose');

// Mock mongoose
mockgoose(mongoose);

// Use chai-datetime
chai.use(require('chai-datetime'));

describe('Message', function () {
    var message;

    beforeEach(function (done) {
        mockgoose.reset();
        message = require("../../models/message");
        done();
    });

    it('should create message', function (done) {
        message.create({
            name: 'Test name',
            email: 'test@user.com',
            subject: 'Test subject',
            content: 'Test content'
        }, function (err, doc) {
            expect(err).to.be.null();

            expect(doc).to.have.property('_id');
            expect(doc).to.have.property('name').and.equal('Test name');
            expect(doc).to.have.property('email').and.equal('test@user.com');
            expect(doc).to.have.property('subject').and.equal('Test subject');
            expect(doc).to.have.property('content').and.equal('Test content');
            expect(doc).to.have.property('sent_at').and.equalDate(new Date());

            done();
        });
    });
});