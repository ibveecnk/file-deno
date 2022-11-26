# file-deno 🦖
A lightweight and fast fileserver written in Typescript using the Deno Interpreter.

## Notice: Only works on HTTP, __HTTPS not supported natively__
To get the server to run properly, I recommend using NGINX with a custom server config
```nginx
server {
  location / {
    proxy_pass http://localhost:3000;
  }
  server_name example.example.com;
}
```

## Running the server
The server requires the permission flags for `net` and `read`, it can be run from shell using:
```shell
deno run --allow-net --allow-read main.ts
```