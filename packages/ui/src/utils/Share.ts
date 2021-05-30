import type { Post } from 'models/Post.model';

export function postLink(_post: Post): string {
  return window.location.toString();
}

export function shareOnFacebookLink(post: Post): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink(post))}"`;
}

export function shareOnTwitterLink(post: Post): string {
  return `https://twitter.com/share?url=${encodeURIComponent(postLink(post))}&text=${encodeURIComponent(
    post.title,
  )}via=${encodeURIComponent('DexNews')}`;
}

export function shareOnRedditLink(post: Post): string {
  return `https://reddit.com/submit?url=${encodeURIComponent(postLink(post))}&title=${encodeURIComponent(post.title)}`;
}

export function shareOnHackerNewsLink(post: Post): string {
  return `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(postLink(post))}&t=${encodeURIComponent(
    post.title,
  )}`;
}

export function shareOnLinkedInLink(post: Post): string {
  return `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(postLink(post))}&title=${encodeURIComponent(
    post.title,
  )}&summary=${encodeURIComponent(post.subtitle)}&source=${encodeURIComponent(window.location.hostname)}`;
}

export function shareOnEmailLink(post: Post): string {
  return `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(postLink(post))}`;
}
