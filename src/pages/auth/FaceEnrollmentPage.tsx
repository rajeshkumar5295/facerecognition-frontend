import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService from '../../services/api.ts';
import { faceRecognitionService } from '../../services/faceRecognitionService.ts';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';

const FaceEnrollmentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    
    setError(null); // Clear any previous errors

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `face-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setCapturedImages(prev => [...prev, file]);
          
          if (capturedImages.length + 1 >= 3) {
            await completeFaceEnrollment([...capturedImages, file]);
          } else {
            setEnrollmentStep(prev => prev + 1);
          }
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const completeFaceEnrollment = async (images: File[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize face recognition models if not already loaded
      setModelLoading(true);
      toast.loading('Loading face recognition models...', { id: 'model-loading' });
      
      await faceRecognitionService.initializeModels();
      
      toast.success('Models loaded successfully!', { id: 'model-loading' });
      setModelLoading(false);
      
      // Convert File objects to data URLs for face-api.js processing
      toast.loading('Processing face image...', { id: 'processing' });
      
      const imageDataUrls: string[] = await Promise.all(
        images.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      // Extract face descriptor from the first image
      const img = new Image();
      img.src = imageDataUrls[0];
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Use face-api.js to detect face and extract descriptor directly
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detection || !detection.descriptor) {
        throw new Error('No face detected in the captured image. Please ensure your face is clearly visible and try again.');
      }

      // Convert Float32Array to regular array for API
      const faceDescriptor = Array.from(detection.descriptor) as number[];
      
      if (faceDescriptor.length !== 128) {
        throw new Error('Invalid face descriptor generated. Please try capturing your face again.');
      }

      // Debug logging
      console.log('Face descriptor type:', typeof faceDescriptor);
      console.log('Face descriptor length:', faceDescriptor.length);
      console.log('Face descriptor sample:', faceDescriptor.slice(0, 5));

      toast.success('Face processed successfully!', { id: 'processing' });
      
      // Send to backend API
      toast.loading('Enrolling face...', { id: 'enrolling' });
      
      const result = await apiService.enrollFace(faceDescriptor, images[0]);
      
      toast.success('Face enrolled successfully!', { id: 'enrolling' });
      
      if (result.faceEnrolled) {
        toast.success('Face enrollment completed! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.success(`Face sample ${result.descriptorsCount}/3 captured. Please capture ${3 - result.descriptorsCount} more.`);
      }
    } catch (error: any) {
      console.error('Face enrollment error:', error);
      toast.dismiss(); // Clear any loading toasts
      
      const errorMessage = error.message || 'Face enrollment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      setCapturedImages([]);
      setEnrollmentStep(1);
    } finally {
      setIsLoading(false);
      setModelLoading(false);
      toast.dismiss('model-loading');
      toast.dismiss('processing');
      toast.dismiss('enrolling');
    }
  };

  const retryCapture = () => {
    setCapturedImages([]);
    setEnrollmentStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Face Enrollment</h1>
          <p className="text-gray-600">
            We need to capture your face for secure authentication
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {enrollmentStep} of 3
            </span>
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= enrollmentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(enrollmentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {modelLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">Loading face recognition models, please wait...</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-900">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-80 object-cover"
            />
            
            {!isCameraReady && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={captureImage}
            disabled={!isCameraReady || isLoading}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              `Capture Face ${enrollmentStep}`
            )}
          </button>
          
          {capturedImages.length > 0 && (
            <button
              onClick={retryCapture}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Start Over
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Look directly at the camera and ensure good lighting for best results
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceEnrollmentPage; 