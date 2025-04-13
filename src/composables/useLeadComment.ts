import { ref } from "vue";
import { useLeadsStore } from "@/store/useLeadsStore";
import { useUsersStoreRefs } from "@/store/useUserStore";

export function useLeadComment() {
  const { updateLead } = useLeadsStore();
  const { users } = useUsersStoreRefs();
  const isSending = ref(false);
  const error = ref<null | string>(null);
  const newComment = ref<string>('')
  const userId = users.value.userInfo?.id;

  const sendLeadComment = async (
    leadId: number,
    existingHistory: any[] = []
  ) => {
    error.value = null;
    const text = newComment.value.trim();
    if (!text || !leadId) return false;

    const now = new Date();
    const time = now.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedHistory = Array.isArray(existingHistory)
      ? [...existingHistory]
      : [];

    updatedHistory.push({
      txt: text,
      time,
      id_user: userId,
    });

    try {
      isSending.value = true;
      await updateLead(leadId, { history: updatedHistory });
      return true;
    } catch (err) {
      error.value = "Ошибка при сохранении комментария";
      console.error(err);
      return false;
    } finally {
      isSending.value = false;
    }
  };

  return {
    sendLeadComment,
    newComment,
    isSending,
    error,
  };
}