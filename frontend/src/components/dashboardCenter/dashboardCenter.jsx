import styles from "./dashboardCenter.module.css";

import { useState, useEffect } from "react";

import StoryAlternate from "../cards/storyAlternate/storyAlternate";
import DashboardReviews from "../cards/dashboardReviews/dashboardReviews";

export default function DashboardCenter({ readStories, username, reviews }) {
  const storyIds = readStories.map((story) => story.storyId);
  const reviewIds = reviews.map((review) => review.reviewId);
  const [stories, setStories] = useState([
    {
      storyName: "",
      totalNoOfChapters: 0,
      status: true,
    },
  ]);
  const [userReviews, setReviews] = useState([{}]);

  useEffect(() => {
    try {
      fetch(`${process.env.API_URL}stories/getReadStories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyIds,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.status) return console.log(data.message);
          setStories(data.stories);
        });
    } catch (e) {
      console.log(e.message);
    }
  }, [readStories]);

  useEffect(() => {
    try {
      fetch(`${process.env.API_URL}reviews/getUserReviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewIds,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.status) return console.log(data.message);
          console.log(data.reviews);
          setReviews(data.reviews);
        });
    } catch (e) {
      console.log(e.message);
    }
  }, [reviews]);

  return (
    <div className={styles.dashboard_center}>
      <div className={styles.component}>
        <div className={styles.titles}>Stories Read</div>
        <div className={styles.stories_cover}>
          {readStories ? (
            stories &&
            stories.map((story, i) => {
              return (
                <StoryAlternate
                  key={i}
                  story={story}
                  readChapters={readStories && readStories[i].noOfChapters}
                />
              );
            })
          ) : (
            <div>No stories read yet</div>
          )}
        </div>
      </div>
      <div className={styles.component}>
        <div className={styles.titles}>Your Reviews</div>
        <div>
          {userReviews.length != 0 ? (
            userReviews &&
            userReviews.map((review, i) => {
              return (
                <DashboardReviews
                  key={i}
                  storyName={review.storyName}
                  reviewDate={review.reviewDate}
                  review={review.reviewContent}
                />
              );
            })
          ) : (
            <div>You haven't reviewed yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
