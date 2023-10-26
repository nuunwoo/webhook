# LG U+ 위치정보 서비스 Webhook API

## 시작

```bash
yarn install
yarn tsc
yarn start or ./run.bat
```

## 서버 주소
- developmenet http://serverip:800 
- production http://골프장IP:80


## 골프장 변경

1. .env.production 데이터베이스 접속정보 변경

## DB CREATE TABLE
1. webhook.sql -> insert에서 deviceId 변경

## .env.*
- PORT : 변경시 서버 포트 변경
- SELECTSQL : 서버 시작시 핀위치, 디바이스아이디 검색
- GA0210SQL : 핀위치 변경 시 해당 홀 좌표 데이터 및 변경시간 업데이트
- GA0212SQL : 핀위치 변경 시 해당 홀 전체 데이터 및 변경시간 업데이트
- ORIGIN : cors witelist
    - LG U+ 위치정보 서비스 아이피 변경 시 변경
    - development는 변경 불 필요
