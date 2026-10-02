import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title zaroori hai aur non-empty string honi chahiye" });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ success: false, message: "Content zaroori hai aur non-empty string honi chahiye" });
    }

    const newNote = await Note.create({
      title: title.trim(),
      content: content.trim()
    });

    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: `Note ID ${req.params.id} nahi mila` });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res.status(400).json({ success: false, message: "Title valid non-empty string honi chahiye" });
    }
    if (content !== undefined && (typeof content !== "string" || content.trim() === "")) {
      return res.status(400).json({ success: false, message: "Content valid non-empty string honi chahiye" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    updateData.updatedAt = new Date().toISOString();

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: `Note ID ${req.params.id} nahi mila` });
    }

    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ success: false, message: `Note ID ${req.params.id} nahi mila` });
    }

    res.status(200).json({ success: true, message: "Note delete ho gaya", data: deletedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};