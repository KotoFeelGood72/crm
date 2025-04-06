import { ref } from "vue";

const scrollY = ref(0);

export function useScrollLock() {
  const lockScroll = () => {
    scrollY.value = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY.value}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY.value);
  };

  return {
    lockScroll,
    unlockScroll,
  };
}