export function modalAction(modalId: string, action: "open" | "close") {
  const modal = document.getElementById(modalId) as HTMLDialogElement;

  if (action === "close") {
    modal.close();
    return;
  }

  modal.showModal();
  return;
}
