import { Post, PostUtils } from './Post.model';
import { UserProfile, UserProfileUtils } from './UserProfile.model';

export interface PostWithAuthor {
  post: Post;
  authorProfile: UserProfile | null;
}

export const PostWithAuthorUtils = {
  make(json: Record<string | number | symbol, unknown> | Partial<PostWithAuthor>): PostWithAuthor | null {
    const post = {
      post: json.post,
      authorProfile: json.authorProfile,
    } as PostWithAuthor;

    if (!post?.post?.exists) {
      return null;
    }

    post.post = PostUtils.make(post.post);
    post.authorProfile = post.authorProfile ? UserProfileUtils.make(post.authorProfile) : null;

    return post;
  },

  serialize(postWithAuthor: PostWithAuthor) {
    const post = PostUtils.serialize(postWithAuthor.post);
    const userProfile = postWithAuthor.authorProfile ? UserProfileUtils.serialize(postWithAuthor.authorProfile) : null;

    return {
      post,
      userProfile,
    };
  },
};
