# Changelog

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
