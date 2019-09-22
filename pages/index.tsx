import Layout from "../components/Layout";
import Link from "next/link";
import posts from "../stores/post";

type Props = {
  posts: {
    title: string;
    slug: string;
    date: string;
  }[];
};

const Top = ({ posts }: Props) => {
  return (
    <Layout>
      <div className="posts">
        {posts.map(post => (
          <div key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <h2>
                {post.title} - <span>{post.date}</span>
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
};

Top.getInitialProps = async () => {
  return { posts };
};

export default Top;
