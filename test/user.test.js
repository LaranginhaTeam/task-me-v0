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

let access_token;

describe('Test login is working', function(done){
    it('should receive a token', function(done){
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

    it('should fail with a unknown user', function(done){
        chai.request(server)
            .post('/login')
            .send({
                email: "unknownuser@teste.com",
                password: "teste"
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(403);   
                done();      
            });
    });

    it('should create user', function(done){
        chai.request(server)
            .post('/api/user')
            .send({
                email: "testelogin@teste.com",
                password: "teste123",
                name: "Testing user",
                type_user: "Funcionário",
                department: "Jardinagem",
                is_leader: false,
                access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.user).to.not.be.undefined;

                id = res.body.user._id;
                
                done();      
            });
    });


});


describe('Test user is Working', function(done){

    let id;

    it('should get user', function(done){
        chai.request(server)
            .get('/api/user')
            .query({access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.users).to.be.an('array');
                done();      
            });
    });

    it('should create users', function(done){
        chai.request(server)
            .post('/api/user')
            .send({
                email: "teste@teste.com",
                password: "teste",
                name: "Testing user",
                type_user: "Funcionário",
                department: "Jardinagem",
                is_leader: false,
                access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.user).to.not.be.undefined;                

                id = res.body.user._id;
                
                done();      
            });
    });

    it('should update users', function(done){
        chai.request(server)
            .put('/api/user')
            .send({id, name: "Testing user Atualizado", access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should delete users', function(done){
        chai.request(server)
            .delete('/api/user/'+id)
            .query({access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();
            });
    })
});

describe('Test locations is working', function(done){

    let id;

    it('should create user', function(done){
        chai.request(server)
            .post('/api/user')
            .send({
                email: "testelogin@teste.com",
                password: "teste123",
                name: "Testing user",
                type_user: "Funcionário",
                department: "Jardinagem",
                is_leader: false,
                access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.user).to.not.be.undefined;                

                id = res.body.user._id;
                
                done();      
            });
    });

    it('should add coordinate to user', function(done){
        chai.request(server)
            .post('/api/user/location/'+id)
            .send({"lat": 105.7879486,"long": 21.0307869, access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();
            });
    });

    it('should delete users', function(done){
        chai.request(server)
            .delete('/api/user/'+id)
            .query({access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();
            });
    });
    
});