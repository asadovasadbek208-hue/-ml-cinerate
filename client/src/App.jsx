import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostsPage from './pages/PostsPage.jsx';
import PostPage from './pages/PostPage.jsx';
import AddMoviePage from './pages/AddMoviePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/:id" element={<PostPage />} />
              <Route path="/add-movie" element={<AddMoviePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
