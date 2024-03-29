"use client";
import styles from "./latestStory.module.css";

import { Nunito } from "next/font/google";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
require("dotenv").config();

const nunito = Nunito({
  display: "swap",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function LatestStory() {
  const router = useRouter();
  const [latestStoryName, setLatestStoryName] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}stories/getLatest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();

        setLatestStoryName(data.storyName);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className={styles.latest_chapter_wrapper}>
      {!latestStoryName ? (
        <div className={styles.latest_chapter_cover}>
          <div className={styles.latest_text}>Latest Story :</div>
          <div className={styles.chapter_name}>Loading...</div>
        </div>
      ) : (
        <div
          className={styles.latest_chapter_cover}
          onClick={() =>
            router.push(`/story/${encodeURIComponent(latestStoryName)}`)
          }
        >
          <div className={styles.latest_text}>Latest Story :</div>

          <div className={`${styles.chapter_name} ${nunito.className}`}>
            {latestStoryName}
          </div>
        </div>
      )}
    </div>
  );
}
