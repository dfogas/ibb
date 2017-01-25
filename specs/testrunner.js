const exec = require('child_process').execSync

console.log(exec('mocha specs/track.spec.js', {}).toString('utf8'))

console.log(exec('mocha specs/count.spec.js', {}).toString('utf8'))

console.log(exec('mocha specs/checkcountparam.spec.js', {}).toString('utf8'))
