docker build --rm -f Dockerfile -t news-comment .
docker run --name news-comment -l=apiRouter='/api/v1/comment' -p 3005:3004 -d --restart=always news-comment