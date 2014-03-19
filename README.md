# Yun Programmer


## Install

`npm install yun-programmer`

## Usage

```js
var YunProgrammer = require('yun-programmer');

var p = new YunProgrammer({
  host : 'arduino.local',
  file : 'program.hex',
  password : 'password1'
});

p.flash(function(err,output){
  console.log(output)
});
```


