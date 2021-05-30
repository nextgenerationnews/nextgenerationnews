<script lang="ts">
  let className = '';
  export { className as class };
</script>

<style>
  .effect {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .container {
    display: inline-block;
    position: relative;
  }
</style>

<div class="overflow-hidden container {className}">
  <div class="effect">
    <svg
      id="visual"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      ><g stroke-width="1" stroke-linejoin="bevel"
        ><path d="M517 309L681 254L536 183Z" fill="#fdfdfd" stroke="#fdfdfd" /><path
          d="M517 309L727 378L681 254Z"
          fill="#fdfdfd"
          stroke="#fdfdfd" /><path d="M960 113L699 0L681 254Z" fill="#f0f0f0" stroke="#f0f0f0" /><path
          d="M681 254L699 0L536 183Z"
          fill="#f3f3f3"
          stroke="#f3f3f3" /><path d="M517 309L537 540L727 378Z" fill="#f7f7f7" stroke="#f7f7f7" /><path
          d="M699 0L400 0L536 183Z"
          fill="#f9f9f9"
          stroke="#f9f9f9" /><path d="M194 252L207 300L517 309Z" fill="#f5f5f5" stroke="#f5f5f5" /><path
          d="M517 309L297 540L537 540Z"
          fill="#f9f9f9"
          stroke="#f9f9f9" /><path d="M537 540L741 540L727 378Z" fill="#ffffff" stroke="#ffffff" /><path
          d="M727 378L960 381L681 254Z"
          fill="#f0f0f0"
          stroke="#f0f0f0" /><path d="M194 252L517 309L536 183Z" fill="#f3f3f3" stroke="#f3f3f3" /><path
          d="M741 540L960 381L727 378Z"
          fill="#f3f3f3"
          stroke="#f3f3f3" /><path d="M960 381L960 113L681 254Z" fill="#fbfbfb" stroke="#fbfbfb" /><path
          d="M400 0L194 252L536 183Z"
          fill="#eeeeee"
          stroke="#eeeeee" /><path d="M207 300L297 540L517 309Z" fill="#eeeeee" stroke="#eeeeee" /><path
          d="M400 0L225 0L194 252Z"
          fill="#fbfbfb"
          stroke="#fbfbfb" /><path d="M960 113L960 0L699 0Z" fill="#ffffff" stroke="#ffffff" /><path
          d="M741 540L960 540L960 381Z"
          fill="#f5f5f5"
          stroke="#f5f5f5" /><path d="M225 0L0 188L194 252Z" fill="#f9f9f9" stroke="#f9f9f9" /><path
          d="M194 252L0 382L207 300Z"
          fill="#fbfbfb"
          stroke="#fbfbfb" /><path d="M207 300L0 382L297 540Z" fill="#f7f7f7" stroke="#f7f7f7" /><path
          d="M0 188L0 382L194 252Z"
          fill="#eeeeee"
          stroke="#eeeeee" /><path d="M225 0L0 0L0 188Z" fill="#f0f0f0" stroke="#f0f0f0" /><path
          d="M0 382L0 540L297 540Z"
          fill="#f5f5f5"
          stroke="#f5f5f5" /></g
      ></svg>
  </div>
  <slot />
</div>
