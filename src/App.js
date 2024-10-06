import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [user, setUser] = useState(null);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  // Message State
  const [message, setMessage] = useState("");

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching movies: " + err.message);
    }
  };

  useEffect(() => {
    getMovieList();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const onSubmitMovie = async () => {
    if (!user) {
      setMessage("Error: You must be signed in to submit a movie.");
      return;
    }

    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: user.uid,
      });
      getMovieList();
      setMessage("Movie submitted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting movie: " + err.message);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    try {
      await deleteDoc(movieDoc);
      getMovieList();
      setMessage("Movie deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting movie: " + err.message);
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    try {
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList();
      setMessage("Movie title updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating movie title: " + err.message);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading file: " + err.message);
    }
  };

  return (
    <div className="App">
      <Auth />

      {user ? (
        <>
          <div className="movie-form">
            <input
              placeholder="Movie title..."
              onChange={(e) => setNewMovieTitle(e.target.value)}
            />
            <input
              placeholder="Release Date..."
              type="number"
              onChange={(e) => setNewReleaseDate(Number(e.target.value))}
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={isNewMovieOscar}
                onChange={(e) => setIsNewMovieOscar(e.target.checked)}
              />
              <label> Received an Oscar</label>
            </div>
            <button onClick={onSubmitMovie}>Submit Movie</button>
          </div>
          <div className="movie-list">
            {movieList.map((movie) => (
              <div className="movie-item" key={movie.id}>
                <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                  {movie.title}
                </h1>
                <p> Date: {movie.releaseDate} </p>
                {user.uid === movie.userId && (
                  <>
                    <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
                    <input
                      placeholder="new title..."
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    <button onClick={() => updateMovieTitle(movie.id)}>
                      Update Title
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="file-upload">
            <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
            <button onClick={uploadFile}>Upload File</button>
          </div>
        </>
      ) : (
        <p>Please log in to manage movies.</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
