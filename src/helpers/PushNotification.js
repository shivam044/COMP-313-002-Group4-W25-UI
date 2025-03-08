import axiosInstance from "../api/axiosInstance";

const publicVapidKey =
  "BGUjqRdIyVFsVfZA6vGmHWSVksy9Wc5c70jtWep-W2TXdW9SGznYuA8RqErHnFEwSDC2evlXGII_Qir-L3sW-Zc";

export const registerPushNotifications = async (reminderTime, message) => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register(
        "/serviceWorker.js"
      );

      // Wait for the service worker to be activated
      if (registration.installing) {
        const serviceWorker = registration.installing || registration.waiting;

        await new Promise((resolve) => {
          if (serviceWorker.state === "activated") {
            resolve();
          } else {
            serviceWorker.addEventListener("statechange", (e) => {
              if (e.target.state === "activated") {
                resolve();
              }
            });
          }
        });
      }

      // Now subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      const requestData = {
        subscription: subscription,
        reminderTime: reminderTime,
        message: message,
      };

      // Send the subscription to the server
      await axiosInstance.post("/subscribe", requestData);
      console.log("Subscription successful!");
      return true;
    } catch (error) {
      console.error("Error registering service worker or subscribing", error);
      return false;
    }
  } else {
    console.error("Push notifications not supported");
    return false;
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
