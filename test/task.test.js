let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');

// describe('Test if login is working', function(done){
//     it('should get a token', function(done){
//         chai.request(server)
//             .post('api/login')
//             .end(function(err, res){                
//                 expect(res.body.code).to.eql(201);

//                 valid_token = res.body.token;
//                 done();
//             });
//     });
// });

let access_token;

/**/

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


describe('Test Task is Working', function(done){

    let id_no_image;
    let id_with_image;
    let valid_token = "";
    it('should get Task', function(done){
        chai.request(server)
            .get('/api/task')
            .query({access_token})
            .end(function(err, res){                
                expect(res.body.code).to.eql(200);
                expect(res.body.tasks).to.be.an('array');
                done();      
            });
    });    

    it('should create a Task without image', function(done){
        chai.request(server)
            .post('/api/task')
            .send({
            	access_token,
            	description: "Sem imagem.",
            	department: "Jardinagem",
                priority: 0,
                lat: '105.7879486',
                long: '21.0307869'                        
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
            .post('/api/task')
            .send({
            	access_token,
                description: "Esta árvore está com fungo.",                
            	department: "Jardinagem",
            	priority: 0                          
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                

                id_with_image = res.body.task._id;  
                done();      
            });
    });

    it('should receive a task without image', function(done){
        chai.request(server)
            .get('/api/task/'+id_no_image)
            .send({
            	access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                
                done();      
            });
    });    

    it('should accept a task', function(done){
        chai.request(server)
            .post('/api/task/accept/'+id_no_image)
            .send({
            	access_token                         
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                
                done();      
            });
    });

    it('should finalize a task', function(done){
        chai.request(server)
            .post('/api/task/finalize/' + id_no_image)
            .send({
                access_token,
                commentary: "Finalizei, mas ainda está sujo."                           
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);             
                done();      
            });
    });

    it('should receive a task with image', function(done){
        chai.request(server)
            .get('/api/task/'+id_with_image)
            .send({
            	access_token                          
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);
                expect(res.body.task).to.not.be.undefined;                
                done();
            });
    });    

    it('should refuse a task', function(done){
        chai.request(server)
            .post('/api/task/refuse/'+id_with_image)
            .send({
            	access_token
            })
            .end(function(err, res){
                expect(res.body.code).to.eql(200);

                done();      
            });
    });
});