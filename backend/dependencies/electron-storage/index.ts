import { app, shell } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import Ajv from "ajv";

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type SchemaForType<T> = T extends string
  ? { type: "string" }
  : T extends number
    ? { type: "number" }
    : T extends boolean
      ? { type: "boolean" }
      : T extends Array<infer U>
        ? { type: "array"; items: SchemaForType<U> }
        : T extends object
          ? {
              type: "object";
              properties?: { [K in keyof T]?: SchemaForType<T[K]> };
              additionalProperties?: boolean;
            }
          : { type: "any" };

interface StoreOptions<T extends JsonObject> {
  defaults: T;
  schema: SchemaForType<T>;
  migrations?: Record<string, () => void>;
  beforeEachMigration?: (context: MigrationContext) => void;
  name?: string;
  cwd?: string;
  encryptionKey?: string | Buffer | Uint8Array | DataView;
  fileExtension?: string;
  clearInvalidConfig?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  accessPropertiesByDotNotation?: boolean;
  watch?: boolean;
}

interface MigrationContext {
  fromVersion: string;
  toVersion: string;
  finalVersion: string;
  versions: string[];
}

class Store<T extends JsonObject> {
  private data: T;
  private options: Required<StoreOptions<T>>;
  private filePath: string;
  private validator: Ajv;

  constructor(options: StoreOptions<T>) {
    this.options = {
      defaults: options.defaults,
      schema: options.schema,
      migrations: {},
      beforeEachMigration: (): void => {},
      name: "config",
      cwd: app.getPath("userData"),
      encryptionKey: Buffer.alloc(0),
      fileExtension: "json",
      clearInvalidConfig: false,
      serialize: (value: T): string => JSON.stringify(value, null, "\t"),
      deserialize: JSON.parse,
      accessPropertiesByDotNotation: true,
      watch: false,
      ...options
    };

    this.filePath = path.join(this.options.cwd, `${this.options.name}.${this.options.fileExtension}`);
    this.validator = new Ajv();

    this.validator.compile(this.options.schema);

    this.data = this.read();

    if (this.options.watch) {
      fs.watch(this.filePath, () => {
        this.data = this.read();
      });
    }
  }

  private validateData(data: T): boolean {
    const validate = this.validator.compile(this.options.schema);
    return validate(data);
  }

  private read(): T {
    try {
      let data = fs.readFileSync(this.filePath, "utf8");

      if (this.hasEncryption()) {
        const decipher = crypto.createDecipheriv("aes-256-cbc", this.getEncryptionKey(), Buffer.alloc(16, 0));
        data = decipher.update(data, "hex", "utf8") + decipher.final("utf8");
      }

      const parsedData = this.options.deserialize(data);
      if (typeof parsedData == "object" && this.options.defaults) {
        for (const [key, defaultValue] of Object.entries(this.options.defaults)) {
          if (parsedData[key] === undefined) {
            (parsedData as any)[key] = defaultValue;
          }
        }
      }

      if (this.validateData(parsedData)) {
        return parsedData;
      } else if (this.options.clearInvalidConfig) {
        if (this.options.defaults) {
          return this.options.defaults;
        }
        return {} as T;
      } else {
        throw new Error("Invalid config data");
      }
    } catch (error) {
      if (error instanceof SyntaxError && this.options.clearInvalidConfig) {
        return {} as T;
      }
      return this.options.defaults;
    }
  }

  private write(data: T): void {
    if (!this.validateData(data)) {
      throw new Error("Invalid data. Does not match schema.");
    }

    let serializedData = this.options.serialize(data);

    if (this.hasEncryption()) {
      const cipher = crypto.createCipheriv("aes-256-cbc", this.getEncryptionKey(), Buffer.alloc(16, 0));
      serializedData = cipher.update(serializedData, "utf8", "hex") + cipher.final("hex");
    }

    fs.writeFileSync(this.filePath, serializedData);
  }

  private hasEncryption(): boolean {
    const key = this.options.encryptionKey;
    return (
      (typeof key === "string" && key.length > 0) ||
      (Buffer.isBuffer(key) && key.length > 0) ||
      (key instanceof Uint8Array && key.byteLength > 0) ||
      (key instanceof DataView && key.byteLength > 0)
    );
  }

