var request = require("request");

var base_url = "http://localhost:5000/"

describe("Ping API Server", function() {
  describe("GET /v1/", function() {
    it("returns status code 200", function(done) {
      request.get(base_url+'/v1/', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
});
