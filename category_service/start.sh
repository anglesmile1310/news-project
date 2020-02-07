docker build --rm -f Dockerfile -t news-category .
docker run --name news-category -l=apiRouter='/api/v1/category' -p 3003:3002 -d --restart=always news-category