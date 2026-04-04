'use client';

import { useActionState } from 'react';
import type { AdminActionState } from '@/types/post';

type DeleteAction = (
  state: AdminActionState,
  formData: FormData
) => Promise<AdminActionState>;

type AdminDeleteButtonProps = {
  action: DeleteAction;
  id: string;
  confirmMessage: string;
};

const initialState: AdminActionState = {
  message: null,
};

export default function AdminDeleteButton({
  action,
  id,
  confirmMessage,
}: AdminDeleteButtonProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col items-start gap-2"
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 rounded border text-red-600 hover:bg-red-50 transition disabled:opacity-60"
      >
        {isPending ? '삭제 중...' : '삭제'}
      </button>

      {state.message && (
        <p className="text-sm text-red-600 whitespace-pre-wrap">{state.message}</p>
      )}
    </form>
  );
}
