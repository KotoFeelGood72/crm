<!-- @format -->

<template>
	<div class="admin">
		<adminSidebar />
		<div class="content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import adminSidebar from "@/components/sidebars/admin-sidebar.vue";
</script>

<style scoped lang="scss"></style>
