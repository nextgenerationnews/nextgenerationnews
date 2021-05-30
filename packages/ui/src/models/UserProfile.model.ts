import type { BigNumber } from '@ethersproject/bignumber';
import { lazyLibService } from 'services/Ethers.service';

export interface UserProfile {
  name: string;
  profileDescription: string;
  timeStamp: BigNumber;
  imageUrl: string;
  bannerUrl: string;
  exists: boolean;
  validatorScore: number;
}

export interface UserProfileUpdate {
  name: string;
  profileDescription: string;
  imageUrl: string;
  bannerUrl: string;
}

export const UserProfileUtils = {
  make(json: Record<string | number | symbol, unknown> | Partial<UserProfile>): UserProfile | null {
    const profile = {
      exists: json.exists,
      imageUrl: json.imageUrl,
      bannerUrl: json.bannerUrl,
      name: json.name,
      profileDescription: json.profileDescription,
      timeStamp: json.timeStamp,
    } as UserProfile;

    if (!profile.exists) {
      return null;
    }

    profile.timeStamp = lazyLibService.getCachedEthers().BigNumber.from(profile.timeStamp);

    return profile;
  },
  serialize(
    userProfile: UserProfile,
  ): Pick<UserProfile, Exclude<keyof UserProfile, 'timeStamp'>> & { timeStamp: string } {
    return { ...userProfile, timeStamp: userProfile.timeStamp.toString() };
  },
};
