import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouterProvider } from "@/lib/stack-router";
import SpotterError from "@/components/spotter/pages/error";
import { TabRestricter } from "@/lib/tab-restricter";
import { Themer } from "@/lib/themer";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <body className={`antialiased font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Themer>
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
          </Themer>
        </ThemeProvider>
      </body>
    </html>
  );
}
