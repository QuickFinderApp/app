import { app } from "electron";

export const IS_PACKAGED = app.isPackaged;
export const IS_DEV_MODE = !IS_PACKAGED;
