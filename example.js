var YunProgrammer = require('./index');

var p = new YunProgrammer({
  host : 'arduino.local',
  file : 'program.hex',
  password : 'password1'
});

p.flash(function(err,output){
  console.log(output)
});
