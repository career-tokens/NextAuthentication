import Image from "next/image";

export default function Home() {
  return (
    <div className="main h-screen flex justify-center px-[10vw] items-center">
      <div className="text-5xl text-gray-200">
        Want to know the <span className="text-orange-500">Quote</span> of the day?
      </div>
    </div>
  );
}
