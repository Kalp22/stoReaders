"use client";
import styles from "./page.module.css";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/navbar";
import Genre from "@/components/genre/genre";
import Rating from "@/components/rate/rating";
import Chapters from "@/components/chapters/chapters";
import Reviews from "@/components/reviews/reviews";

import { FaStar } from "react-icons/fa";

export default function StoryOverview({ params: { id } }) {
  const router = useRouter();
  const storyName = id.replace(/-/g, " ");
  const [story, setStory] = useState({
    _id: "",
    storyBasic: { storyName: "" },
    genre: [],
  });

  const [images, setImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("url()");
  const [descToggle, setDescToggle] = useState(true);

  //extracting and filtering image urls from google drive
  const imageURLS = images.map((image, i) => {
    const reducedURI = image.slice(0, -18);
    const id = reducedURI.split("/")[5];

    const string = "uc?export=view&id=";

    const url = `https://drive.google.com/${string}${id}`;
    return url;
  });

  //setting background image
  useEffect(() => {
    if (imageURLS[0]) {
      setBackgroundImage(`url(${imageURLS[0]})`);
    }
  }, [imageURLS]);

  //fetching story data
  useEffect(() => {
    fetch(`${process.env.API_URL}stories/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyName: storyName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          alert("Story not found");
          router.push("/stories");
          return;
        }
        setStory(data.story);
        setImages(data.dataURI);
      });
  }, []);

  //toggle description "read more" and "read less
  function descriptionToggle() {
    const description = document.querySelector(`.${styles.description}`);
    description.classList.toggle(styles.description_full);

    setDescToggle(!descToggle);
  }

  return (
    <>
      <Navbar />
      <div className={styles.all_overview_wrapper}>
        <div className={styles.left_overview_wrapper}>
          <Image
            alt="story image"
            src={imageURLS && imageURLS[0]}
            height={350}
            width={250}
            loading="lazy"
            className={styles.story_image}
          />
          <div className={styles.info_wrapper}>
            <h1>{story.storyBasic.storyName}</h1>
            <div className={styles.genre_wrapper}>
              {story &&
                story.genre.map((genre, i) => {
                  return <Genre genre={genre} index={i} key={i} />;
                })}
            </div>
            <div className={styles.link}>
              <Link href={`/story/${id}/read/the`}>
                <div className={styles.read_now}>Read Now</div>
              </Link>
            </div>
            <p className={styles.description}>{story.storyDescription}</p>
            <div>
              <span
                className={styles.more_button}
                onClick={() => descriptionToggle()}
              >
                {descToggle ? "+ Read More" : "- Read Less"}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.right_overview_wrapper}>
          <div className={styles.all_parameters_wrapper}>
            <div className={styles.parameter_value_wrapper}>
              <div className={styles.parameters}>Status</div>
              <div className={styles.values}>
                {story.storyBasic.status ? "Ongoing" : "Completed"}
              </div>
            </div>
            <div className={styles.parameter_value_wrapper}>
              <div className={styles.parameters}>Views</div>
              <div className={styles.values}>{story.views}</div>
            </div>
            <div className={styles.parameter_value_wrapper}>
              <FaStar className={styles.star} />
              <div className={styles.values}>{story.ratings}</div>
            </div>
          </div>
          <div className={styles.ratings_wrapper}>
            {story._id && <Rating storyId={story._id} />}
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundImage: backgroundImage,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={styles.chapters_overview_wrapper}
      >
        {story && story._id && (
          <Chapters id={story._id} story_name={storyName} />
        )}
      </div>
      <div className={styles.reviews_wrapper}>
        <Reviews storyId={story._id} />
      </div>
    </>
  );
}
