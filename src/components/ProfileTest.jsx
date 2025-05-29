import Navbar from './Navbar';

const ProfileTest = () => {
  console.log('ProfileTest component rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pt-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">Profile Page Test</h1>
          <p className="text-stone-600">This is a simple test to see if the profile page renders.</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700">✅ Profile component is working!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTest;
