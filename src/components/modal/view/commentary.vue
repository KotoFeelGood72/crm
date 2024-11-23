<template>
  <div class="">
    <div class="history_item__review">
      <!-- <div class="empty_comment" v-if="Object.keys(groupedComments).length === 0">
        <img
          src="http://manager.dynamic-devs-collective.ru/wp-content/uploads/2024/09/empty-message.png"
          alt=""
        />
        <p>Пусто</p>
      </div> -->
      <!-- <div class="comment__w" v-else> -->
      <!-- <ul v-for="(comments, date) in groupedComments" :key="date" class="comment_group">
          <li class="comment_date">
            <p>{{ date }}</p>
          </li>
          <ul class="comment_list">
            <li v-for="comment in comments" :key="comment.id" class="comment_item">
              <div class="comment__head">
                <span>{{ comment.comment_author }}</span>
                <span class="comment_time">{{
                  new Date(comment.comment_date).toLocaleTimeString()
                }}</span>
              </div>
              <p>{{ comment.comment_content }}</p>
            </li>
          </ul>
        </ul> -->
      <!-- </div> -->
    </div>
    <!-- <div class="history_item__action">
      <textarea
        name=""
        id=""
        placeholder="Оставить комментарий"
        v-model="newComment"
        @input="adjustTextareaHeight"
        @click.stop
        @keydown.enter="onEnter"
      ></textarea>
      <div class="send_comment" @click.stop="addComment">
        <Icons icon="solar:chat-round-unread-bold" :size="20" />Отправить
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { api } from "@/api/api";
// import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
// import { useUsersStoreRefs } from "@/store/useUserStore";
// import { ref } from "vue";

// const clientStore = useClientStore();
// const { statuses } = useClientStoreRefs();
// const { users } = useUsersStoreRefs();
// const newComment = ref("");

// async function addComment() {
//   if (newComment.value.trim()) {
//     try {
//       // Отправляем новый комментарий через API
//       await api.post("/wp-json/wp/v2/comments", {
//         post: props.card.id,
//         content: newComment.value.trim(),
//         author_name: users.value.userInfo.name,
//         author_email: users.value.userInfo.acf.user_email,
//       });

//       // После успешной отправки комментария, заново получаем обновленную карточку клиента
//       const updatedCard = await api.get(`/wp-json/wp/v2/client_new/${props.card.id}`);

//       // Обновляем карточку клиента в хранилище
//       clientStore.updateClientInStore(updatedCard.data);

//       console.log("Комментарий успешно добавлен и карточка обновлена.");
//     } catch (error) {
//       console.error("Ошибка при добавлении комментария:", error);
//     }

//     newComment.value = ""; // Очищаем поле ввода после отправки
//   }
// }

// function onEnter(event: KeyboardEvent) {
//   // Проверяем, нажата ли клавиша Shift
//   if (event.shiftKey) {
//     // Если Shift + Enter, то добавляем новую строку
//     newComment.value += "\n";
//   } else {
//     // Если просто Enter, то вызываем метод отправки комментария
//     addComment();
//     // Предотвращаем стандартное поведение Enter
//     event.preventDefault();
//   }
// }
</script>

<style scoped lang="scss">
.history_item {
  padding-top: 0 !important;
  padding-bottom: 20px !important;
  &.comment {
    @include flex-start;
    flex-direction: row;
    gap: 40px !important;
  }
}

.history_item__action {
  width: 50%;
  // padding-top: 45px;
}

.history_item__review {
  width: 50%;
}

.comment_date {
  @include flex-center;
  margin-bottom: 10px;
  p {
    // background-color: $ulight;
    font-weight: 500;
    font-size: 14px;
    padding: 4px 20px;
    border-radius: 100px;
  }
}

.comment_item {
  display: flex;
  flex-direction: column;
  // background-color: $ulight;
  padding: 10px;
  border-radius: 5px;
}

.comment__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid $light;
}
</style>
