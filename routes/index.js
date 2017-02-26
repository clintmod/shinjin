var express = require('express');
var router = express.Router();
var neo4j = require('neo4j-driver').v1;
var neo4jurl = process.env.NEO4J_ENV_DOCKERCLOUD_SERVICE_HOSTNAME || "neo4j"
var driver = neo4j.driver("bolt://" + neo4jurl, neo4j.auth.basic("neo4j", "asdf1234"));
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = driver.session();
  session
  .run( "MERGE (n {type:'counter'}) " +
		"ON CREATE SET n.count = 1 " +
		"ON MATCH SET n.count = n.count + 1 " +
		"RETURN n.count" )
  .then( function(result){
  	var count = result.records[0].get("n.count");
  	res.render('index', { title: 'Shinjin ' + count, hostname:os.hostname() });
  })
  .catch(function(error) {
  	res.render('index', {error:error})
	console.log(error);
  })
});

module.exports = router;
