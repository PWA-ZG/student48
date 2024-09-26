self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
});

self.skipWaiting();

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  let data;
  if (!event.data) return;
  if (event.data.text) {
    data = JSON.parse(event.data.text());
  } else {
    data = event.data.json();
  }
  console.log(`[Service Worker] Push had this data: "${data}"`);
  let options = {
    body: data.body,
    icon: "/images/icons/icon-96x96.png",
    badge: "/images/icons/icon-96x96.png",
    data: {
      redirectUrl: data.redirectUrl,
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  let notification = event.notification;
  notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clis) {
        if (clis && clis.length > 0) {
          clis.forEach(async (client) => {
            await client.navigate(notification.data.redirectUrl);
            client.focus();
          });
        } else if (clients.openWindow) {
          return clients.openWindow(notification.data.redirectUrl);
        }
      })
  );
});

self.addEventListener("notificationclose", function (event) {
  console.log("notificationclose", event);
});
