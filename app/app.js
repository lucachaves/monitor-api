var exec = require('child_process').exec;
var app = require('express')();
var bodyParser = require('body-parser');
var bodyParserJsonError = require('express-body-parser-json-error');
var cors = require('cors');
var port = process.env.PORT || 5000;
var routes = ['cpustatus', 'memory', 'overview', 'cpuname'].sort();
var url = 'http://localhost:'+port+'/v1';

var successful = function(req, res, json){
  res.status(200).json(json);
}
var unsuccessful = function(req, res){
  res.status(500).json({error: "Internal server error"});
}

app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(bodyParserJsonError());
app.use(cors());

app.get('/v1', function (req, res) {
  let json = routes.map( route => `${url}/${route}`)
  successful(req, res, json);
});

app.get('/v1/cpustatus', function (req, res) {
  topCommand(req, res, 'cpu', successful, unsuccessful);
});

app.get('/v1/cpuname', function (req, res) {
  cpuNameCommand(req, res, successful, unsuccessful);
});

app.get('/v1/memory', function (req, res) {
  topCommand(req, res, 'memory', successful, unsuccessful);
});

app.get('/v1/overview', function (req, res) {
  overviewCommand(req, res, successful, unsuccessful);
});

app.get('*', function(req, res){
  res.status(404).send({error: 'Sorry, endpoind not found'});
});

app.listen(port, function () {
  console.log(`monitor api: \n\n${url}\n\t\t/${routes.join('\n\t\t/')}\n\n`);
});

function topCommand(req, res, info, successful, unsuccessful){
  let command = 'top -l 1';
  console.log(command);
  exec(command, function(error, stdout, stderr) {
    if(error !== null){
      unsuccessful(req, res);
    } else {
      let json = parseTopCommand(stdout, info);
      if(json)
        successful(req, res, json);
      else
        unsuccessful(req, res);
    }
  });
}

function parseTopCommand(topResult, info){
  let regex, matched;
  if(info === 'cpu'){
    regex = /Load Avg: (.+), (.+), (.+)\n/;
    matched = regex.exec(topResult);
    let last1 = matched[1];
    let last10 = matched[2];
    let last15 = matched[3];

    regex = /CPU usage: (.+)% user, (.+)% sys, (.+)% idle/;
    matched = regex.exec(topResult);
    let cpuUsageUser = matched[1];
    let cpuUsageSys = matched[2];
    let cpuUsageIdle = matched[3];
    return {
      cpuLast: {last1, last10, last15},
      cpuUsage: {cpuUsageUser, cpuUsageSys, cpuUsageIdle}
    };
  }
  if(info === 'memory'){
    regex = /PhysMem: (.+)M used \((.+)M wired\), (.+)M unused./;
    matched = regex.exec(topResult);
    let memoryUsageUsed = matched[1];
    let memoryUsageUnused = matched[3];
    return { memoryUsageUsed, memoryUsageUnused };
  }
}

function overviewCommand(req, res, successful, unsuccessful){
  let command = 'system_profiler SPSoftwareDataType';
  console.log(command);
  exec(command, function(error, stdout, stderr) {
    if(error !== null){
      unsuccessful(req, res);
    } else {
      let json = parseOverviewCommand(stdout);
      if(json)
        successful(req, res, json);
      else
        unsuccessful(req, res);
    }
  });
}

function parseOverviewCommand(overviewResult){
  let regex, matched;

  regex = /System Version: (.+)\(/;
  matched = regex.exec(overviewResult);
  let operatingSystem = matched[1];

  regex = /Computer Name: (.+)\n/;
  matched = regex.exec(overviewResult);
  let hostname = matched[1];

  regex = /User Name:.+\((.+)\)/;
  matched = regex.exec(overviewResult);
  let username = matched[1];

  regex = /Time since boot: (.+)\n/;
  matched = regex.exec(overviewResult);
  let uptime = matched[1];

  return { operatingSystem, hostname, username, uptime };
}

function cpuNameCommand(req, res, successful, unsuccessful){
  let command = 'sysctl -n machdep.cpu.brand_string';
  console.log(command);
  exec(command, function(error, stdout, stderr) {
    if(error !== null){
      unsuccessful(req, res);
    } else {
      let json = { cpu: stdout };
      if(json)
        successful(req, res, json);
      else
        unsuccessful(req, res);
    }
  });
}
