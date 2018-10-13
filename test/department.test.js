let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');

describe('Test department is Working', function(done){

    let id;

    it('should get department', function(done){
        chai.request(server)
            .get('/department')
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
                leader: 1
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
            .send({id, name: "Testing department updated"})
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();      
            });
    });

    it('should delete departments', function(done){
        chai.request(server)
            .delete('/department/'+id)
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                done();
            });
    })
});