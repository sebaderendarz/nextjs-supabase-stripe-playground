import Link from "next/link";
import supabase from "@/lib/supabase/anon-client";
import { Lesson } from "./[id]";

type HomeProps = {
  lessons: Lesson[];
};

export default function Home({ lessons }: HomeProps) {
  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`} passHref>
          <div className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </div>
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select();
  return {
    props: {
      lessons,
    },
  };
};
