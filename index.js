var extend = require('extend')
  , scp = require('scp')
  , Connection = require('ssh2')
  , pipeworks = require('pipeworks');

var YunProgrammer = module.exports = function(opts){
  this.opts = {
    file : null,
    host : null,
    user : 'root',
    port : '22',
    password : null
  };
  extend(this.opts,opts);
};

YunProgrammer.prototype.flash = function(cb){
  if(!this.opts.file)
    throw new Error('File not specified.');

  if(!this.opts.host)
    throw new Error('Host name not specified.');

  var program = pipeworks()
    .fit(this._upload.bind(this))
    .fit(this._merge.bind(this))
    .fit(this._program.bind(this))
    .fit(function(ctx,next){
      return cb(null,ctx.log.split('\n'));
    });

  program.fault(function(context, error) {
    return cb(error);
  });

  program.flow(this.opts);

};


YunProgrammer.prototype._upload = function(ctx,cb){
  ctx.path = '~/.tmp-sketch.hex';
  scp.send(ctx, function (err) {
    if (err)
      throw new Error(err);
    cb(ctx);
  });
};

YunProgrammer.prototype._merge = function(ctx,cb){
  ctx.log = '';
  var c = new Connection();
  c.on('ready', function() {
    c.exec('merge-sketch-with-bootloader.lua '+ ctx.path, function(err, stream) {
      if (err) throw err;
      stream.on('data', function(data, extended) {
	ctx.log += data;
      });
      stream.on('exit', function(code, signal) {
	c.end();
	if(code !== 0)
	  throw new Error('Merge process did not exit with code 0');
	cb(ctx);
      });
    });
  });

  c.on('error', function(err) {
    throw new err;
  });

  c.connect({
    host: ctx.host,
    port: ctx.port,
    username: ctx.user,
    password : ctx.password
  });
};

YunProgrammer.prototype._program = function(ctx,cb){
  var c = new Connection();
  c.on('ready', function() {
    c.exec('run-avrdude '+ ctx.path, function(err, stream) {
      if (err) throw err;
      stream.on('data', function(data, extended) {
	ctx.log += data;
      });
      stream.on('exit', function(code, signal) {
	c.end();
	if(code !== 0)
	  throw new Error('Merge process did not exit with code 0');
	cb(ctx);
      });
    });
  });

  c.on('error', function(err) {
    throw new err;
  });

  c.connect({
    host: ctx.host,
    port: ctx.port,
    username: ctx.user,
    password : ctx.password
  });
};

