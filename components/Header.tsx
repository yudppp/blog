import Logo from "./Logo";

const Header = () => {
  return (
    <div className="nav">
      <div className="nav__left">
        <span className="nav__item">
          <Logo />
        </span>
      </div>
    </div>
  );
};

export default Header;
