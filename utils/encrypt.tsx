import CryptoJS from "crypto-js";
import { useCallback } from "react";
import "react-native-get-random-values";

const ENCRYPTION_KEY = "bytesBox_secret";

export function useMessageEncryption() {
  const encryptMessage = useCallback((message: string): string => {
    console.log("-----messages", message);
    try {
      if (!message || message.trim() === "") return message;
      const encryptedData = CryptoJS.AES.encrypt(
        message,
        ENCRYPTION_KEY
      ).toString();

      console.log("this is encryptedData", encryptedData);

      return encryptedData;
    } catch (error) {
      console.error("Encryption error:", error);
      return message;
    }
  }, []);

  const decryptMessage = useCallback((encryptedMessage: string): string => {
    try {
      if (!encryptedMessage || encryptedMessage.trim() === "")
        return encryptedMessage;
      if (!encryptedMessage.includes("U2FsdGVkX1")) return encryptedMessage;

      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedMessage,
        ENCRYPTION_KEY
      );
      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decrypted || encryptedMessage;
    } catch (error) {
      console.error("Decryption error:", error);
      return encryptedMessage;
    }
  }, []);

  const isEncrypted = useCallback((message: string): boolean => {
    try {
      return Boolean(message && message.includes("U2FsdGVkX1"));
    } catch {
      return false;
    }
  }, []);

  const generateKey = useCallback((): string => {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }, []);

  // 🔥 New helpers for media (URI encryption)
  const encryptMediaUri = useCallback(
    (uri: string): string => {
      return encryptMessage(uri);
    },
    [encryptMessage]
  );

  const decryptMediaUri = useCallback(
    (encryptedUri: string): string => {
      return decryptMessage(encryptedUri);
    },
    [decryptMessage]
  );

  return {
    encryptMessage,
    decryptMessage,
    encryptMediaUri,
    decryptMediaUri,
    isEncrypted,
    generateKey,
  };
}
