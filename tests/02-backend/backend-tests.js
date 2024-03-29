import db from '../../server/models';
const User = db.model('user');
const Message = db.model('message');
import app from '../../server/app';

import fsMisc from 'fs-misc';
import chai from 'chai';
import chaiProperties from 'chai-properties';
import chaiThings from 'chai-things';
chai.use(chaiProperties);
chai.use(chaiThings);
const expect = chai.expect;
import supertest from 'supertest';
import sinon from 'sinon';

describe('▒▒▒ Backend tests ▒▒▒', () => {

    beforeEach('Synchronize and clear database', () => db.sync({force: true}));

    after('Synchronize and clear database', () => db.sync({force: true}));

    describe('Sequelize models', function () {

        describe('User Model', () => {

            // *Assertion translation*:
            // This assertion expects that the User model will
            // put an `email` column in the users table.
            it('has the expected schema definition', () => {
                expect(User.attributes.email).to.be.an('object');
            });

            describe('validations', () => {

                // *Assertion translation*:
                // The `email` column should be a required field.
                it('require email', async () => {
                    const user = User.build();
                    try {
                        await user.validate()
                        throw new Error('Promise should have rejected')
                    } catch (err) {
                        /* handle error */
                        expect(err).to.exist;
                        expect(err).to.be.an('error');
                        expect(err.errors).to.contain.a.thing.with.properties({
                            path: 'email',
                            type: 'notNull Violation'
                        });
                    }
                });

            });

        });

        describe('Message Model', () => {

            describe('definition', () => {

                // *Assertion translation*:
                // This assertion expects that the Message model will
                // put a `subject` column in the messages table.
                it('has expected subject definition', () => {
                    expect(Message.attributes.subject).to.be.an('object');
                });

                // *Assertion translation*:
                // This assertion expects that the Message model will
                // put an `body` column in the messages table.
                it('has expected body definition', () => {
                    expect(Message.attributes.body).to.be.an('object');
                });

            });

            describe('validations', () => {

                it('defaults subject to "No Subject"', () => {
                    // .build creates an instance of a model
                    // without saving the represented data to the database.
                    const message = Message.build();
                    expect(message.subject).to.be.equal('No Subject');
                });

                it('requires a body', async () => {
                    const message = Message.build();
                    try {
                        await message.validate()
                        throw new Error('Promise should have rejected')
                    }
                    catch (err) {
                        expect(err).to.exist;
                        expect(err).to.be.an('error');
                        expect(err.errors).to.contain.a.thing.with.properties({
                            path: 'body',
                            type: 'notNull Violation'
                        });
                    }
                });

            });

            describe('functionality', () => {

                let annaId;
                let elsaId;
                beforeEach('Seed users', async () => {
                    const users = [
                        {email: 'anna@gmail.com'},
                        {email: 'elsa@gmail.com'}
                    ];
                    const createdUsers = await User.bulkCreate(users, {returning: true})
                    annaId = createdUsers[0].id;
                    elsaId = createdUsers[1].id;
                });

                let annaFirstMessage;
                let elsaFirstMessage;
                let annaSecondMessage;
                beforeEach('Seed messages', async () => {

                    const messages = [
                        {
                            toId: elsaId,
                            fromId: annaId,
                            subject: 'Hey Elsa!',
                            body: 'Do you wanna build a snowman?'
                        },
                        {
                            toId: annaId,
                            fromId: elsaId,
                            subject: 'Re: Hey Elsa!',
                            body: 'Go away, Anna.'
                        },
                        {
                            toId: elsaId,
                            fromId: annaId,
                            subject: 'Re: Re: Hey Elsa!',
                            body: 'Okay, bye…'
                        }
                    ];

                    const createdMessages = await Message.bulkCreate(messages, {returning: true})
                    annaFirstMessage = createdMessages[0].id;
                    elsaFirstMessage = createdMessages[1].id;
                    annaSecondMessage = createdMessages[2].id;

                });

                describe('class methods', () => {

                    // Be sure to read the large comment in server/models/index.js
                    // before attempting the following assertions.
                    describe('getAllWhereSender', () => {

                        it('exists', () => {
                            expect(Message.getAllWhereSender).to.be.a('function');
                        });

                        it('returns a promise', () => {
                            expect(Message.getAllWhereSender(annaId).then).to.be.a('function');
                        });

                        it('resolves to all the messages sent by Anna', async () => {
                            const messages = await Message.getAllWhereSender(annaId)
                            expect(messages.length).to.be.equal(2);
                            expect(messages).to.contain.a.thing.with.property('id', annaFirstMessage);
                            expect(messages).to.contain.a.thing.with.property('id', annaSecondMessage);
                        });

                        it('resolves to all the messages sent by Elsa', async () => {
                            const messages = await Message.getAllWhereSender(elsaId)
                            expect(messages.length).to.be.equal(1);
                            expect(messages[0].id).to.be.equal(elsaFirstMessage);
                        });


                        it('EAGERLY LOADS the full information of both the sender and receiver', async () => {

                            // http://sequelize.readthedocs.io/en/v3/docs/models-usage/#eager-loading
                            // Don't forget about the aliases explained in server/models/index.js!

                            const messages = await Message.getAllWhereSender(elsaId)
                            const theMessage = messages[0];

                            // Expect the first of the found messages to have `to` and `from` properties that are objects.
                            expect(theMessage.to).to.be.an('object');
                            expect(theMessage.from).to.be.an('object');

                            // Expect the email properties of those objects to match up to the
                            // associated users who sent/received the message.
                            expect(theMessage.to.email).to.be.equal('anna@gmail.com');
                            expect(theMessage.from.email).to.be.equal('elsa@gmail.com');
                        });

                    });

                });

                describe('instance methods', () => {

                    describe('truncateSubject', () => {

                        let testMessage;
                        beforeEach(() => {
                            testMessage = Message.build({
                                from: annaId,
                                to: elsaId,
                                subject: `I don't know if I'm elated or gassy`,
                                body: `But I'm somewhere in that zone`
                            });
                        });

                        it('exists', () => {
                            expect(testMessage.truncateSubject).to.be.a('function');
                        });

                        it('returns the full message object but with a limited subject text based on a passed in number to determine its length', () => {
                            // Here we are expecting that the *return value* of .truncateSubject()
                            // is *full instance object of message* with its .subject property altered.
                            const messageWithTruncatedSubject = testMessage.truncateSubject(12);
                            expect(messageWithTruncatedSubject).to.be.an('object');
                            expect(messageWithTruncatedSubject.body).to.be.equal(`But I'm somewhere in that zone`);
                            expect(messageWithTruncatedSubject.subject).to.be.equal(`I don't know`);
                        });

                        it('adds an ellipses (...) after the truncated text if true is passed as the second argument', () => {
                            expect(testMessage.truncateSubject(4, true).subject).to.be.equal('I do...');
                        });

                    });

                });

            });

        });

    });

    describe('HTTP Server', () => {

        let agent;
        beforeEach('Set up agent for testing', () => {
            agent = supertest(app);
        });

        describe('api routes', () => {

            let obama;
            let biden;
            beforeEach('Seed users', async () => {
                const users = [
                    {email: 'obama@gmail.com'},
                    {email: 'biden@gmail.com'}
                ];
                const createdUsers = await User.bulkCreate(users, {returning: true})
                obama = createdUsers[0].id;
                biden = createdUsers[1].id;
            });

            let obamaFirstMessage;
            let bidenFirstMessage;
            let obamaSecondMessage;
            beforeEach('Seed messages', async () => {

                const messages = [
                    {
                        toId: biden,
                        fromId: obama,
                        body: 'HEYOOOOOOO'
                    },
                    {
                        toId: obama,
                        fromId: biden,
                        body: 'WAAASSUUUUPP??'
                    },
                    {
                        toId: biden,
                        fromId: obama,
                        body: 'nmu?'
                    }
                ];

                const createdMessages = await Message.bulkCreate(messages, {returning: true})
                obamaFirstMessage = createdMessages[0].id;
                bidenFirstMessage = createdMessages[1].id;
                obamaSecondMessage = createdMessages[2].id;

            });

            describe('users', () => {

                it('serves up all users on request to GET /', async () => {
                    const res = await agent.get('/users').expect(200)
                    expect(res.status).to.be.equal(200)
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.equal(2);
                    expect(res.body).to.contain.a.thing.with('id', obama);
                    expect(res.body).to.contain.a.thing.with('id', biden);
                });

                it('updates a user at PUT /{{usersId}}, sending a 201 response', async () => {
                    const res = await agent
                        .put(`/users/${obama}`)
                        .send({
                            email: 'potus@hotmail.com'
                        })
                        .expect(201);

                    const user = await User.findById(obama);
                    expect(user.email).to.be.equal('potus@hotmail.com');
              });

            });

            describe('messages', () => {

                // find all messages whose `to` field matches the variable ID

                it('serves up all messages to a specific user on GET /to/{{recipientId}}', async () => {
                    const res = await agent
                        .get(`/messages/to/${obama}`)
                        .expect(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.equal(1);
                    expect(res.body[0].body).to.be.equal('WAAASSUUUUPP??');
                });

                // find all messages whose `from` field matches the variable ID

                it('serves up all messages from a specific sender on GET /from/{{senderId}}', async () => {
                    const res = await agent
                        .get(`/messages/from/${obama}`)
                        .expect(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.equal(2);
                    expect(res.body).to.contain.a.thing.with.property('body', 'HEYOOOOOOO');
                    expect(res.body).to.contain.a.thing.with.property('body', 'nmu?');
                });

                // remember eager loading?

                it('serves up all messages—WITH FILLED IN REFERENCES—to a specific user on GET /to/{{recipientId}}', async () => {
                    const res = await agent
                        .get(`/messages/to/${obama}`)
                        .expect(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.equal(1);
                    expect(res.body[0].from.email).to.be.equal('biden@gmail.com');
                    expect(res.body[0].to.email).to.be.equal('obama@gmail.com');
                });

                it(`serves up all messages from a specific sender on GET /from/{{senderId}}
                    and uses the Message model static getAllWhereSender in the process`, async () => {

                    // http://sinonjs.org/docs/#spies
                    const getAllWhereSenderSpy = sinon.spy(Message, 'getAllWhereSender');

                    const res = await agent
                        .get(`/messages/from/${obama}`)
                        .expect(200);

                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.equal(2);

                    expect(getAllWhereSenderSpy.called).to.be.equal(true);
                    expect(getAllWhereSenderSpy.calledWith(obama.toString())).to.be.equal(true);

                    getAllWhereSenderSpy.restore();

                });

                it('adds a new message on POST /, responding with 201 and created message', async () => {

                    const res = await agent
                        .post('/messages')
                        .send({
                            fromId: biden,
                            toId: obama,
                            body: 'You are my best friend. I hope you know that.'
                        })
                        .expect(201);
                    const createdMessage = res.body;
                    const foundMessage = await Message.findById(createdMessage.id)
                    expect(foundMessage.body).to.be.equal('You are my best friend. I hope you know that.');

              });

            });

        });

    });

});
