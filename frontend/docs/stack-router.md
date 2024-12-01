# Stack Router Documentation

A lightweight, type-safe stack-based router for React applications. This router manages navigation as a stack of pages, similar to mobile navigation patterns.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
  - [RouterProvider](#routerprovider)
  - [useRouter](#userouter)
  - [useNavigationGuard](#usenavigationguard)
- [Types](#types)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Installation

Copy the `stack-router.tsx` file into your project's components directory.

```tsx
import { RouterProvider, useRouter, useNavigationGuard } from "./stack-router";
```

## Basic Usage

### Setting up the Router

Wrap your application or a section of your application with the `RouterProvider`:

```tsx
function App() {
  return (
    <RouterProvider>
      <HomePage />
    </RouterProvider>
  );
}
```

### Basic Navigation

```tsx
function HomePage() {
  const router = useRouter();

  return (
    <button onClick={() => router.push(<DetailPage />)}>Go to Detail</button>
  );
}
```

## API Reference

### RouterProvider

The main component that provides routing functionality to its children.

#### Props

```typescript
type RouterConfig = {
  enableTransitions?: boolean; // Enable transition animations
  defaultTransition?: string; // Custom transition class
  maxStackSize?: number; // Maximum number of pages in stack
  onStackChange?: (stack: PageConfig[]) => void; // Stack change callback
};

type RouterProviderProps = {
  children: React.ReactNode;
  config?: RouterConfig;
};
```

#### Example

```tsx
<RouterProvider
  config={{
    enableTransitions: true,
    maxStackSize: 20,
    onStackChange: (stack) => console.log("Stack changed:", stack)
  }}
>
  <HomePage />
</RouterProvider>
```

### useRouter

A hook that provides access to router functionality.

#### Returns

```typescript
{
  push: (page: PageConfig | React.ReactNode) => void;  // Add page to stack
  pop: () => void;                                     // Remove top page
  popToRoot: () => void;                              // Return to first page
  replace: (page: PageConfig | React.ReactNode) => void;  // Replace current page
  popTo: (key: string) => void;                       // Pop to specific page
  canPop: boolean;                                    // Whether pop is possible
  stack: PageConfig[];                                // Current stack
  currentPage: PageConfig | null;                     // Current page
}
```

#### Example

```tsx
function NavigationExample() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push(<DetailPage />)}>Push Page</button>
      <button onClick={() => router.pop()} disabled={!router.canPop}>
        Go Back
      </button>
    </div>
  );
}
```

### useNavigationGuard

A hook that provides navigation protection with confirmation dialogs.

#### Parameters

```typescript
function useNavigationGuard(shouldBlock: () => boolean);
```

#### Example

```tsx
function FormPage() {
  const [isDirty, setIsDirty] = useState(false);
  const router = useNavigationGuard(() => isDirty);

  return (
    <div>
      <input onChange={() => setIsDirty(true)} />
      <button onClick={() => router.pop()}>
        Go Back (will prompt if form is dirty)
      </button>
    </div>
  );
}
```

## Types

### PageConfig

```typescript
type PageConfig = {
  key: string; // Unique identifier for the page
  component: React.ReactNode; // The page component to render
  props?: Record<string, unknown>; // Optional props
  meta?: Record<string, unknown>; // Optional metadata
};
```

## Examples

### Basic Navigation

```tsx
function BasicExample() {
  const router = useRouter();

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => router.push(<DetailPage />)}>View Details</button>
    </div>
  );
}
```

### Advanced Navigation with PageConfig

```tsx
function AdvancedExample() {
  const router = useRouter();

  const navigateToDetail = () => {
    router.push({
      key: `detail-${Date.now()}`,
      component: <DetailPage />,
      props: { id: 123 },
      meta: {
        title: "Product Detail",
        lastVisited: new Date()
      }
    });
  };

  return <button onClick={navigateToDetail}>View Product Details</button>;
}
```

### Form Protection

```tsx
function ProtectedFormExample() {
  const [formData, setFormData] = useState("");
  const isDirty = formData !== "";

  const router = useNavigationGuard(() => isDirty);

  return (
    <div>
      <input
        value={formData}
        onChange={(e) => setFormData(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={() => router.pop()}>
        Go Back (will prompt if form has data)
      </button>
    </div>
  );
}
```

## Best Practices

1. **Page Keys**: When using PageConfig, provide meaningful keys to help with navigation and debugging:

   ```tsx
   router.push({
     key: `product-${productId}`,
     component: <ProductPage id={productId} />
   });
   ```

2. **Stack Size**: Monitor your stack size and use `maxStackSize` config to prevent memory issues:

   ```tsx
   <RouterProvider config={{ maxStackSize: 20 }}>
   ```

3. **Navigation Guards**: Use navigation guards for forms or when unsaved changes exist:

   ```tsx
   const router = useNavigationGuard(() => formHasUnsavedChanges);
   ```

4. **Transitions**: Enable transitions for smoother navigation experience:

   ```tsx
   <RouterProvider config={{ enableTransitions: true }}>
   ```

5. **Stack Monitoring**: Use onStackChange to monitor navigation patterns:
   ```tsx
   <RouterProvider
     config={{
       onStackChange: (stack) => {
         analytics.logNavigation(stack[stack.length - 1].key);
       }
     }}
   >
   ```

This router is designed to be simple yet flexible, providing a solid foundation for building navigation in React applications. It's particularly well-suited for wizard-like flows, multi-step forms, or any interface where maintaining a navigation stack is important.
