require("dotenv").config();

const express = require("express");
const router = express.Router();
//Story model
const StoryDetail = require("../models/storyDetail.model");

const { google } = require("googleapis");

// Get Cover Image of each or specific story from Google Drive
async function getImageFromGoogleDrive() {
  // Credentials for Google Drive API
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uris = process.env.REDIRECT_URIS;

  // Create an OAuth2 client object from the credentials
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
  );

  // Set the credentials for the OAuth2 client
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  // Create a new instance of Google Drive
  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
  });

  // Retrieve the metadata as a JSON object
  const response = await drive.files.list({
    q: "mimeType='image/jpeg'",
    fields: "files(name, webViewLink)",
  });

  return response;
}

/*
 *@route GET /api/stories/getAll
 */

router.get("/getAll", async (req, res) => {
  try {
    const stories = await StoryDetail.find().exec();
    const storyBasicInfo = stories.map((story) => {
      return {
        storyId: story._id,
        storyName: story.storyBasic.storyName,
        totalNumberOfChapters: story.storyBasic.totalNumberOfChapters,
        status: story.storyBasic.status,
        description: story.storyDescription,
        genre: story.genre,
      };
    });

    const imagesResponse = await getImageFromGoogleDrive();

    const imageNames = imagesResponse.data.files.map((file) => {
      return file.name.split(".")[0];
    });

    const filterdResponse = imagesResponse.data.files.map((file, i) => {
      if (imageNames[i] == storyBasicInfo[i].storyName) {
        return file.webViewLink;
      }
    });

    const finalResponse = filterdResponse.filter((item) => {
      return item != undefined;
    });

    res
      .status(200)
      .json({ status: true, story: storyBasicInfo, dataURI: finalResponse });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

/*
 *@route GET /api/stories/get
 */

router.post("/get", async (req, res) => {
  try {
    const storyName = req.body.storyName;

    const story = await StoryDetail.findOne({
      "storyBasic.storyName": storyName,
    });

    const imagesResponse = await getImageFromGoogleDrive();

    const imageNames = imagesResponse.data.files.map((file) => {
      return file.name.split(".")[0];
    });

    const filterdResponse = imagesResponse.data.files.map((file, i) => {
      if (imageNames[i] == storyName) {
        return file.webViewLink;
      }
    });

    const finalResponse = filterdResponse.filter((item) => {
      return item != undefined;
    });

    res.status(200).json({
      status: true,
      story: story,
      dataURI: finalResponse,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/*
 *@route POST /api/stories/add
 */

router.post("/add", async (req, res) => {
  try {
    const { storyName, storyDescription, genre } = req.body;

    const totalNumberOfChapters = 0;
    const views = 0;
    const status = true;
    const ratings = 0;
    const noOfRatings = 0;

    const newStory = new StoryDetail({
      storyBasic: {
        storyName,
        totalNumberOfChapters,
        status,
      },
      storyDescription,
      genre,
      views,
      ratings,
      noOfRatings,
    });

    await newStory.save();

    res.status(201).json({ status: true, message: "Story added successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
