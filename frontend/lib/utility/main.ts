const mainGlobalExists = (): boolean => {
  return typeof main !== "undefined";
};

export async function getVersion() {
  if (!mainGlobalExists()) {
    return Promise.resolve("Unknown Version");
  }
  return main.getVersion();
}
