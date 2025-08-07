# TrendingFlix

A **trending movie and TV show app** built with **React + Vite**, supporting:

- Fetching and displaying a list of **popular movies** 🎥
- **Search functionality** to quickly find any movie by title 🔍
- **Pagination** to navigate through movie pages
- A responsive, mobile-first design with **Tailwind CSS**
- Fetching and displaying **detailed information** about a specific movie in a modal
- A clean, modern UI powered by the **TMDB API**

---

## 🛠️ Tech Stack

- **React:** For building the UI and managing state.
- **Vite:** For a fast development server and optimized bundling.
- **Tailwind CSS:** For a utility-first styling approach.
- **TMDB API:** For sourcing all movie and TV show data.

---

## 💡 Important Notes

- **API Key:** You **must** acquire your own TMDB API key and set it up as an environment variable in a `.env` file to run the application.
- **Responsiveness:** The app is designed to be fully responsive, adapting its layout from mobile devices to large desktop monitors.
- **Data Fetching:** The app makes two distinct API calls: one to fetch the list of popular movies and another to fetch detailed information for a specific movie when a card is clicked.

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone 
```
```bash
cd movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the API Key

1.  Create an account on the [The Movie Database (TMDB) website](https://www.themoviedb.org/).
2.  Get your API Key.
3.  Create a file named **`.env`** in the project's root folder.
4.  Add your API key to the `.env` file as follows:

```bash
VITE_TMDB_API_KEY="YOUR_KEY"
```

### 4. Run the app

```bash
npm run dev
```