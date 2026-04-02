import ThemeProvider from "../components/ThemeProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
