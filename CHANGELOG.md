# Changelog

## 1.0.19
2020-10-26
- Fixed a case where a container with the same name without the project name was connected to another DB when accessing the domain specified by `hosts` in the DB setting when it was on the same network.

## 1.0.18
2020-10-24
- Fix init sh file.

## 1.0.17
2020-10-24
- Fixed the part when the container was started because the behavior was strange on Linux. **Please overwrite new docker-entrypoint.sh.**

## 1.0.16
2020-10-23
- Fixed an issue where output stopped when `lamp up` was performed on Linux.
- Fixed so that the setting contents are displayed when `lm config` is executed on the linux command.

## 1.0.15
2020-10-22
- Changed the lock volume from one that starts with `locked_` to one that contains` locked` as a word.

## 1.0.14
2020-10-19
- debug postfix load
- Add `kazaoki/lampman:useperl` image

## 1.0.13
2020-10-14
- Update Document

## 1.0.11 - 1.0.12
2020-10-01

- Fixed an issue where the new version of Docker couldn't `lamp up` successfully.

## 1.0.10
2020-06-22

- Add 'AddDefaultCharset Off' to entrypoint-add.sh

## 1.0.9
2020-05-30

- Show toast notice on ports conflict at `lamp up`

## 1.0.8-d
2020-05-29

- Remove shortcut command  
    `lu` removed  
    `lg` removed

## 1.0.8
2020-05-29

- Add shortcut command  
    `lu` added ... As `lamp up`  
    `lg` added ... As `lamp logs`  

- Changed init option  
    `lamp init -s` removed ... Option selection to appear as default.  
    `lamp init -f` added ... Skip option selection.

- Add sample command for entrypoint-add.sh  
    `AddDefaultCharset`

## 1.0.7
2020-05-29

- Changed initial value for config.js  
    xdebug_host `192.168.0.10` -> `host.docker.internal`

## 1.0.6
2020-03-12

- Improved the behavior of `up` command options  
    `lamp down` ... Down without using docker-compose.

## 1.0.5
2020-03-11

- Improved the behavior of `up` command options  
    `lamp up` ... The container of the port that conflicts can be detected and processed.  
    `lamp up -c` ... Terminate and start containers of conflicting ports  
    `lamp up -f` ... Start after `lamp sweep -f`  
    `lamp up -r` ... Start after deleting the volume  

- Deprecaterd options  
    `lamp up -v` ... Consider using `lamp up -r` instead.

- Update documentation


## 1.0.4

## 1.0.3

## 1.0.2

## 1.0.1
2019-12-12

### Enhanced

- Improved the behavior of `up` command options
    - before  
    `lamp up` ... Not clear resources, then up.  
    `lamp up -f` ... Clear containers and unlocked volumes, then up.  
    - after  
    `lamp up` ... Not clear resources, then up.  
    `lamp up -f` ... Clear containers volumes, then up.  
    `lamp up -fv` ... Clear containers and unlocked volumes, then up.  

## 1.0.0
2019-12-05
