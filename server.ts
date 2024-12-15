import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  CUSTOM_NOTIFICATION,
  REGISTER_USER,
  SEND_NOTIFICATION_BY_EMAIL,
  SEND_NOTIFICATION_BY_USER_ID,
} from "./src/constants/socketChannel";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "famille.matheo-olsen.fr";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const userIdToSocket = new Map(); // userId -> socketId
  const emailToSocket = new Map(); // email -> socketId

  io.on("connection", (socket) => {
    // Enregistrement via `userId` et `email`
    socket.on(REGISTER_USER, ({ userId, email }) => {
      userIdToSocket.set(userId, socket.id);
      emailToSocket.set(email, socket.id);
    });

    // Gérer les notifications par `userId`
    socket.on(SEND_NOTIFICATION_BY_USER_ID, ({ userId, message }) => {
      const targetSocketId = userIdToSocket.get(userId);
      if (targetSocketId) {
        io.to(targetSocketId).emit(CUSTOM_NOTIFICATION, { userId, message });
      }
    });

    // Gérer les notifications par `email`
    socket.on(SEND_NOTIFICATION_BY_EMAIL, ({ email, message }) => {
      const targetSocketId = emailToSocket.get(email);
      if (targetSocketId) {
        io.to(targetSocketId).emit(CUSTOM_NOTIFICATION, { email, message });
      }
    });

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
      let disconnectedUserId = null;
      let disconnectedEmail = null;

      // Supprimer l'utilisateur des maps
      userIdToSocket.forEach((value, key) => {
        if (value === socket.id) {
          disconnectedUserId = key;
          userIdToSocket.delete(key);
        }
      });

      emailToSocket.forEach((value, key) => {
        if (value === socket.id) {
          disconnectedEmail = key;
          emailToSocket.delete(key);
        }
      });

      if (disconnectedUserId || disconnectedEmail) {
        console.log(
          `Utilisateur déconnecté : userId = ${disconnectedUserId}, email = ${disconnectedEmail}`,
        );
      } else {
        console.log(`Socket déconnecté : ${socket.id}`);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
