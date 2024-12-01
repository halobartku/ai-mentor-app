import cluster from 'cluster';
import os from 'os';
import { logger } from '../utils/logger';

export class LoadBalancer {
  private numCPUs: number;

  constructor() {
    // Use 75% of available CPUs
    this.numCPUs = Math.ceil(os.cpus().length * 0.75);
  }

  setupWorkers() {
    if (cluster.isPrimary) {
      logger.info(`Master process ${process.pid} is running`);

      // Fork workers
      for (let i = 0; i < this.numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
        // Replace the dead worker
        cluster.fork();
      });

      // Monitor worker health
      this.monitorWorkers();

      return false; // Master doesn't run the app
    }

    logger.info(`Worker ${process.pid} started`);
    return true; // Worker runs the app
  }

  private monitorWorkers() {
    setInterval(() => {
      const workers = Object.values(cluster.workers || {});
      
      workers.forEach(worker => {
        if (!worker) return;

        worker.send('health_check');
        
        const timeout = setTimeout(() => {
          logger.error(`Worker ${worker.process.pid} is unresponsive, killing it...`);
          worker.kill();
        }, 5000);

        worker.once('message', (msg) => {
          if (msg === 'health_ok') {
            clearTimeout(timeout);
          }
        });
      });
    }, 30000); // Check every 30 seconds
  }
}