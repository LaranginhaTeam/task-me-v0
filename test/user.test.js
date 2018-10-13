let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');

describe('Test server working', function(done){
    it('should get a server message', function(done){
        chai.request(server)
            .get('/')
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                done();
            });
    });
});


describe('Test user is Working', function(done){

    let id;

    it('should get user', function(done){
        chai.request(server)
            .get('/user')
            .end(function(err, res){
                expect(res.body.success).to.eql(true);
                expect(res.body.users).to.be.an('array');
                done();      
            });
    });

    it('should create users', function(done){
        chai.request(server)
            .post('/user')
            .send({
                email: "teste@teste.com",
                password: "teste",
                name: "Testing user",
                type_user: "Funcionário",
                department: "Jardinagem",
                is_leader: false
            })
            .end(function(err, res){
                expect(res.body.success).to.eql(true);
                expect(res.body.user).to.not.be.undefined;                

                id = res.body.user._id;
                
                done();      
            });
    });

    it('should update users', function(done){
        chai.request(server)
            .put('/user')
            .send({id, name: "Testing user Atualizado"})
            .end(function(err, res){
                expect(res.body.success).to.eql(true);
                done();      
            });
    });

    it('should delete users', function(done){
        chai.request(server)
            .delete('/user')
            .send({id})
            .end(function(err, res){
                expect(res.body.success).to.eql(true);
                done();
            });
    })
});