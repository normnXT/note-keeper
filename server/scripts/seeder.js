// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const Note = require("../models/Note");
// const notes = require("../data/notes");
// const User = require("../models/User");
//
// // Loads .env into process.env
// dotenv.config();

// const importData = async () => {
//     try {
//         await Note.deleteMany();
//
//         const user = await User.findOne({ email: "nick.potvin0@gmail.com" });
//         const sampleNotes = notes.map((note) => {
//             return { user: user._id, ...note };
//         });
//
//         await Note.insertMany(sampleNotes);
//         console.log("Data Imported!");
//     } catch (err) {
//         console.log(err);
//     }
// };
//
// const destroyData = async () => {
//     try {
//         await Note.deleteMany();
//         console.log("Data Destroyed!");
//     } catch (err) {
//         console.error(err);
//     }
// };
//
// if (process.env.SEED === "1") {
//     importData();
// } else {
//     destroyData();
// }
