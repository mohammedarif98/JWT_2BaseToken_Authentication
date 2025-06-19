
import chalk from 'chalk';

const getStatusColor = (status) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return chalk.gray(status);
};

const getMethodColor = (method) => {
  switch (method) {
    case 'GET': return chalk.blue(method);
    case 'POST': return chalk.green(method);
    case 'PUT': return chalk.yellow(method);
    case 'DELETE': return chalk.red(method);
    case 'PATCH': return chalk.magenta(method);
    default: return chalk.gray(method);
  }
};

const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {  
    const duration = Date.now() - start; 
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    const coloredMethod = getMethodColor(method);
    const coloredStatus = getStatusColor(statusCode);
    
    console.log(
      `${coloredMethod} ${originalUrl} ${coloredStatus} - ${duration}ms`
    );
  });
  next();
};


export default httpLogger; 