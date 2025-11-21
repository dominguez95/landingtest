"use client";
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export const useOneSignal = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const init = async () => {
      OneSignal.init({
        appId: "f8b8d415-7f48-429e-a3f5-087da6babf53",
        allowLocalhostAsSecureOrigin: true, // útil para desarrollo
        notifyButton: {
          enable: false,
          prenotify: false,
          showCredit: false,
          text: {
            "tip.state.unsubscribed": "",
            "message.action.resubscribed": "",
            "dialog.main.title": "",
            "dialog.blocked.message": "",
            "dialog.blocked.title": "",
            "dialog.main.button.subscribe": "",
            "dialog.main.button.unsubscribe": "",
            "message.action.subscribed": "",
            "message.action.subscribing": "",
            "message.action.unsubscribed": "",
            "message.prenotify": "",
            "tip.state.blocked": "",
            "tip.state.subscribed": "",
          },
        },
        promptOptions: {
          /* 👇 Esta es la parte que te daba error */
          slidedown: {
            prompts: [
              {
                autoPrompt: false,
                type: "push",
                delay: { pageViews: 1, timeDelay: 20 },
                categories: [],
              },
            ],
          },
        }, // 👈 fuerza el tipo correcto y evita error de TS
      });

      // ✅ Mostrar el popup nativo automáticamente si el usuario aún no aceptó
      const permission = await OneSignal.Notifications.permissionNative;
      if (permission === "default") {
        OneSignal.Slidedown.promptPush();
      }
    };

    init().catch((err) => {
      console.error("Error initializing OneSignal:", err);
    });
  }, []);
};
