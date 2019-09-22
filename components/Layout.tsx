import "../node_modules/hack/dist/hack.css";
import "../static/app.css";
import Head from "next/head";

import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="hack">
      <Head>
        <link rel="shortcut icon" href="/static/favicon.png" />
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
