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

describe('Test department is Working', function(done){

    let id;

    it('should get department', function(done){
        chai.request(server)
            .get('/department')
            .query({access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.departments).to.be.an('array');
                done();      
            });
    });

    it('should create departments', function(done){
        chai.request(server)
            .post('/department')
            .send({
                name: "Jardinagem",
                leader: 1,
                access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.department).to.not.be.undefined;                

                id = res.body.department._id;
                
                done();      
            });
    });

    it('should update departments', function(done){
        chai.request(server)
            .put('/department')
            .send({id, name: "Testing department updated", access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should delete departments', function(done){
        chai.request(server)
            .delete('/department/'+id)
            .query({access_token})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();
            });
    })
});