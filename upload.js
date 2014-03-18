var scp = require('scp');

var options = {
  file: '/var/folders/mv/k7rks8y52hvb6n8rsz_j0_jc0000gp/T/build1161697239451166885.tmp/Bridge.cpp.hex',
  user: 'root',
  host: 'arduino.local',
  port: '22',
  path: '~/elroy-sketch.hex'
}

scp.send(options, function (err) {
  if (err) console.log(err);
  else console.log('File transferred.');
});
