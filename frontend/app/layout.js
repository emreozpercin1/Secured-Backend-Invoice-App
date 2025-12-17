import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/context/AuthContext";


export const metadata = {
  title: "Invoice App",
  description: "Invoice Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
