import Link from "next/link";

export default async function NotFound() {
  return (
    <div
      className={
        "text-white w-full h-full justify-center items-center flex flex-col px-4 gap-6"
      }
    >
      <div
        className={
          "flex flex-col justify-center items-center gap-2 text-center"
        }
      >
        <p className={"text-xl text-blue-700"}>Page introuvable...</p>
        <p className={"text-sm italic"}>
          Cette page semble inexistante ou supprimée.
        </p>
      </div>
      <Link href={"/home"} className={"bg-blue-700 py-2 px-5 rounded-full"}>
        Retourner à l&apos;accueil
      </Link>
    </div>
  );
}
