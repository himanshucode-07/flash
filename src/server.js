// import express from "express";
// import Note from "./models/Note";

// // const notes = [
// //   {
// //     id: 1,
// //     title: "Learn Express",
// //     content: "Express routes samajhne hain",
// //   },
// //   {
// //     id: 2,
// //     title: "DSA",
// //     content: "Two pointer ke questions karne hain",
// //   },
// // ];

// const app = express();

// app.use(express.json());

// let notes = [];
// let nextId = 1;

// // ------- CREATE: POST /notes -------
// app.post("/notes", (req, res) => {
//   const { title, content } = req.body;

//   // Validation
//   if (!title || typeof title !== "string" || title.trim() === "") {
//     return res.status(400).json({ success: false, message: "Title zaroori hai aur non-empty string honi chahiye" });
//   }
//   if (!content || typeof content !== "string" || content.trim() === "") {
//     return res.status(400).json({ success: false, message: "Content zaroori hai aur non-empty string honi chahiye" });
//   }

//   const newNote = {
//     id: nextId++,
//     title: title.trim(),
//     content: content.trim(),
//     createdAt: new Date().toISOString()
//   };

//   Note.create(newNote);
//   res.status(201).json({ success: true, data: newNote });
// });

// // ------- READ ALL: GET /notes -------
// app.get("/notes", (req, res) => {
//   res.status(200).json({ success: true, count: notes.length, data: notes });
// });

// // ------- READ ONE: GET /notes/:id -------
// app.get("/notes/:id", (req, res) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     return res.status(400).json({ success: false, message: "ID valid number honi chahiye" });
//   }

//   const note = Note.find(n => n.id === id);

//   if (!note) {
//     return res.status(404).json({ success: false, message: `Note ID ${id} nahi mila` });
//   }

//   res.status(200).json({ success: true, data: note });
// });

// // ------- UPDATE: PUT /notes/:id -------
// app.put("/notes/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const { title, content } = req.body;

//   if (isNaN(id)) {
//     return res.status(400).json({ success: false, message: "ID valid number honi chahiye" });
//   }

//   const note = Note.find(n => n.id === id);

//   if (!note) {
//     return res.status(404).json({ success: false, message: `Note ID ${id} nahi mila` });
//   }

//   if (title !== undefined) {
//     if (typeof title !== "string" || title.trim() === "") {
//       return res.status(400).json({ success: false, message: "Title valid non-empty string honi chahiye" });
//     }
//     note.title = title.trim();
//   }

//   if (content !== undefined) {
//     if (typeof content !== "string" || content.trim() === "") {
//       return res.status(400).json({ success: false, message: "Content valid non-empty string honi chahiye" });
//     }
//     note.content = content.trim();
//   }

//   note.updatedAt = new Date().toISOString();

//   res.status(200).json({ success: true, data: note });
// });

// // ------- DELETE: DELETE /notes/:id -------
// app.delete("/notes/:id", (req, res) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     return res.status(400).json({ success: false, message: "ID valid number honi chahiye" });
//   }

//   const noteIndex = Note.findIndex(n => n.id === id);

//   if (noteIndex === -1) {
//     return res.status(404).json({ success: false, message: `Note ID ${id} nahi mila` });
//   }

//   const deletedNote = notes.splice(noteIndex, 1)[0];


//   res.status(200).json({ success: true, message: "Note delete ho gaya", data: deletedNote });
// });

// // ------- 404 handler (koi bhi route jo match na ho) -------
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route nahi mila" });
// });

// app.listen(3000, () => console.log("Notes API chal raha hai port 3000 pe"));


/* changes*/

import express from "express";
import Note from "./models/Note.js";

const app = express();
app.use(express.json());

// ------- CREATE: POST /notes -------
app.post("/notes", async (req, res) => {
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
});

// ------- READ ALL: GET /notes -------
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------- READ ONE: GET /notes/:id -------
app.get("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: `Note ID ${req.params.id} nahi mila` });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------- UPDATE: PUT /notes/:id -------
app.put("/notes/:id", async (req, res) => {
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
});

// ------- DELETE: DELETE /notes/:id -------
app.delete("/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ success: false, message: `Note ID ${req.params.id} nahi mila` });
    }

    res.status(200).json({ success: true, message: "Note delete ho gaya", data: deletedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------- 404 handler -------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route nahi mila" });
});

app.listen(3000, () => console.log("Notes API chal raha hai port 3000 pe"));