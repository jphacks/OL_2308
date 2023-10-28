import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { Providers } from './providers';

// -- app下全ページ共有のレイアウト --
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
