// import { MongoClient } from 'mongodb';

// const uri = 'your_mongodb_connection_string'; // MongoDB এর URI
// const client = new MongoClient(uri);

// const dbName = 'your_db_name';
// const collectionName = 'likes';

// // POST API: লাইক সেভ করার জন্য
// const saveLike = async (req, res) => {
//   const { _id, userEmail, title } = req.body;

//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // লাইক ডাটা MongoDB-তে সেভ করা
//     const existingLike = await collection.findOne({ _id, userEmail });

//     if (existingLike) {
//       // যদি আগের লাইক থাকে, কিছু না করা
//       return res.status(200).json({ message: 'Already liked' });
//     }

//     await collection.insertOne({ _id, userEmail, title });
//     return res.status(201).json({ message: 'Like saved successfully' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error saving like' });
//   } finally {
//     await client.close();
//   }
// };

// // GET API: MongoDB থেকে লাইক সংখ্যা ফেচ করা
// const getLikesCount = async (req, res) => {
//   const { _id } = req.params;

//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     const likesCount = await collection.countDocuments({ _id });
//     return res.status(200).json({ likesCount });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error fetching like count' });
//   } finally {
//     await client.close();
//   }
// };

// // API রাউট (Express.js ব্যবহার করলে)
// import express from 'express';
// const app = express();
// app.use(express.json());

// app.post('/likes', saveLike);
// app.get('/likes/:_id', getLikesCount);

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });
