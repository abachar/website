/**
 *
 */
exports.competences = [
    {name: 'Competence 1', level: 1, skills: null},
    {name: 'Competence 2', level: 2, skills: null},
    {name: 'Competence 3', level: 3, skills: null},
    {name: 'Competence 4', level: 4, skills: null},
    {name: 'Competence 5', level: 5, skills: null}
];

/**
 *
 */
exports.experiences = [
    {name: 'Experience 1', start: new Date(2001, 0, 1), end: new Date(2001, 11, 31),
        employer: 'Employer 1', job: 'Job 1', client: 'Client 1',
        description: 'Description 1'},
    {name: 'Experience 2', start: new Date(2002, 0, 1), end: new Date(2002, 11, 31),
        employer: 'Employer 2', job: 'Job 2', client: 'Client 2',
        description: 'Description 2'}
];

/**
 *
 */
exports.projects = [
    {code: 'project-1', name: "Project 1"},
    {code: 'project-2', name: "Project 2"},
    {code: 'project-3', name: "Project 3"}
];


/**
 *
 */
exports.articles = [
    {code: 'article-1', created_at: new Date(2001, 0, 1), printable: true, draft: true,
        author: 'Author 1', title: 'Title 1', description: 'Description 1',
        comments: [
            {author: 'Comment Author 11', email: 'comment-email-11@test.com',
                created_at: new Date(2001, 1, 1), content: 'Comment Content 11'},
            {author: 'Comment Author 12', email: 'comment-email-12@test.com',
                created_at: new Date(2001, 1, 2), content: 'Comment Content 12'}
        ]
    },
    {code: 'article-2', created_at: new Date(2002, 0, 1), printable: true, draft: true,
        author: 'Author 2', title: 'Title 2', description: 'Description 2',
        comments: [
            {author: 'Comment Author 21', email: 'comment-email-21@test.com',
                created_at: new Date(2002, 1, 1), content: 'Comment Content 21'},
            {author: 'Comment Author 22', email: 'comment-email-22@test.com',
                created_at: new Date(2002, 1, 2), content: 'Comment Content 22'}
        ]
    },
    {code: 'article-3', created_at: new Date(2003, 0, 1), printable: true, draft: true,
        author: 'Author 3', title: 'Title 3', description: 'Description 3',
        comments: [
            {author: 'Comment Author 31', email: 'comment-email-31@test.com',
                created_at: new Date(2003, 1, 1), content: 'Comment Content 31'},
            {author: 'Comment Author 32', email: 'comment-email-32@test.com',
                created_at: new Date(2003, 1, 2), content: 'Comment Content 32'}
        ]
    },
    {code: 'article-4', created_at: new Date(2004, 0, 1), printable: true, draft: true,
        author: 'Author 4', title: 'Title 4', description: 'Description 4',
        comments: [
            {author: 'Comment Author 41', email: 'comment-email-41@test.com',
                created_at: new Date(2004, 1, 1), content: 'Comment Content 41'},
            {author: 'Comment Author 42', email: 'comment-email-42@test.com',
                created_at: new Date(2004, 1, 2), content: 'Comment Content 42'}
        ]
    },
    {code: 'article-5', created_at: new Date(2005, 0, 1), printable: true, draft: true,
        author: 'Author 5', title: 'Title 5', description: 'Description 5',
        comments: [
            {author: 'Comment Author 51', email: 'comment-email-51@test.com',
                created_at: new Date(2005, 1, 1), content: 'Comment Content 51'},
            {author: 'Comment Author 52', email: 'comment-email-52@test.com',
                created_at: new Date(2005, 1, 2), content: 'Comment Content 52'}
        ]
    }
];