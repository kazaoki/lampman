
run without Lampman
====================

## up

    docker-compose -f .lampman/docker-compose.out.yml -f .lampman/docker-compose.override.yml up -d

same `lamp up`

## down

    docker-compose -f .lampman/docker-compose.out.yml -f .lampman/docker-compose.override.yml down

same `lamp down`
