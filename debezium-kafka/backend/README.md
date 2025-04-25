# backend

```sh
npm i
docker build -t backend .
docker run -d --network kafka -p 5001:5001 --name backend --restart=always backend
```

```sh
node insert-bids.js
```
