docker build -t hrrs-server .
docker run -d -t -p 3000:3000 hrrs-server