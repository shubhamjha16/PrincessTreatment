import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MoodCheckIn } from './components/MoodCheckIn';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Check if user has completed onboarding (could check Firestore)
        const hasCompletedOnboarding = localStorage.getItem(`aura_onboarded_${user.uid}`);
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true);
        } else {
          // Check if mood check-in shown today
          const today = new Date().toDateString();
          const lastMoodCheck = localStorage.getItem(`aura_mood_${user.uid}`);
          if (lastMoodCheck !== today) {
            // Delay mood check-in by 2 seconds after load
            setTimeout(() => setShowMoodCheckIn(true), 2000);
          }
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    const user = auth.currentUser;
    if (user) {
      localStorage.setItem(`aura_onboarded_${user.uid}`, 'true');
    }
    setShowOnboarding(false);
    // Show mood check after onboarding
    setTimeout(() => setShowMoodCheckIn(true), 1000);
  };

  const handleMoodComplete = (mood: string) => {
    const user = auth.currentUser;
    if (user) {
      localStorage.setItem(`aura_mood_${user.uid}`, new Date().toDateString());
      // Could save mood to Firestore here
      console.log('Mood logged:', mood);
    }
    setShowMoodCheckIn(false);
  };

  // Show Onboarding if needed
  if (showOnboarding && isLoggedIn) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {/* Mood Check-In Overlay */}
      {showMoodCheckIn && isLoggedIn && (
        <MoodCheckIn
          onComplete={handleMoodComplete}
          onDismiss={() => setShowMoodCheckIn(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
