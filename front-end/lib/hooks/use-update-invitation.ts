import { useMutation } from "@tanstack/react-query"
import { updateInvitation, type InvitationUpdatePayload } from "@/lib/invitations"
import { getErrorMessage } from "@/lib/http"

export function useUpdateInvitation() {
  return useMutation({
    mutationFn: (payload: InvitationUpdatePayload) => updateInvitation(payload),
    onError: () => undefined,
    throwOnError: false,
  })
}

export function getInvitationErrorMessage(error: unknown) {
  return getErrorMessage(error, "Gagal menyimpan undangan.")
}
