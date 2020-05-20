# Dockerfile-db

FROM mysql:5.6

# Copy database initialisation scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY database.sql /db/
ENV MYSQL_ROOT_PASSWORD=root
