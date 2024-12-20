export const logger = {
  info: (message: string) => console.log([INFO] ),
  error: (message: string) => console.error([ERROR] ),
  warn: (message: string) => console.warn([WARN] ),
  debug: (message: string) => console.debug([DEBUG] )
};
