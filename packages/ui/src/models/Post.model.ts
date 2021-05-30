import { NewsSummary } from './NewsSummary.model';
import type { BigNumber } from 'ethers';
import { lazyLibService } from 'services/Ethers.service';
import { NewsCreationForm } from './NewsCreationForm.model';

export interface Post extends NewsSummary {
  author: string;
  category: string;
  content: string;
  donationsCount: BigNumber;
  exists: boolean;
  slug: string;
  subtitle: string;
  timeStamp: BigNumber;
  title: string;
  bannerUrl: string;
  country: string;
  listed: boolean;
}

export const PostUtils = {
  make(json: Record<string | number | symbol, unknown> | Partial<Post>): Post | null {
    const post = {
      author: json.author,
      category: json.category,
      content: json.content,
      donationsCount: json.donationsCount,
      exists: json.exists,
      slug: json.slug,
      subtitle: json.subtitle,
      timeStamp: json.timeStamp,
      title: json.title,
      bannerUrl: json.bannerUrl,
      country: json.country,
    } as Post;

    post.donationsCount = lazyLibService.getCachedEthers().BigNumber.from(post.donationsCount);
    post.timeStamp = lazyLibService.getCachedEthers().BigNumber.from(post.timeStamp);

    if (!post.exists) {
      return null;
    }

    return post;
  },
  serialize(
    post: Post,
  ): Pick<Post, Exclude<keyof Post, 'donationsCount' | 'timeStamp'>> & { donationsCount: string; timeStamp: string } {
    return {
      ...post,
      donationsCount: post.donationsCount.toString(),
      timeStamp: post.timeStamp.toString(),
    };
  },
  makePostCreationArray(slug: string, newsCreationForm: NewsCreationForm) {
    return [
      slug,
      newsCreationForm.category,
      newsCreationForm.title,
      newsCreationForm.subtitle,
      newsCreationForm.content,
      newsCreationForm.country,
      newsCreationForm.bannerUrl || '',
    ];
  },
};
