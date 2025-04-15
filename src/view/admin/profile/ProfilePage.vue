<template>
  <n-card>
    <n-tabs type="segment" animated>
      <n-tab-pane name="oasis" tab="Oasis">
        <n-card title="Настройки аккаунта">
          <n-card :bordered="false">
            <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f">
              Click to Upload
            </n-upload>
          </n-card>
        </n-card>
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="the Beatles"> Hey Jude </n-tab-pane>
      <n-tab-pane name="jay chou" tab="Jay Chou"> Qilixiang </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
