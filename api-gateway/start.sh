docker build --rm -f Dockerfile -t news-api-gateway .
docker run --name news-api-gateway -v /var/run/docker.sock:/var/run/docker.sock -l=apiRouter='/api/v1/apigateway' -p 3000:3000 -d --restart=always news-api-gateway
