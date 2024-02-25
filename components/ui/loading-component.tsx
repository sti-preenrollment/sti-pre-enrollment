type LoadingComponentProps = {
  size: "xs" | "sm" | "md" | "lg";
};

function LoadingComponent({ size }: LoadingComponentProps) {
  return (
    <span
      className={`loading loading-dots text-primary loading-${size}`}
    ></span>
  );
}

export default LoadingComponent;
