var chai      = require('chai'),
    expect    = chai.expect,
    mongoose  = require('mongoose'),
    mockgoose = require('mockgoose'),
    fixtures  = require('./fixtures.js');

// Mock mongoose
mockgoose(mongoose);

describe('Article', function () {
    var article;

    beforeEach(function (done) {
        mockgoose.reset();
        article = require('../../models/article');
        article.model.create(fixtures.articles, function() {
            done();
        });
    });

    it('should retrieve all articles ordered by created_at desc', function (done) {
        article.findAll(function (err, articles) {
            expect(err).to.be.null();
            expectOrdered(articles, 5, 5);
            done();
        });
    });


    it('should retrieve last three articles ordered by created_at desc', function (done) {
        article.findLastThree(function (err, articles) {
            expect(err).to.be.null();
            expectOrdered(articles, 3, 5);
            done();
        });
    });

    it('should retrieve article by code', function (done) {
        article.findByCode('article-1', function (err, article) {
            expect(err).to.be.null();
            expectArticle(article, 1);

            // expect comments
            expect(article).to.have.property('comments').and.to.have.length(2);
            for (var index = 1; index <= 2; index++) {
                var comment = article.comments[index - 1];

                expect(comment).to.have.property('author').and.equal('Comment Author 1' + index);
                expect(comment).to.have.property('email').and.equal('comment-email-1' + index + '@test.com');
                expect(comment).to.have.property('created_at').and.equalDate(new Date(2001, 1, index));
                expect(comment).to.have.property('content').and.equal('Comment Content 1' + index);
            }

            done();
        });
    });

    it('should save comment article', function (done) {
        article.pushComment('article-1', {
            author: 'Comment Author 13',
            email: 'comment-email-13@test.com',
            created_at: new Date(2001, 1, 3),
            content: 'Comment Content 13'
        }, function (err) {
            expect(err).to.be.null();

            article.findByCode('article-1', function (err, article) {
                expect(err).to.be.null();
                expect(article).to.have.property('comments').and.to.have.length(3);

                var comment = article.comments[2];
                expect(comment).to.have.property('author').and.equal('Comment Author 13');
                expect(comment).to.have.property('email').and.equal('comment-email-13@test.com');
                expect(comment).to.have.property('created_at').and.equalDate(new Date(2001, 1, 3));
                expect(comment).to.have.property('content').and.equal('Comment Content 13');
            });

            done();
        });
    });

    function expectOrdered(articles, selected, total) {
        expect(articles).to.have.length(selected);

        for (var index = 0; index < selected; index++, total--) {
            var article = articles[index];

            expectArticle(article, total);
        }
    }

    function expectArticle(article, index) {
        expect(article).to.have.property('code').and.equal('article-' + index);
        expect(article).to.have.property('created_at').and.equalDate(new Date(2000 + index, 0, 1));
        expect(article).to.have.property('printable').and.equal(true);
        expect(article).to.have.property('draft').and.equal(true);
        expect(article).to.have.property('author').and.equal('Author ' + index);
        expect(article).to.have.property('title').and.equal('Title ' + index);
        expect(article).to.have.property('description').and.equal('Description ' + index);
    }
});