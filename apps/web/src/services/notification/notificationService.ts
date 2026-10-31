import toast from "react-hot-toast";

export const notificationService = {
  success(message: string) {
    toast.success(message);
  },

  error(message: string) {
    toast.error(message);
  },

  loading(message: string) {
    return toast.loading(message);
  },

  info(message: string) {
    toast(message);
  },

  dismiss(toastId?: string) {
    toast.dismiss(toastId);
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) {
    return toast.promise(promise, messages);
  },
};
