let ready = false;

const listeners = new Set<() => void>();

/** آیا آمادگی اپ قبلاً اعلام شده است؟ */
export function isAppReady(): boolean {
  return ready;
}

/** اعلام آمادگی و اطلاع‌رسانی به مشترکین فعلی (idempotent). */
export function markAppReady(): void {
  if (ready) return;

  ready = true;

  const currentListeners = [...listeners];
  listeners.clear();

  currentListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeAppReady(listener: () => void): () => void {
  if (ready) {
    listener();
    return () => {};
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
