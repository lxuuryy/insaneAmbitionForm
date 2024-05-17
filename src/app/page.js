import Image from "next/image";
import Form from "./Form";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center overflow-auto bg-gradient-to-br from-violet-950 to-black">
      <Form />
    </main>
  );
}
