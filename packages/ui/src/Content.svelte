<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import BaseLayout from 'components/BaseLayout.svelte';
  import Settings from 'pages/Settings.svelte';
  import MySubscriptions from 'pages/MySubscriptions.svelte';
  import EditProfile from 'pages/EditProfile/EditProfile.svelte';
  import ReadingList from 'pages/ReadingList/ReadingList.svelte';
  import LatestNews from 'pages/LatestNews.svelte';
  import HottestNews from 'pages/HottestNews.svelte';
  import SearchNews from 'pages/SearchNews.svelte';
  import MyPublishedNews from 'pages/MyPublishedNews.svelte';
  import PublishNews from 'pages/PublishNews.svelte';
  import MyDonations from 'pages/MyDonations.svelte';
  import ReadNewsFromBlockchain from 'pages/ReadNews/ReadNewsFromBlockchain.svelte';
  import ReadNewsFromStorage from 'pages/ReadNews/ReadNewsFromStorage.svelte';
  import ProfileLayout from 'components/ProfileLayout.svelte';
  import Profile from 'pages/Profile/Profile.svelte';
  import Home from 'pages/Home/Home.svelte';
  import NotFound from 'pages/NotFound.svelte';
  import HomeLayout from 'components/HomeLayout.svelte';
  import { parsePage, parseQueryStringParam, parseUrlStringParam } from 'utils/Routing';
  import MobileChat from 'pages/MobileChat.svelte';

  let className: string;
  export { className as class };
</script>

<div class={className}>
  <Router url="">
    <Route path="settings">
      <BaseLayout>
        <Settings />
      </BaseLayout>
    </Route>
    <Route path="my-subscriptions">
      <BaseLayout>
        <MySubscriptions />
      </BaseLayout>
    </Route>
    <Route path="edit-profile">
      <BaseLayout>
        <EditProfile />
      </BaseLayout>
    </Route>
    <Route path="my-reading-list">
      <BaseLayout>
        <ReadingList />
      </BaseLayout>
    </Route>
    <Route path="latest-news">
      <BaseLayout>
        <LatestNews page={1} />
      </BaseLayout>
    </Route>
    <Route path="latest-news/:page" let:params>
      <BaseLayout>
        <LatestNews page={parsePage(params)} />
      </BaseLayout>
    </Route>
    <Route path="hottest-news">
      <BaseLayout>
        <HottestNews page={1} />
      </BaseLayout>
    </Route>
    <Route path="hottest-news/:page" let:params>
      <BaseLayout>
        <HottestNews page={parsePage(params)} />
      </BaseLayout>
    </Route>
    <Route path="search-news">
      <BaseLayout>
        <SearchNews page={1} initialCategory={''} initialTitle={''} />
      </BaseLayout>
    </Route>
    <Route path="search-news/:page" let:params let:location>
      <BaseLayout>
        <SearchNews
          page={parsePage(params)}
          initialCategory={parseQueryStringParam(location, 'category', 'tech')}
          initialTitle={parseQueryStringParam(location, 'title', '')} />
      </BaseLayout>
    </Route>
    <Route path="my-published-news">
      <BaseLayout>
        <MyPublishedNews page={1} />
      </BaseLayout>
    </Route>
    <Route path="my-published-news/:page" let:params>
      <BaseLayout>
        <MyPublishedNews page={parsePage(params)} />
      </BaseLayout>
    </Route>
    <Route path="publish-news">
      <BaseLayout>
        <PublishNews />
      </BaseLayout>
    </Route>
    <Route path="my-donations">
      <BaseLayout>
        <MyDonations />
      </BaseLayout>
    </Route>
    <Route path="read/:slug/chat" let:params>
      <BaseLayout hideFooter={true}>
        <MobileChat slug={parseUrlStringParam(params, 'slug')} />
      </BaseLayout>
    </Route>
    <Route path="read/:slug" let:params>
      <BaseLayout>
        <ReadNewsFromBlockchain slug={parseUrlStringParam(params, 'slug')} />
      </BaseLayout>
    </Route>
    <Route path="reading-list/:slug" let:params>
      <BaseLayout>
        <ReadNewsFromStorage slug={parseUrlStringParam(params, 'slug')} />
      </BaseLayout>
    </Route>
    <Route path="profile/:wallet_address/:partial/:page" let:params>
      <ProfileLayout {params} let:walletAddress let:profile let:page let:partial>
        <Profile {profile} {page} {walletAddress} {partial} />
      </ProfileLayout>
    </Route>
    <Route path="profile/:wallet_address/:partial" let:params>
      <ProfileLayout {params} let:walletAddress let:profile let:page let:partial>
        <Profile {profile} {page} {walletAddress} {partial} />
      </ProfileLayout>
    </Route>
    <Route path="profile/:wallet_address" let:params>
      <ProfileLayout {params} let:walletAddress let:profile let:page let:partial>
        <Profile {profile} {page} {walletAddress} {partial} />
      </ProfileLayout>
    </Route>
    <Route path="home">
      <HomeLayout>
        <Home />
      </HomeLayout>
    </Route>
    <Route path="404">
      <BaseLayout>
        <NotFound />
      </BaseLayout>
    </Route>
    <Route path="">
      <HomeLayout>
        <Home />
      </HomeLayout>
    </Route>
  </Router>
</div>
