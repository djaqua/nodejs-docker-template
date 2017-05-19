
var konf = require("./konf");

console.log("Server using top level configuration file " + konf.getConfig().filename);
setInterval(function() {
    console.log("heartbeat");
}, 10000);

