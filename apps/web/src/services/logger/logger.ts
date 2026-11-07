const isProduction = import.meta.env.IS_PRODUCTION;

interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
}

export const logger: Logger = {
  log: (...args) => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  error: (...args) => {
    if (!isProduction) {
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },

  info: (...args) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
};
