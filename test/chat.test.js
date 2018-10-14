let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');

let access_token;

describe('Test server working', function(done){
    it('should get a token', function(done){
        chai.request(server)
            .post('/login')
            .send({
                email: "vinijabes@gmail.com",
                password: "jabinho"
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.token).to.be.a('string');   

                access_token = res.body.token;
                done();
            });
    });
});


describe('Test chat message is Working', function(done){

    it('should send a message', function(done){
        chai.request(server)
            .post('/api/chat')
            .send({
                access_token,
                leader: "5bc1fbc8270ca7508a0911ea",
                worker: "ID_RECEIVER",
                sender: "5bc1fbc8270ca7508a0911ea",
                receiver: "ID_RECEIVER",
                message: "Hello world"
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should send a second message', function(done){
        chai.request(server)
            .post('/api/chat')
            .send({
                access_token,
                leader: "5bc1fbc8270ca7508a0911ea",
                worker: "ID_RECEIVER",
                sender: "5bc1fbc8270ca7508a0911ea",
                receiver: "ID_RECEIVER",
                message: "Second message"
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should send a message with other sender', function(done){
        chai.request(server)
            .post('/api/chat')
            .send({
                access_token,
                leader: "5bc1fbc8270ca7508a0911ea",
                worker: "ID_RECEIVER",
                sender: "ID_RECEIVER",
                receiver: "5bc1fbc8270ca7508a0911ea",
                message: "My id is ID_RECEIVER"
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should get messages', function(done){
        chai.request(server)
            .get('/api/chat')
            .send({
                access_token,
                leader: "5bc1fbc8270ca7508a0911ea",
                worker: "ID_RECEIVER"
            })
            .end(function(err, res){
                console.log(res.body.messages);
                expect(res.body.code).to.eql(200);
                expect(res.body.messages).to.be.an('array');
                done();      
            });
    });
    
});

