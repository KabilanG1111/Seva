import React, { useState, useEffect, useRef } from 'react';

function DonorPulseAvailability({ donorId, donorName, bloodType, onStatusChange }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const [showMovementAlert, setShowMovementAlert] = useState(false);
  const initialLocationRef = useRef(null);
  const gpsIntervalRef = useRef(null);

  const mockAddress = "Bangalore, India";
  const hospitalLat = 28.5355;
  const hospitalLng = 77.3910;

  const getRandomCoordinates = () => {
    return {
      lat: 28.5355 + (Math.random() - 0.5) * 0.02,
      lng: 77.3910 + (Math.random() - 0.5) * 0.02
    };
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 1000);
  };

  const getLastSeenText = (timestamp) => {
    if (!timestamp) return "never";
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return "just now";
    if (diff < 120) return "1 min ago";
    return `${Math.floor(diff / 60)} min ago`;
  };

  const handleAvailabilityToggle = () => {
    if (!isAvailable) {
      const initialLoc = getRandomCoordinates();
      initialLocationRef.current = initialLoc;
      setLocation(initialLoc);
      setLastSeen(new Date());
      setIsAvailable(true);

      if (onStatusChange) {
        onStatusChange({
          id: donorId,
          name: donorName,
          bloodGroup: bloodType,
          status: 'ACTIVE',
          location: initialLoc,
          lastSeen: new Date(),
          distance: calculateDistance(initialLoc.lat, initialLoc.lng, hospitalLat, hospitalLng)
        });
      }

      gpsIntervalRef.current = setInterval(() => {
        const newLoc = getRandomCoordinates();
        const distance = calculateDistance(
          initialLocationRef.current.lat,
          initialLocationRef.current.lng,
          newLoc.lat,
          newLoc.lng
        );

        if (distance > 500) {
          setShowMovementAlert(true);
          clearInterval(gpsIntervalRef.current);
        } else {
          setLocation(newLoc);
          setLastSeen(new Date());

          if (onStatusChange) {
            onStatusChange({
              id: donorId,
              name: donorName,
              bloodGroup: bloodType,
              status: 'ACTIVE',
              location: newLoc,
              lastSeen: new Date(),
              distance: calculateDistance(newLoc.lat, newLoc.lng, hospitalLat, hospitalLng)
            });
          }
        }
      }, 90000);
    } else {
      setIsAvailable(false);
      setLocation(null);
      setLastSeen(null);
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);

      if (onStatusChange) {
        onStatusChange({
          id: donorId,
          name: donorName,
          bloodGroup: bloodType,
          status: 'INACTIVE',
          location: null,
          lastSeen: null
        });
      }
    }
  };

  const handleMovementAlertResponse = (response) => {
    if (response === 'YES') {
      initialLocationRef.current = location;
      setShowMovementAlert(false);

      gpsIntervalRef.current = setInterval(() => {
        const newLoc = getRandomCoordinates();
        const distance = calculateDistance(
          initialLocationRef.current.lat,
          initialLocationRef.current.lng,
          newLoc.lat,
          newLoc.lng
        );

        if (distance > 500) {
          setShowMovementAlert(true);
          clearInterval(gpsIntervalRef.current);
        } else {
          setLocation(newLoc);
          setLastSeen(new Date());

          if (onStatusChange) {
            onStatusChange({
              id: donorId,
              name: donorName,
              bloodGroup: bloodType,
              status: 'ACTIVE',
              location: newLoc,
              lastSeen: new Date(),
              distance: calculateDistance(newLoc.lat, newLoc.lng, hospitalLat, hospitalLng)
            });
          }
        }
      }, 90000);
    } else {
      setIsAvailable(false);
      setLocation(null);
      setLastSeen(null);
      setShowMovementAlert(false);
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);

      if (onStatusChange) {
        onStatusChange({
          id: donorId,
          name: donorName,
          bloodGroup: bloodType,
          status: 'INACTIVE',
          location: null,
          lastSeen: null
        });
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes pulseLive {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(0, 255, 0, 0);
          }
        }

        @keyframes blinkDot {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0.3; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px',
          borderRadius: '4px',
          background: 'rgba(20, 0, 0, 0.4)',
          border: '1px solid #330000'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', letterSpacing: '1px' }}>
              {donorName}
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
              {mockAddress}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ff3333' }}>{bloodType}</div>
            {isAvailable && lastSeen && (
              <div style={{ fontSize: '9px', color: '#00ff00', marginTop: '4px' }}>
                {getLastSeenText(lastSeen)}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleAvailabilityToggle}
          style={{
            background: isAvailable ? 'rgba(255, 51, 51, 0.2)' : 'rgba(0, 255, 0, 0.1)',
            border: isAvailable ? '1px solid #ff3333' : '1px solid #00ff00',
            color: isAvailable ? '#ff3333' : '#00ff00',
            padding: '12px',
            fontFamily: "inherit",
            fontSize: '12px',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontWeight: '700',
            transition: 'all 0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = `0 0 15px ${isAvailable ? 'rgba(255, 51, 51, 0.5)' : 'rgba(0, 255, 0, 0.5)'}`;
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          {isAvailable ? '🔴 STOP SHARING LOCATION' : '🟢 I AM AVAILABLE NOW'}
        </button>

        {isAvailable && location && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'rgba(0, 255, 0, 0.05)',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              borderRadius: '2px'
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff00',
                animation: 'blinkDot 1s infinite'
              }}
            />
            <span style={{ fontSize: '9px', color: '#00ff00', letterSpacing: '1px' }}>
              LIVE TRACKING ACTIVE
            </span>
          </div>
        )}
      </div>

      {showMovementAlert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            fontFamily: "'Share Tech Mono', monospace"
          }}
        >
          <div
            style={{
              background: '#0a0000',
              border: '2px solid #ff3333',
              padding: '32px',
              maxWidth: '400px',
              textAlign: 'center',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(255, 51, 51, 0.4)'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#ff3333', letterSpacing: '2px', marginBottom: '16px' }}>
              LOCATION CHANGE DETECTED
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '24px', lineHeight: '1.6' }}>
              You have moved away from your registered location.
              <br />
              Are you still available for emergency donation?
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleMovementAlertResponse('YES')}
                style={{
                  flex: 1,
                  background: 'rgba(0, 255, 0, 0.1)',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  padding: '12px',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#00ff00';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 255, 0, 0.1)';
                  e.target.style.color = '#00ff00';
                }}
              >
                YES, AVAILABLE
              </button>
              <button
                onClick={() => handleMovementAlertResponse('NO')}
                style={{
                  flex: 1,
                  background: 'rgba(255, 51, 51, 0.1)',
                  border: '1px solid #ff3333',
                  color: '#ff3333',
                  padding: '12px',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff3333';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 51, 51, 0.1)';
                  e.target.style.color = '#ff3333';
                }}
              >
                NO, STOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorPulseAvailability;
