docker build --rm -f Dockerfile -t news-post .

docker run --name news-post -l=apiRouter='/api/v1/post' -p 3004:3003 -d --restart=always news-post