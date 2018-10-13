const server = require("./config/server.js");
const mongoose = require("./config/database.js");

server.get("/", (req, res) => {
    res.json({
        running: true
    })
})

let router = server.router();


//JSON_WEB_TOKEN
router.use(function(req, res, next){
    
});


require("./user/user.routes.js")(router);
require("./task/task.routes.js")(router);
require("./department/department.routes.js")(router);

module.exports = router;
