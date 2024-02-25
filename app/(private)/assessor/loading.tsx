export default function Loading() {
  return (
    <div className="absolute left-0 right-0 bottom-0 top-16 md:left-80 bg-gradient-to-br from-blue-100 to-yellow-50 grid place-items-center">
      <span className={`loading loading-dots text-primary loading-md`}></span>
    </div>
  );
}
