const toastEventName = "app-toast";

export function showToast({ title, description, variant = "default" }) {
  window.dispatchEvent(
    new CustomEvent(toastEventName, {
      detail: { title, description, variant },
    }),
  );
}

export function subscribeToToasts(callback) {
  const handler = (event) => callback(event.detail);

  window.addEventListener(toastEventName, handler);

  return () => {
    window.removeEventListener(toastEventName, handler);
  };
}
