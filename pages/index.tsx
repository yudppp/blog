import Head from "next/head";
import Link from "next/link";
import { connect } from "react-redux";
import { Post, AppState } from "../features/redux/reducer";

type Props = {
  posts: Post[];
};

const TopPage = ({ posts }: Props) => {
  return (
    <div className="posts">
      <Head>
        <title>○△□ - yudppp techblog</title>
      </Head>
      {posts.map(post => (
        <div key={post.slug} className="posts-item">
          <Link href={`/posts/${post.slug}`}>
            <h2>
              {post.title} - <span>{post.date}</span>
            </h2>
          </Link>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = ({ posts }: AppState) => {
  return {
    posts
  };
};
export default connect(mapStateToProps)(TopPage);
