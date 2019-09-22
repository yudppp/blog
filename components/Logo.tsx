import React from "react";
import Link from "next/link";

// TODO: use roughjs

const Logo = () => {
  return (
    <Link href={"/"}>
      <img src="/static/logo.png" width="150" height="50" />
    </Link>
  );
};
export default Logo;