  private getEncryptionKey(): Buffer {
    const key = this.options.encryptionKey;
    if (typeof key === "string") {
      return Buffer.from(key);
    }
    if (Buffer.isBuffer(key)) {
      return key;
    }
    if (key instanceof Uint8Array || key instanceof DataView) {
      return Buffer.from(key.buffer, key.byteOffset, key.byteLength);
    }
    throw new Error("Invalid encryption key");
  }

  set<K extends keyof T>(key: K, value: T[K]): void;
  set(object: Partial<T>): void;
  set<K extends keyof T>(keyOrObject: K | Partial<T>, value?: T[K]): void {
    if (typeof keyOrObject === "object") {
      Object.keys(keyOrObject).forEach((key) => {
        const typedKey = key as keyof T;
        if (typedKey in keyOrObject) {
          this.setProperty(typedKey, keyOrObject[typedKey] as T[keyof T]);
        }
      });
    } else {
      if (value !== undefined) {
        this.setProperty(keyOrObject, value);
      }
    }
    if (!this.validateData(this.data)) {
      throw new Error("Invalid data. Does not match schema.");
    }
    this.write(this.data);
  }

  private setProperty<K extends keyof T>(key: K, value: T[K]): void {
    if (this.options.accessPropertiesByDotNotation && typeof key === "string") {
      const keys = key.split(".");
      let current: unknown = this.data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current !== "object" || current === null) {
          current = {};
        }
        if (!(keys[i] in (current as object))) {
          (current as Record<string, unknown>)[keys[i]] = {};
        }
        current = (current as Record<string, unknown>)[keys[i]];
      }
      if (typeof current === "object" && current !== null) {
        (current as Record<string, unknown>)[keys[keys.length - 1]] = value;
      }
    } else {
      this.data[key] = value;
    }
  }

  get<K extends keyof T>(key: K): T[K] | undefined;
  get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
  get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K] | undefined {
    if (this.options.accessPropertiesByDotNotation && typeof key === "string") {
      const keys = key.split(".");
      let current: unknown = this.data;
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = (current as Record<string, unknown>)[k];
        } else {
          return defaultValue;
        }
      }
      return current as T[K];
    }
    return key in this.data ? this.data[key] : defaultValue;
  }

  has(key: keyof T): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: keyof T): void {
    if (this.options.accessPropertiesByDotNotation && typeof key === "string") {
      const keys = key.split(".");
      let current: unknown = this.data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(typeof current === "object" && current !== null && keys[i] in current)) {
          return;
        }
        current = (current as Record<string, unknown>)[keys[i]];
      }
      if (typeof current === "object" && current !== null) {
        delete (current as Record<string, unknown>)[keys[keys.length - 1]];
      }
    } else {
      delete this.data[key];
    }
    this.write(this.data);
  }

  clear(): void {
    this.data = {} as T;
    this.write(this.data);
  }

  onDidChange<K extends keyof T>(
    key: K,
    callback: (newValue: T[K] | undefined, oldValue: T[K] | undefined) => void
  ): () => void {
    if (!this.options.watch) {
      throw new Error("The watch option is not enabled.");
    }

    const listener = (): void => {
      const oldValue = this.get(key);
      const newValue = this.read()[key];
      if (oldValue !== newValue) {
        callback(newValue, oldValue);
      }
    };

    const watcher = fs.watch(this.filePath, listener);
    return (): void => watcher.close();
  }

  onDidAnyChange(callback: (newValue: T, oldValue: T) => void): () => void {
    if (!this.options.watch) {
      throw new Error("The watch option is not enabled.");
    }

    const listener = (): void => {
      const oldValue = { ...this.data };
      const newValue = this.read();
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        callback(newValue, oldValue);
      }
    };

    const watcher = fs.watch(this.filePath, listener);
    return (): void => watcher.close();
  }

  get size(): number {
    return Object.keys(this.data).length;
  }

  get store(): T {
    return this.data;
  }

  set store(value: T) {
    this.data = value;
    this.write(this.data);
  }

  get path(): string {
    return this.filePath;
  }

  async openInEditor(): Promise<void> {
    const error = await shell.openPath(this.path);

    if (error) {
      throw new Error(error);
    }
  }

  static initRenderer(): void {
    console.error("The renderer initialization is not implemented.");
  }
}

export default Store;
