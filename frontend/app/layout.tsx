import { Themer } from "@/lib/themer";
import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <body className="antialiased font-sans">
        <Themer>{children}</Themer>
      </body>
    </html>
  );
}
