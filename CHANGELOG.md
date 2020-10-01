# Changelog

## 1.0.11
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
