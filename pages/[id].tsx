import { useState, useEffect } from "react";
import Video from "react-player";
import { useSupabase } from "@/context/supabase";
import supabase from "../lib/supabase/anon-client";

export interface Lesson {
  id: string;
  title: string;
  description: string;
}

type LessonDetailsProps = {
  lesson: Lesson;
};

const LessonDetails = ({ lesson }: LessonDetailsProps) => {
  const { supabase } = useSupabase();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasWindow, setHasWindow] = useState<boolean>(false);

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from("premium_content")
      .select("video_url")
      .eq("id", lesson.id)
      .single();
    setVideoUrl(data?.video_url);
  };

  useEffect(() => {
    getPremiumContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p>{lesson.description}</p>
      {hasWindow && <Video url={videoUrl} width="100%" />}
    </div>
  );
};

export const getStaticPaths = async () => {
  let { data: lessons } = await supabase.from("lesson").select("id");
  const paths = lessons?.map(({ id }) => {
    return {
      params: {
        id: id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { data: lesson } = await supabase
    .from("lesson")
    .select()
    .eq("id", params.id)
    .single();
  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
