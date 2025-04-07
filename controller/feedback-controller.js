import Feedback from "../schema/Feedback.js";

export const GetUserFeedback = async (req, res) => {
  const treatmentPack = decodeURIComponent(req.params.treatmentPack);

  try {
    const feedbacks = await Feedback.find({ treatmentPack });

    if (feedbacks.length === 0) {
      return res.status(200).json({ feedbacks: [] });
    }

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const AddFeedback = async (req, res) => {
  const { feedback, prediction, treatmentPack } = req.body;

  if (!feedback || !prediction || !treatmentPack) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  try {
    const newFeedback = new Feedback({ feedback, prediction, treatmentPack });

    await newFeedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback saved successfully!"
    });
  } catch (error) {

    console.error("Error saving feedback:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save feedback."
    });
  }
};

