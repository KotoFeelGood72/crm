<!-- @format -->

<template>
	<div :class="['avatar', isSize]">
		<img :src="img" alt="" />
	</div>
</template>

<script setup lang="ts">
	import avatar from "/assets/img/avatar.png";
	import { computed } from "vue";
	const props = withDefaults(
		defineProps<{
			img?: string;
			size?: "small" | "medium" | "big" | "large";
		}>(),
		{
			img: avatar,
			size: "small",
		}
	);

	const isSize = computed(() => {
		switch (props.size) {
			case "small":
				return "size--small";
			case "medium":
				return "size--medium";
			case "large":
				return "size--large";
			case "big":
				return "size--big";
		}
	});
</script>

<style scoped lang="scss">
	.avatar {
		@include flex-center;
		cursor: pointer;
		border-radius: 100px;
		overflow: hidden;

		&.size--small {
			width: 35px;
			height: 35px;
		}
		&.size--medium {
			width: 60px;
			height: 60px;
		}
		&.size--large {
			width: 90px;
			height: 90px;
		}
		&.size--big {
			width: 120px;
			height: 120px;
		}
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
