const Footer = () => {
  return (
    <a href="/posts/whoami/">
      <div className="media profile">
        <div className="media-left">
          <img className="avatarholder" src="/static/profile.svg" />
        </div>
        <div className="media-body">
          <div className="media-heading">@yudppp</div>
          <div className="media-content">Web engineer.</div>
        </div>
      </div>
    </a>
  );
};

export default Footer;
