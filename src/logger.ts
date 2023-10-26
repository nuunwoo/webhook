const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

// 로그 폴더 명
const logDir = 'logs';
const { combine, timestamp, printf } = winston.format;

// 로그 포멧팅
const logFormat = printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`);

// 로그 레벨
const levels = {
  error: 0,
  debug: 1,
  warn: 2,
  info: 3,
  data: 4,
  verbose: 5,
  silly: 6,
  commit: 7,
};

// 로그 생성
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // 날짜 형식
    }),
    logFormat // 로그 형식
  ),
  levels: levels, // 레벨
  level: 'error', // 최고 레벨
  transports: [
    new winstonDaily({
      level: 'commit', // 최소 레벨
      datePattern: 'YYYY-MM-DD', // 날짜 형식
      dirname: logDir, // 로그 폴더
      filename: `%DATE%.log`, // 파일명 ( 현재 날짜 )
      maxFiles: 30, // 최대 파일 수
      zippedArchive: true, // 날짜 변경시 압축
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),

    // commit 레벨 색상 추가
    new winston.transports.Console({ level: 'commit', colorize: true }),
  ],
});

module.exports = logger;
