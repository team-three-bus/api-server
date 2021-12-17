import { configure, getLogger, Logger } from 'log4js';
import { format } from 'date-fns';

const today: string = format(new Date(), 'yyyy-MM-dd');
const logFile = 'logs/' + today + '.log';
const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

const logger4js: Logger = getLogger();
logger4js.level = logLevel;

configure({
  appenders: { cheese: { type: 'file', filename: logFile } },
  categories: { default: { appenders: ['cheese'], level: logLevel } },
});

const logger = logger4js;

export default logger;
