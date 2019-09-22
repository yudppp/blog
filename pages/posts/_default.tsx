import { useRouter } from "next/router";
import Link from "next/link";
import { Post, AppState } from "../../features/redux/reducer";
import { connect } from "react-redux";

type Props = {
  posts: Post[];
};

const PostPage = ({ posts }: Props) => {
  const router = useRouter();
  const slug = router.pathname.slice("/posts/".length);
  const post = posts.find(post => post.slug === slug);
  if (!post) return <p>404</p>;
  const postIndex = posts.findIndex(post => post.slug === slug);
  const next = postIndex !== 0 ? posts[postIndex - 1] : null;
  const prev = postIndex !== posts.length - 1 ? posts[postIndex + 1] : null;
  return (
    <>
      <div className="title">
        <h1>{post.title}</h1>
      </div>
      <div>{post.date}</div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.contents }}
      />
      <div className="prevnext">
        {next && (
          <div className="pull-left">
            <Link href={`/posts/${next.slug}`}>
              <span>&lt;&lt; {next.title}</span>
            </Link>
          </div>
        )}
        {prev && (
          <div className="pull-right">
            <Link href={`/posts/${prev.slug}`}>
              <span>{prev.title} &gt;&gt;</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ posts }: AppState) => {
  return {
    posts
  };
};

export default connect(mapStateToProps)(PostPage);
