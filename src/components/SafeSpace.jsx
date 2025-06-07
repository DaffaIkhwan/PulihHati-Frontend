import Home from '../safespace/index';
import Navbar from './Navbar';

function SafeSpace() {
  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />
      <Home />
    </div>
  );
}

export default SafeSpace;

