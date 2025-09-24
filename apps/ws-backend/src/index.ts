import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';

// 1. Start WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  // 2. Get the URL from the client request
  const url = request.url;
  if (!url) {
    return;
  }

  // 3. Extract token from query string (?token=...)
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  // 4. Verify JWT token
  const decoded = jwt.verify(token, JWT_SECRET);

  // 5. If decoded result is a string → invalid
  if (typeof decoded === "string") {
    ws.close();
    return;
  }

  // 6. If no token or no userId in payload → invalid
  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }

  // 7. If token is valid, allow communication
  ws.on("message", function message(data) {
    console.log("Received:", data.toString());
    ws.send("something"); // Send response back
  });
});
