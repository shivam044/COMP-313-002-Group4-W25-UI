self.addEventListener("push", (event) => {
  let data;

  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: "New Reminder",
      body: "You have a new reminder!",
    };
  }

  console.log("Push received:", data);

  const options = {
    body: data.body || "You have a new reminder!"
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Reminder", options)
  );
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim()); // Claim the clients to control them immediately
});
