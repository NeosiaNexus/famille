import {
  SEND_NOTIFICATION_BY_EMAIL,
  SEND_NOTIFICATION_BY_USER_ID,
} from "@/constants/socketChannel";
import { socket } from "@/socket";

export const sendNotificationByUserId = (userId: string, message: string) => {
  socket.emit(SEND_NOTIFICATION_BY_USER_ID, {
    userId,
    message,
  });
};

export const sendNotificationByEmail = (email: string, message: string) => {
  socket.emit(SEND_NOTIFICATION_BY_EMAIL, {
    email,
    message,
  });
};
