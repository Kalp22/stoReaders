import styles from "./chapter.module.css";

import { Quicksand } from "next/font/google";

import Link from "next/link";

const quicksand = Quicksand({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function Chapter({ chapter, story_name }) {
  const storyName = encodeURIComponent(story_name);
  const chapterName = encodeURIComponent(chapter.chapterName);

  return (
    <li className={styles.list}>
      <div className={styles.chapter_label}>
        <span>Chapter {chapter.chapterNumber}</span>
        <span className={quicksand.className}>{chapter.chapterName}</span>
      </div>
      <Link
        className={styles.read_button}
        href={`/story/${storyName}/read/${chapterName}`}
      >
        Read
      </Link>
    </li>
  );
}
