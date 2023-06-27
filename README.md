# Minecraft-Token API
This server handles all token generation for the minecraft server with the firebase admin sdk.

## Generate a token
To generate a token for the minecraft server, you need to send a GET request to the server. The server is available at http://localhost:9007/minecraft-token

The request should be send to the endpoint `/generate`

It should return a statusCode 200 with the idtoken in the body. It's also possible for it to return a statusCode 500 if something went wrong (likely an auth-server error). In that case, take a look at the logs in the admin panel.