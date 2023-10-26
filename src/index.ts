// 데이터베이스 디바이스 아이디 테이블
type ga0211 = {
  co_div: string; // 업장 코드
  cour_cd: string; // 코스 코드
  hole_no: number; // 홀 번호
  PIN_LA_POSI_1: number; // 위도
  PIN_LO_POSI_1: number; // 경도
  deviceId: string; // 디바이스 아이디
};

// promise로 생성한 primise의 실행 결과
type QueryResult = {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
};

import { Request, Response } from 'express';

// 실행 환경으로 env파일 분리
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const {
  DB_HOST, // 데이터베이스 연결 호스트
  DB_PORT, // 데이터베이스 연결 포트
  DB_USER, // 데이터베이스 연결 계정
  DB_PASSWORD, // 데이터베이스 연결 비밀번호
  DB_DATABASE, // 데이터베이스
  PORT, // webhook 실행 포트
  SELECTSQL, // 디바이스 아이디와 위도경도 불러오는 쿼리
  GA0210SQL, // 위도경도 저장 쿼리
  GA0212SQL, // 전체 데이터 저장 쿼리
  ORIGIN, // 허용 도메인 ( 위치정보 서비스 도메인 )
} = process.env;

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const logger = require('./logger');

const dbConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  multipleStatements: true,
};
const pool = mysql.createPool(dbConfig); // db pool 생성

const whitelist = [ORIGIN]; // 도메인 허용
const corsOptions: typeof cors.CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? whitelist : true,
};

let keys: ga0211[] = []; // 디바이스 아이디

app.use(cors(corsOptions)); //cors 사용
app.use(bodyParser.json({ limit: 5000000 })); // request.body 읽기
app.use(bodyParser.urlencoded({ limit: 5000000, extended: true, parameterLimit: 50000 })); // 전송 크기 제한 헤제
// 서버 실행
app.listen(PORT, () => {
  // 서버 실행 시 즉시실행 함수 ( 데이터 베이스에 있는 디바이스 키 저장 )
  (async function deviceIdSelect() {
    if (keys.length === 0) {
      // 커넥션 받기
      await pool.getConnection((err: Error, connection: typeof mysql.Connection) => {
        if (err) return logger.error(err);
        // 쿼리 실행
        connection.query(SELECTSQL, (err: typeof mysql.MysqlError, result: ga0211[]) => {
          if (err) logger.error(err);
          else keys = result;
        });
        // 커넥션 반납
        connection.release();
        // 키 데이터가 없을시 함수 재 실행
        if (keys.length > 0) return logger.info('server started on');
        else deviceIdSelect();
      });
    }
  })();
});

// async promise 생성
const asyncPromise = async (sql: string, parameters: string[], key: ga0211, latitude: number, longitude: number) => {
  return new Promise((resolve, rejects) => {
    // 데이터 베이스 커넥션 받기
    pool.getConnection((connectionError: Error, connection: typeof mysql.Connection) => {
      if (connectionError) logger.error(connectionError);
      // 트렌젝션 확인
      connection.beginTransaction((transactionError: Error) => {
        if (transactionError) logger.error(transactionError);

        // 저장 하는 위치 ( ? 코스의 ? 홀 )
        const target = `${key.cour_cd} course ${key.hole_no} hole`;
        connection.query(sql, parameters, (err: typeof mysql.MysqlError, result: (QueryResult | string)[]) => {
          try {
            resolve(result); // 리턴값
            connection.commit(); // 커밋
            (key.PIN_LA_POSI_1 = latitude), (key.PIN_LO_POSI_1 = longitude);
            logger.commit(target); // 커밋 로그
          } catch {
            logger.error(target + err); // 실패 로그

            rejects(err); // 리젝
            connection.rollback(); // 데이터 베이스 롤백
          } finally {
            connection.release(); // 커넥션 반납
          }
        });
      });
    });
  });
};

// 소수점 반올림
const roundDown = (coord: number) => Number(coord.toFixed(6));

// webhook api ( 위치정보 서비스 업체에서 호출 )
app.post('/', async (req: Request, res: Response) => {
  const promise = []; // primise 배열

  if (req.body.length > 0) {
    for (let i = 0; i < req.body.length; i++) {
      const sql = GA0210SQL + GA0212SQL;
      // 받은 데이터의 디바이스 아이디 확인
      const key = keys.find(key => key.deviceId === req.body[i].deviceId);

      if (key && req.body[i].gnssInfo) {
        // 업장 코드, 코스 코드, 홀 번호
        const target = [key.co_div, key.cour_cd, key.hole_no];
        // 위도, 경도
        const { latitude, longitude } = req.body[i].gnssInfo;

        // 데이터 베이스의 위도경도와 받은 데이터의 위도경도가 다를 때 promise 생성 후 배열에 저장
        if (key.PIN_LA_POSI_1 !== roundDown(latitude) && key.PIN_LO_POSI_1 !== roundDown(longitude)) {
          const parameters = [latitude, longitude, ...target, JSON.stringify(req.body[i]), ...target];
          promise.push(await asyncPromise(sql, parameters, key, roundDown(latitude), roundDown(longitude)));
        }
      }
    }

    try {
      // 저장된 promise 사용
      await Promise.allSettled(promise);
    } catch (error) {
      logger.error(error);
    }
  }
  // webhook을 사용하는 업체에서 리턴값없이 status 200만 받음
  // status가 200이 아닐 시 webhook 호출 종료
  //  ㄴ 위치 정보 서비스 업채의 해당 골프장 페이지에서 재실행 가능
  res.sendStatus(200);
});
