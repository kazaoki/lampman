
Example commands
================

run without `lamp`
----------------

On project directory.

### up

    docker-compose -f .lampman/docker-compose.yml -f .lampman/docker-compose.override.yml up -d

same `lamp up`.

### down

    docker-compose -f .lampman/docker-compose.yml -f .lampman/docker-compose.override.yml down

same `lamp down`

`lamp` commands samples
-----------------------
### make merged yml file

Path from project directory.

    lamp yml > docker-compose.yml
