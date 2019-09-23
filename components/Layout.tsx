import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="hack">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hack/0.8.1/hack.css" />
        <link rel="shortcut icon" href="/static/favicon.png" />
        <link rel="stylesheet" href="/static/app.css" />
      </Head>
      <div className="container">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
