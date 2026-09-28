import express from "express";
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/notes", createNote);
router.get("/notes", getAllNotes);
router.get("/notes/:id", getNoteById);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;