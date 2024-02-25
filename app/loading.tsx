export default function Loading() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-yellow-50 grid place-items-center">
      <span className={`loading loading-dots text-primary loading-md`}></span>
    </div>
  );
}
