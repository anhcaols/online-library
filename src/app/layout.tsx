import "./global.css";
import {ReactNode} from "react";
import ThemeProvider from "@/components/providers/ThemeProvider";
import {AntdRegistry} from "@ant-design/nextjs-registry";

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
    <body>
    <AntdRegistry>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AntdRegistry>
    </body>
    </html>
  );
}