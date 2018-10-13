let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');

describe('Test if login is working', function(done){
    it('should get a token', function(done){
        chai.request(server)
            .post('api/login')
            .end(function(err, res){                
                expect(res.body.code).to.eql(201);

                valid_token = res.body.token;
                done();
            });
    });
});


describe('Test Task is Working', function(done){

    let id_no_image;
    let id_with_image;

    it('should get Task', function(done){
        chai.request(server)
            .get('api/task')
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.tasks).to.be.an('array');
                done();      
            });
    });

    it('should create a Task without image', function(done){
        chai.request(server)
            .post('api/task')
            .send({
            	token: valid_token,
            	description: "Sem imagem.",
            	department: "Jardinagem",
            	priority: "Baixa"                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                

                id_no_image = res.body.task._id;  
                done();      
            });
    });

    it('should create a Task with image', function(done){
        chai.request(server)
            .post('api/task')
            .send({
            	token: valid_token,
                description: "Esta árvore está com fungo.",                
            	department: "Jardinagem",
            	priority: "Baixa"                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.message).to.eql("success");                

                id_with_image = res.body.task._id;  
                done();      
            });
    });

    it('should receive a task without image', function(done){
        chai.request(server)
            .get('api/task/'+id_no_image)
            .send({
            	token: valid_token                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                
                done();      
            });
    });    

    it('should accept a task', function(done){
        chai.request(server)
            .post('api/task/accept/'+id_no_image
            .send({
            	token: valid_token                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.message).to.eql("success");                
                done();      
            }));
    });

    it('should finalize a task', function(done){
        chai.request(server)
            .put('api/task/'+id)
            .send({
            	token: valid_token,
                commentary: "Finalizei, mas ainda está sujo."                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);             
                done();      
            });
    });

    it('should receive a task with image', function(done){
        chai.request(server)
            .get('api/task/'+id_with_image)
            .send({
            	token: valid_token                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                
                done();      
            });
    });    

    it('should refuse a task', function(done){
        chai.request(server)
            .post('api/task/refuse/'+id_with_image)
            .send({
            	token: valid_token                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.message).to.eql("success");                
                done();      
            });
    });
});