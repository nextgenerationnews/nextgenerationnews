import { BehaviorSubject } from 'rxjs';

class ResponsivityService {
  private readonly isMobileSubject: BehaviorSubject<boolean>;
  private readonly isDesktopSubject: BehaviorSubject<boolean>;

  constructor() {
    this.isMobileSubject = new BehaviorSubject<boolean>(this.isMobile());
    this.isDesktopSubject = new BehaviorSubject<boolean>(this.isDesktop());
    window.removeEventListener('resize', () => {
      this.isMobileSubject.next(this.isMobile());
      this.isDesktopSubject.next(this.isDesktop());
    });
  }

  isMobile() {
    return (
      navigator.userAgent.toLowerCase().includes('mobile') ||
      window.matchMedia('(pointer:none), (pointer:coarse)').matches
    );
  }

  isDesktop() {
    return (
      !navigator.userAgent.toLowerCase().includes('mobile') &&
      !window.matchMedia('(pointer:none), (pointer:coarse)').matches
    );
  }

  get isMobile$() {
    return this.isMobileSubject.asObservable();
  }

  get isDesktop$() {
    return this.isDesktopSubject.asObservable();
  }
}

export const responsivityService = new ResponsivityService();
