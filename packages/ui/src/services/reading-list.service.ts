import { PostWithAuthor, PostWithAuthorUtils } from 'models/PostWithAuthor.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { lazyLibService } from './Ethers.service';

const READING_LIST_STORAGE_KEY = 'dexnews-reading-list';

class ReadingListService {
  private articleListSubject: BehaviorSubject<PostWithAuthor[]>;

  constructor() {
    this.articleListSubject = new BehaviorSubject<PostWithAuthor[]>([]);
    this.getReadingListFromStorage().then(r => {
      this.articleListSubject.next(r);
    });
    const indexDbRequest = indexedDB.open('reading-list', 1);
    indexDbRequest.onsuccess = function () {
      const db = this.result;
      const store = db.createObjectStore('articles');
      store.add({ test: 'abd' });
    };
  }

  async getReadingListFromStorage(): Promise<PostWithAuthor[]> {
    await lazyLibService.getEthers();
    const storageValue = window.localStorage.getItem(READING_LIST_STORAGE_KEY) || '[]';
    try {
      const currentList = JSON.parse(storageValue);
      if (!Array.isArray(currentList)) {
        return [];
      }
      return currentList.map(r => PostWithAuthorUtils.make(r));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  pushReadingListToStorage() {
    const articles = this.articleListSubject.getValue();
    const articlesSerialized = articles.map(r => PostWithAuthorUtils.serialize(r));
    window.localStorage.setItem(READING_LIST_STORAGE_KEY, JSON.stringify(articlesSerialized));
  }

  pushArticle(post: PostWithAuthor) {
    const newList = this.articleListSubject.getValue().filter(p => p.post.slug !== post.post.slug);
    newList.push(post);
    this.articleListSubject.next(newList);
    this.pushReadingListToStorage();
  }

  popArticle(slug: string) {
    const newList = this.articleListSubject.getValue().filter(p => p.post.slug !== slug);
    this.articleListSubject.next(newList);
    this.pushReadingListToStorage();
  }

  isArticleSaved$(slug: string): Observable<boolean> {
    return this.articlesList$.pipe(
      map(articles => {
        return articles.findIndex(a => a.post.slug === slug) !== -1;
      }),
    );
  }

  articleBySlug$(slug: string): Observable<PostWithAuthor | undefined> {
    return this.articleListSubject.asObservable().pipe(map(list => list.find(article => article.post.slug === slug)));
  }

  get articlesList$(): Observable<PostWithAuthor[]> {
    return this.articleListSubject.asObservable();
  }
}

export const readingListService = new ReadingListService();
