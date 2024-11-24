const mongoose = require("mongoose");
const Secret = require("../model/Secret");

// Fetch secrets list
const fetchSecrets = async (req, res) => {
  try {
    const secrets = await Secret.find();
    if (!secrets || secrets.length === 0) {
      return res.status(404).json({ message: "No Secrets Found" });
    }
    return res.status(200).json({ secrets });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching secrets" });
  }
};

// Add a new secret
const addSecret = async (req, res) => {
  const { title, description, userId, content } = req.body;
  const currentDate = new Date();

  try {
    // Check if the user already has a secret
    const existingSecret = await Secret.findOne({ userId });
    if (existingSecret) {
      return res.status(400).json({ message: "You already have a secret" });
    }

    const newSecret = new Secret({
      title,
      description,
      userId,
      content,
      date: currentDate,
    });

    await newSecret.save();
    return res.status(201).json({ newSecret });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error adding new secret" });
  }
};

// Delete a secret
const deleteSecret = async (req, res) => {
  const id = req.params.id;

  try {
    const findCurrentSecret = await Secret.findByIdAndDelete(id);
    if (!findCurrentSecret) {
      return res.status(404).json({ message: "Secret not found" });
    }
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Unable to delete! Please try again" });
  }
};

// Update a secret
const updateSecret = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  try {
    const currentSecretTOUpdate = await Secret.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!currentSecretTOUpdate) {
      return res.status(404).json({ message: "Unable to update" });
    }

    return res.status(200).json({ currentSecretTOUpdate });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Something went wrong while updating! Please try again",
    });
  }
};

module.exports = { fetchSecrets, addSecret, deleteSecret, updateSecret };
