import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { database, storage } from '../../firebase/config';

const FirebaseRulesTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    if (!user) {
      setTestResults({ error: 'Please log in first' });
      return;
    }

    setLoading(true);
    const results = {};

    try {
      // Test 1: Read user role
      try {
        const userRef = ref(database, `users/${user.uid}/role`);
        const roleSnapshot = await get(userRef);
        results.readUserRole = {
          success: true,
          value: roleSnapshot.val()
        };
      } catch (error) {
        results.readUserRole = {
          success: false,
          error: error.message
        };
      }

      // Test 2: Read lecturer profile
      try {
        const profileRef = ref(database, `lecturers/${user.uid}/profile`);
        await get(profileRef);
        results.readLecturerProfile = {
          success: true
        };
      } catch (error) {
        results.readLecturerProfile = {
          success: false,
          error: error.message
        };
      }

      // Test 3: Write lecturer profile
      try {
        const testRef = ref(database, `lecturers/${user.uid}/profile/test`);
        await set(testRef, { timestamp: Date.now() });
        results.writeLecturerProfile = {
          success: true
        };
      } catch (error) {
        results.writeLecturerProfile = {
          success: false,
          error: error.message
        };
      }

      // Test 4: Storage rules
      try {
        const testFile = new Blob(['test'], { type: 'image/jpeg' });
        const imageRef = storageRef(storage, `lecturer-profiles/${user.uid}/profile-image`);
        await uploadBytes(imageRef, testFile);
        results.storageUpload = {
          success: true
        };
      } catch (error) {
        results.storageUpload = {
          success: false,
          error: error.message
        };
      }

    } catch (error) {
      results.error = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (test) => {
    if (!test) return '#ffd700';
    return test.success ? '#90EE90' : '#FFB6C1';
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px', margin: '20px' }}>
      <h2>Firebase Rules Test</h2>
      <button 
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#4A90E2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {Object.entries(testResults).map(([testName, result]) => (
          <div
            key={testName}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: getStatusColor(result),
              borderRadius: '4px'
            }}
          >
            <strong>{testName}:</strong>{' '}
            {result.success ? '✅ Passed' : `❌ Failed - ${result.error}`}
            {result.value && ` (Value: ${result.value})`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirebaseRulesTest; 