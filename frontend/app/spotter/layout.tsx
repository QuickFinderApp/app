import { RouterProvider } from "@/lib/stack-router";
import SpotterError from "@/components/spotter/pages/error";
import { TabRestricter } from "@/lib/tab-restricter";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <body className={`antialiased font-sans`}>
        <TabRestricter>
          <RouterProvider
            config={{
              enableTransitions: false,
              maxStackSizeReachedBehavior: "error",
              errorFallback: SpotterError
            }}
          >
            {children}
          </RouterProvider>
        </TabRestricter>
      </body>
    </html>
  );
}
