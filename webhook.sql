create table ga0211
as select co_div, cour_cd, hole_no from ga0210;
alter table ga0211 add deviceId varchar(20);

insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '1', '01226274530');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '2', '01226274363');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '3', '01226275136');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '4', '01226274439');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '5', '01226274397');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '6', '01226274542');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '7', '01226274426');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '8', '01226275132');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'A', '9', '01226275171');

insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '1', '01226274396');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '2', '01226274509');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '3', '01226274367');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '4', '01226274422');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '5', '01226274527');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '6', '01226274375');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '7', '01226274365');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '8', '01226275134');
insert into ga0211 (co_div, cour_cd, hole_no, deviceId) values ('912', 'B', '9', '01226274435');


create table ga0212
as select co_div, cour_cd, hole_no from ga0210;

alter table ga0212 add timestamp DATETIME not null;
alter table ga0212 add parameters text not null;