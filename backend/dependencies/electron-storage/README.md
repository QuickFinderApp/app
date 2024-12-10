# Electron Storage

A TypeScript module for simple data persistence in Electron applications.

## Installation

```bash
npm install electron-storage
```

## Usage

```typescript
import Store from "electron-storage";

interface MyConfig {
  setting1: string;
  setting2: number;
  nestedSetting: {
    subSetting: boolean;
  };
}

const store = new Store<MyConfig>({
  name: "my-app-config",
  defaults: {
    setting1: "default",
    setting2: 0,
    nestedSetting: {
      subSetting: false
    }
  },
  schema: {
    type: "object",
    properties: {
      setting1: { type: "string" },
      setting2: { type: "number" },
      nestedSetting: {
        type: "object",
        properties: {
          subSetting: { type: "boolean" }
        }
      }
    }
  }
});

// Use the store
store.set("setting1", "new value");
console.log(store.get("setting1")); // 'new value'
```

## API

### `Store<T>`

The main class for managing persistent data.

#### Constructor

```typescript
new Store<T>(options?: StoreOptions<T>)
```

Creates a new Store instance.

##### Options

- `defaults`: Default values for the store items.
- `schema`: JSON Schema to validate your config data.
- `name`: Name of the storage file (default: 'config').
- `cwd`: Storage file location (default: app.getPath('userData')).
- `encryptionKey`: Key for encrypting the storage file.
- `fileExtension`: Extension of the config file (default: 'json').
- `clearInvalidConfig`: Clear config if it's invalid (default: false).
- `serialize`: Function to serialize the config object (default: JSON.stringify).
- `deserialize`: Function to deserialize the config object (default: JSON.parse).
- `accessPropertiesByDotNotation`: Allow accessing nested properties using dot notation (default: true).
- `watch`: Watch for changes in the config file (default: false).

#### Methods

##### `set(key: keyof T, value: T[keyof T]): void`

##### `set(object: Partial<T>): void`

Set a value or multiple values in the store. Throws an error if the resulting data doesn't match the schema.

```typescript
store.set("setting1", "new value");
store.set({ setting1: "new value", setting2: 42 });
```

##### `get<K extends keyof T>(key: K): T[K] | undefined`

##### `get<K extends keyof T>(key: K, defaultValue: T[K]): T[K]`

Get a value from the store.

```typescript
const value = store.get("setting1");
const valueWithDefault = store.get("setting2", 0);
```

##### `has(key: keyof T): boolean`

Check if a key exists in the store.

```typescript
if (store.has("setting1")) {
  // Do something
}
```

##### `delete(key: keyof T): void`

Delete a key from the store.

```typescript
store.delete("setting1");
```

##### `clear(): void`

Clear all data from the store.

```typescript
store.clear();
```

##### `onDidChange<K extends keyof T>(key: K, callback: (newValue: T[K] | undefined, oldValue: T[K] | undefined) => void): () => void`

Watch for changes to a specific key.

```typescript
const unsubscribe = store.onDidChange("setting1", (newValue, oldValue) => {
  console.log(`setting1 changed from ${oldValue} to ${newValue}`);
});

// Later, to stop watching:
unsubscribe();
```

##### `onDidAnyChange(callback: (newValue: T, oldValue: T) => void): () => void`

Watch for any changes in the store.

```typescript
const unsubscribe = store.onDidAnyChange((newValue, oldValue) => {
  console.log("Store changed", { oldValue, newValue });
});

// Later, to stop watching:
unsubscribe();
```

#### Properties

##### `size: number`

Get the number of items in the store.

```typescript
console.log(store.size);
```

##### `store: T`

Get or set the entire store data.

```typescript
const allData = store.store;
store.store = { setting1: "new value", setting2: 42 };
```

##### `path: string`

Get the path to the storage file.

```typescript
console.log(store.path);
```

### Static Methods

##### `Store.initRenderer(): void`

Initialize the store for use in the renderer process. Call this in the main process before using the store in a renderer process.

```typescript
Store.initRenderer();
```

## Notes

- The `openInEditor()` method is not implemented in the current version.
- Schema validation is performed using [ajv](https://ajv.js.org/). Make sure to provide a valid JSON Schema in the `schema` option.
- Encryption uses AES-256-CBC. Ensure you keep your encryption key secure.
- When using dot notation to access nested properties, be cautious with keys that contain dots.

## License

[MIT License](LICENSE)
