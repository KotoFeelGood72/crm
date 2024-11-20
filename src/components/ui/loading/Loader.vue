<template>
  <div class="loader">
    <Icons icon="eos-icons:loading" color="#377dff" size="100px" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @include flex-center;
  background-color: #ffffff;
}
</style>
