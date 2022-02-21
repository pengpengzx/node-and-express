
const cluster = require('cluster');

function startWorker(port) {
  const worker = cluster.fork();
  console.log(`CLUSTER: Worker ${worker.id} started`);
}

if(cluster.isMaster) {
  require('os').cpus().forEach(startWorker)

  cluster.on('disconnect', worker => {
    `CLUSTER: Worker ${worker.id} disconnected`
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`CLUSTER: Worker ${worker.id} died with code ${code} and signal ${signal}`);
    startWorker();
  })
} else {
  const port = process.env.PORT || 3000;
  require('./index.js')(port);
}