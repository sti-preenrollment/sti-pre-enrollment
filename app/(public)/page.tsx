import Link from "next/link";
import stiImage from "@assets/img/hero-banner-img.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen-content hero bg-hero-image lg:bg-gradient-to-br">
      <div className="hero-overlay bg-opacity-50 backdrop-blur-sm lg:hidden"></div>
      <div className="hero-content text-neutral-50 lg:text-neutral-900">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold lg:text-7xl">
            Enrollment Made Easy: Get Started Now
          </h1>
          <p className="mb-5 lg:text-xl">
            We have simplified enrollment for your convenience. Get started
            effortlessly by enrolling now and access a world of opportunities!
          </p>
          <Link
            role="button"
            href={"/enroll"}
            className="btn  rounded-none border-none bg-accent text-neutral-50 shadow-lg hover:bg-red-600"
          >
            Register Now
          </Link>
        </div>
        <div className="hidden aspect-square w-[600px] max-w-screen-xl overflow-hidden rounded-xl  bg-hero-image-fallback bg-cover bg-center shadow-2xl lg:inline">
          <Image
            src={stiImage}
            priority
            alt="hero-banner"
            className="aspect-square w-[600px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
