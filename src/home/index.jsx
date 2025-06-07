import  { useState } from 'react';
import Home from './Home';

export default function HomeContainer() {
  const [posts] = useState([
    { id: 1, content: 'Kamu tidak sendiri. Pulih bisa dimulai dari sini' },
    { id: 2, content: 'Hari ini aku belajar untuk lebih sabar dan menerima diri.' },
    { id: 3, content: 'Mencoba untuk bersyukur setiap hari membawa ketenangan pikiran.' },
  ]);
  const [currentIndex] = useState(0);

  return (
    <div>
      <Home currentPost={posts[currentIndex]} />
    </div>
  );
}
