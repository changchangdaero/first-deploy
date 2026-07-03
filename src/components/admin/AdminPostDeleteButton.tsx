'use client';

// 관리자 글 삭제 버튼: 글 상세 화면에서 삭제 확인 후 서버 액션을 제출합니다.
type DeletePostAction = (formData: FormData) => Promise<void>;

type AdminPostDeleteButtonProps = {
  action: DeletePostAction;
  id: string;
  confirmMessage: string;
};

export default function AdminPostDeleteButton({
  action,
  id,
  confirmMessage,
}: AdminPostDeleteButtonProps) {
  return (
    <form
      action={action}
      className="post-admin-delete-form"
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="post-admin-action post-admin-action--danger">
        삭제
      </button>
    </form>
  );
}
