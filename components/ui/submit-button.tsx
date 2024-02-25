function SubmitButton({ isSubmitting }: { isSubmitting?: boolean }) {
  return (
    <button disabled={isSubmitting} type="submit" className="btn btn-primary">
      Submit
    </button>
  );
}
export default SubmitButton;
