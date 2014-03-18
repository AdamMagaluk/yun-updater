var Connection = require('ssh2');

var c = new Connection();
c.on('ready', function() {
  console.log('Connection :: ready');
  c.exec('run-avrdude  ~/elroy-sketch.hex', function(err, stream) {
    if (err) throw err;
    stream.on('data', function(data, extended) {
      process.stdout.write(data);
    });
    stream.on('end', function() {
      console.log('Stream :: EOF');
    });
    stream.on('close', function() {
      console.log('Stream :: close');
    });
    stream.on('exit', function(code, signal) {
      console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
      c.end();
    });
  });
});
c.on('error', function(err) {
  console.log('Connection :: error :: ' + err);
});
c.on('end', function() {
  console.log('Connection :: end');
});
c.on('close', function(had_error) {
  console.log('Connection :: close');
});
c.connect({
  host: '192.168.1.22',
  port: 22,
  username: 'root',
  privateKey: require('fs').readFileSync('/Users/ApigeeCorporation/.ssh/id_rsa')
});
