import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useOffline } from '../../contexts/OfflineContext.tsx';
import faceRecognitionService from '../../services/faceRecognition.ts';
import apiService, { AttendanceRecord } from '../../services/api.ts';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';
import toast from 'react-hot-toast';
import Webcam from 'react-webcam';

interface AttendanceStats {
  todayAttendance: AttendanceRecord[];
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  lastCheckIn?: AttendanceRecord;
  lastCheckOut?: AttendanceRecord;
}

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { isOnline, storeOfflineData } = useOffline();
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    todayAttendance: [],
    hasCheckedIn: false,
    hasCheckedOut: false
  });
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'check-in' | 'check-out' | 'break-start' | 'break-end'>('check-in');
  const [faceDetected, setFaceDetected] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number; address?: string} | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTodayAttendance();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (cameraActive) {
      startFaceDetection();
    } else {
      stopFaceDetection();
    }

    return () => {
      stopFaceDetection();
    };
  }, [cameraActive]);

  // Cleanup on unmount - ensure camera is stopped
  useEffect(() => {
    return () => {
      setCameraActive(false);
      stopFaceDetection();
      // Stop all video tracks to ensure camera is released
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const { attendance } = await apiService.getTodayAttendance();
      
      const hasCheckedIn = attendance.some(record => record.type === 'check-in');
      const hasCheckedOut = attendance.some(record => record.type === 'check-out');
      const lastCheckIn = attendance.filter(record => record.type === 'check-in').pop();
      const lastCheckOut = attendance.filter(record => record.type === 'check-out').pop();

      setAttendanceStats({
        todayAttendance: attendance,
        hasCheckedIn,
        hasCheckedOut,
        lastCheckIn,
        lastCheckOut
      });

      // Set default attendance type based on current status
      if (!hasCheckedIn) {
        setAttendanceType('check-in');
      } else if (hasCheckedIn && !hasCheckedOut) {
        setAttendanceType('check-out');
      } else {
        setAttendanceType('check-in');
      }
    } catch (error) {
      console.error('Error loading today attendance:', error);
      toast.error('Failed to load attendance data');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }
  };

  const startFaceDetection = async () => {
    if (!faceRecognitionService.isReady()) {
      try {
        toast.loading('Initializing face recognition...', { id: 'face-init' });
        await faceRecognitionService.initialize();
        toast.success('Face recognition ready!', { id: 'face-init' });
      } catch (error) {
        console.error('Face recognition initialization failed:', error);
        toast.error('Failed to initialize face recognition. Please refresh the page.', { id: 'face-init' });
        return;
      }
    }

    intervalRef.current = setInterval(async () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (video && video.readyState === 4) {
          try {
            const face = await faceRecognitionService.detectSingleFace(video);
            setFaceDetected(!!face);

            // Draw detection box if face detected
            if (face && canvasRef.current) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Clear previous drawings
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw face detection box
                faceRecognitionService.drawDetections(
                  canvas,
                  [face],
                  { withConfidence: true, recognized: [true] }
                );
              }
            }
          } catch (error) {
            console.error('Face detection error:', error);
          }
        }
      }
    }, 500); // Check every 500ms
  };

  const stopFaceDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFaceDetected(false);
  };

  const handleMarkAttendance = async () => {
    if (!faceDetected) {
      toast.error('Please position your face in front of the camera');
      return;
    }

    if (!webcamRef.current) {
      toast.error('Camera not available');
      return;
    }

    try {
      setLoading(true);

      // Capture face from video
      const video = webcamRef.current.video;
      if (!video) {
        throw new Error('Video element not found');
      }

      const faceData = await faceRecognitionService.captureFaceFromVideo(video);
      
      // Validate face quality
      const faceQuality = faceRecognitionService.validateFaceQuality(faceData.faceDetection);
      if (!faceQuality.valid) {
        toast.error(`Face quality issues: ${faceQuality.issues.join(', ')}`);
        return;
      }

      // Convert face descriptor to array
      const faceDescriptor = faceRecognitionService.descriptorToArray(faceData.faceDetection.descriptor);
      
      // Create image blob for upload
      const imageBlob = await faceRecognitionService.canvasToBlob(faceData.canvas);
      const imageFile = new File([imageBlob], `attendance-${Date.now()}.jpg`, { type: 'image/jpeg' });

      if (isOnline) {
        // Online - submit to server
        const { attendance } = await apiService.markAttendanceWithFace(
          faceDescriptor,
          attendanceType,
          faceData.faceDetection.detection.score,
          imageFile,
          location || undefined,
          undefined
        );

        toast.success(`${attendanceType.replace('-', ' ')} marked successfully!`);
        await loadTodayAttendance();
      } else {
        // Offline - store locally
        const offlineData = {
          faceDescriptor,
          type: attendanceType,
          confidence: faceData.faceDetection.detection.score,
          location,
          timestamp: Date.now()
        };

        await storeOfflineData(`attendance_${Date.now()}`, offlineData);
        toast.success(`${attendanceType.replace('-', ' ')} saved offline. Will sync when online.`);
      }

      setCameraActive(false);
    } catch (error: any) {
      console.error('Attendance marking error:', error);
      toast.error(error.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      // Stop camera and clean up
      setCameraActive(false);
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    } else {
      // Start camera
      setCameraActive(true);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const calculateWorkingHours = () => {
    if (attendanceStats.lastCheckIn && attendanceStats.lastCheckOut) {
      const checkIn = new Date(attendanceStats.lastCheckIn.checkInTime);
      const checkOut = new Date(attendanceStats.lastCheckOut.checkOutTime || '');
      const diff = checkOut.getTime() - checkIn.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance</h1>
        <p className="text-gray-600">Mark your attendance using face recognition</p>
        
        {!isOnline && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-md">
            <p className="text-yellow-800 text-sm">
              You're offline. Attendance will be saved locally and synced when you're back online.
            </p>
          </div>
        )}
      </div>

      {/* Today's Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                attendanceStats.hasCheckedIn ? 'bg-success-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 ${
                  attendanceStats.hasCheckedIn ? 'text-success-600' : 'text-gray-400'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Check In</p>
              <p className="text-lg font-semibold text-gray-900">
                {attendanceStats.lastCheckIn ? formatTime(attendanceStats.lastCheckIn.checkInTime) : 'Not checked in'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                attendanceStats.hasCheckedOut ? 'bg-danger-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 ${
                  attendanceStats.hasCheckedOut ? 'text-danger-600' : 'text-gray-400'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Check Out</p>
              <p className="text-lg font-semibold text-gray-900">
                {attendanceStats.lastCheckOut ? formatTime(attendanceStats.lastCheckOut.checkOutTime || '') : 'Not checked out'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Working Hours</p>
              <p className="text-lg font-semibold text-gray-900">{calculateWorkingHours()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Actions */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
          
          {/* Attendance Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {[
              { value: 'check-in', label: 'Check In', color: 'success' },
              { value: 'check-out', label: 'Check Out', color: 'danger' },
              { value: 'break-start', label: 'Break Start', color: 'warning' },
              { value: 'break-end', label: 'Break End', color: 'primary' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setAttendanceType(option.value as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  attendanceType === option.value
                    ? `bg-${option.color}-600 text-white`
                    : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Section */}
        <div className="space-y-4">
          {!user?.faceEnrolled ? (
            /* Face Not Enrolled - Show Upload Face Button */
            <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
              <svg className="mx-auto h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-orange-900">Face Not Enrolled</h3>
              <p className="mt-1 text-sm text-orange-700">
                You need to upload your face first before marking attendance
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/face-enrollment'}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  👤 Upload Your Face
                </button>
              </div>
              <div className="mt-4 text-xs text-orange-600">
                <p>This is a one-time setup required for face recognition attendance</p>
              </div>
            </div>
          ) : !cameraActive ? (
            /* Face Enrolled - Show Mark Attendance Button */
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Ready to Mark Attendance</h3>
              <p className="mt-1 text-sm text-gray-500">Click the button below to start attendance marking</p>
              <div className="mt-6">
                <button
                  onClick={toggleCamera}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  📷 Mark Attendance
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="camera-frame aspect-video bg-black rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                  }}
                />
                
                {/* Face detection overlay */}
                <canvas
                  ref={canvasRef}
                  className="face-detection-canvas"
                  width={640}
                  height={480}
                />
                
                {/* Face detection indicator */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
                    faceDetected ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      faceDetected ? 'bg-success-600' : 'bg-warning-600'
                    }`}></div>
                    <span>{faceDetected ? 'Face Detected' : 'Position Your Face'}</span>
                  </div>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={toggleCamera}
                  className="btn btn-outline"
                >
                  Stop Camera
                </button>
                <button
                  onClick={handleMarkAttendance}
                  disabled={!faceDetected || loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    `Mark ${attendanceType.replace('-', ' ')}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Records */}
      {attendanceStats.todayAttendance.length > 0 && (
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Records</h2>
          <div className="space-y-3">
            {attendanceStats.todayAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    record.type === 'check-in' ? 'bg-success-500' :
                    record.type === 'check-out' ? 'bg-danger-500' :
                    'bg-warning-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {record.type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(record.checkInTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'auto-approved' ? 'bg-success-100 text-success-800' :
                    record.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage; 