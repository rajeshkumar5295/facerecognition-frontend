import * as faceapi from 'face-api.js';

// Types for face recognition
interface FaceDetection {
  detection: faceapi.FaceDetection;
  descriptor: Float32Array;
  landmarks?: faceapi.FaceLandmarks68;
  expressions?: faceapi.FaceExpressions;
}

interface FaceMatch {
  distance: number;
  confidence: number;
  matched: boolean;
}

class FaceRecognitionService {
  private isInitialized = false;
  private modelLoadPromise: Promise<void> | null = null;
  private readonly CONFIDENCE_THRESHOLD = 0.6;
  private readonly MODEL_URL = '/models'; // Models should be in public/models folder

  // Initialize face-api.js models
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.modelLoadPromise) {
      return this.modelLoadPromise;
    }

    this.modelLoadPromise = this.loadModels();
    try {
      await this.modelLoadPromise;
      this.isInitialized = true;
    } catch (error) {
      this.modelLoadPromise = null; // Reset promise so it can be retried
      this.isInitialized = false;
      throw error;
    }
  }

  private async loadModels(): Promise<void> {
    try {
      console.log('Loading face recognition models...');
      
      // Load required models (excluding ageGenderNet as it's not essential)
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(this.MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(this.MODEL_URL),
      ]);
      
      console.log('Face recognition models loaded successfully');
    } catch (error) {
      console.error('Error loading face recognition models:', error);
      this.isInitialized = false; // Reset initialization state on error
      throw new Error('Failed to load face recognition models');
    }
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized;
  }

  // Detect faces in an image/video element
  async detectFaces(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    options: {
      withLandmarks?: boolean;
      withDescriptors?: boolean;
      withExpressions?: boolean;
    } = {}
  ): Promise<FaceDetection[]> {
    if (!this.isInitialized) {
      throw new Error('Face recognition service not initialized');
    }

    try {
      const { withLandmarks = true, withDescriptors = true, withExpressions = false } = options;
      
      let detections = await faceapi
        .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (withExpressions) {
        detections = await faceapi
          .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();
      }

      return detections.map(detection => ({
        detection: detection.detection,
        descriptor: detection.descriptor,
        landmarks: withLandmarks ? detection.landmarks : undefined,
        expressions: withExpressions && 'expressions' in detection ? (detection as any).expressions : undefined,
      }));
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw new Error('Face detection failed');
    }
  }

  // Detect single face (for enrollment and attendance)
  async detectSingleFace(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<FaceDetection | null> {
    const faces = await this.detectFaces(input, { withDescriptors: true });
    
    if (faces.length === 0) {
      return null;
    }
    
    if (faces.length > 1) {
      throw new Error('Multiple faces detected. Please ensure only one face is visible.');
    }
    
    return faces[0];
  }

  // Compare face descriptors
  compareFaces(
    descriptor1: Float32Array | number[],
    descriptor2: Float32Array | number[]
  ): FaceMatch {
    try {
      const desc1 = descriptor1 instanceof Float32Array ? descriptor1 : new Float32Array(descriptor1);
      const desc2 = descriptor2 instanceof Float32Array ? descriptor2 : new Float32Array(descriptor2);
      
      const distance = faceapi.euclideanDistance(desc1, desc2);
      const confidence = Math.max(0, 1 - distance);
      const matched = confidence >= this.CONFIDENCE_THRESHOLD;
      
      return { distance, confidence, matched };
    } catch (error) {
      console.error('Error comparing faces:', error);
      return { distance: 1, confidence: 0, matched: false };
    }
  }

  // Find best match from a list of known descriptors
  findBestMatch(
    inputDescriptor: Float32Array | number[],
    knownDescriptors: (Float32Array | number[])[]
  ): FaceMatch & { index: number } {
    let bestMatch = {
      distance: 1,
      confidence: 0,
      matched: false,
      index: -1
    };

    knownDescriptors.forEach((knownDescriptor, index) => {
      const match = this.compareFaces(inputDescriptor, knownDescriptor);
      if (match.confidence > bestMatch.confidence) {
        bestMatch = { ...match, index };
      }
    });

    return bestMatch;
  }

  // Capture face from video element
  async captureFaceFromVideo(
    video: HTMLVideoElement,
    canvas?: HTMLCanvasElement
  ): Promise<{
    faceDetection: FaceDetection;
    imageData: string;
    canvas: HTMLCanvasElement;
  }> {
    const face = await this.detectSingleFace(video);
    
    if (!face) {
      throw new Error('No face detected in video stream');
    }

    // Create canvas to capture the frame
    const captureCanvas = canvas || document.createElement('canvas');
    const ctx = captureCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size to match video
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    
    // Get image data
    const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);
    
    return {
      faceDetection: face,
      imageData,
      canvas: captureCanvas
    };
  }

  // Convert canvas to blob for file upload
  async canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string = 'image/jpeg',
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create blob from canvas');
        }
      }, type, quality);
    });
  }

  // Draw face detection boxes on canvas
  drawDetections(
    canvas: HTMLCanvasElement,
    detections: FaceDetection[],
    options: {
      withLabels?: boolean;
      withConfidence?: boolean;
      recognized?: boolean[];
    } = {}
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { withLabels = false, withConfidence = true, recognized = [] } = options;

    detections.forEach((detection, index) => {
      const box = detection.detection.box;
      const isRecognized = recognized[index] ?? false;
      
      // Set style based on recognition status
      ctx.strokeStyle = isRecognized ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.fillStyle = isRecognized ? '#10b981' : '#ef4444';
      ctx.font = '16px Arial';

      // Draw detection box
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw label if enabled
      if (withLabels || withConfidence) {
        let label = '';
        
        if (withLabels) {
          label = isRecognized ? 'Recognized' : 'Unknown';
        }
        
        if (withConfidence) {
          const confidence = Math.round(detection.detection.score * 100);
          label += label ? ` (${confidence}%)` : `${confidence}%`;
        }

        if (label) {
          const textWidth = ctx.measureText(label).width;
          const textHeight = 20;
          
          // Draw background for text
          ctx.fillStyle = isRecognized ? '#10b981' : '#ef4444';
          ctx.fillRect(box.x, box.y - textHeight, textWidth + 10, textHeight);
          
          // Draw text
          ctx.fillStyle = 'white';
          ctx.fillText(label, box.x + 5, box.y - 5);
        }
      }

      // Draw landmarks if available
      if (detection.landmarks) {
        this.drawLandmarks(ctx, detection.landmarks, isRecognized);
      }
    });
  }

  // Draw facial landmarks
  private drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: faceapi.FaceLandmarks68,
    recognized: boolean = false
  ): void {
    const color = recognized ? '#10b981' : '#ef4444';
    
    // Draw landmark points
    landmarks.positions.forEach((point) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  // Get face region from image
  async extractFaceRegion(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    detection: faceapi.FaceDetection,
    padding: number = 0.2
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const box = detection.box;
    const paddingX = box.width * padding;
    const paddingY = box.height * padding;
    
    const x = Math.max(0, box.x - paddingX);
    const y = Math.max(0, box.y - paddingY);
    const width = box.width + (paddingX * 2);
    const height = box.height + (paddingY * 2);
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(input, x, y, width, height, 0, 0, width, height);
    
    return canvas;
  }

  // Validate face quality for enrollment
  validateFaceQuality(detection: FaceDetection): {
    valid: boolean;
    issues: string[];
    score: number;
  } {
    const issues: string[] = [];
    let score = 1;

    // Check detection confidence
    if (detection.detection.score < 0.8) {
      issues.push('Face detection confidence is low');
      score -= 0.2;
    }

    // Check face size (should be reasonable size)
    const box = detection.detection.box;
    if (box.width < 100 || box.height < 100) {
      issues.push('Face is too small in the image');
      score -= 0.3;
    }

    // Check if face is too close to edges
    // Note: This would need the full image dimensions to be properly implemented
    // For now, we'll skip this check

    // Check for extreme head poses using landmarks
    if (detection.landmarks) {
      // Simple pose estimation - check if key landmarks are roughly aligned
      const nose = detection.landmarks.getNose();
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      
      if (nose.length > 0 && leftEye.length > 0 && rightEye.length > 0) {
        const noseX = nose[0].x;
        const leftEyeX = leftEye[0].x;
        const rightEyeX = rightEye[0].x;
        
        const eyeDistance = Math.abs(rightEyeX - leftEyeX);
        const noseOffset = Math.abs(noseX - (leftEyeX + rightEyeX) / 2);
        
        if (noseOffset > eyeDistance * 0.3) {
          issues.push('Face angle is too extreme');
          score -= 0.2;
        }
      }
    }

    return {
      valid: score >= 0.6 && issues.length === 0,
      issues,
      score: Math.max(0, score)
    };
  }

  // Clean up resources
  dispose(): void {
    this.isInitialized = false;
    this.modelLoadPromise = null;
  }

  // Get version info
  getVersion(): string {
    return '1.0.0'; // face-api.js doesn't export version, using static version
  }

  // Utility method to convert descriptor to array
  descriptorToArray(descriptor: Float32Array): number[] {
    return Array.from(descriptor);
  }

  // Utility method to convert array to descriptor
  arrayToDescriptor(array: number[]): Float32Array {
    return new Float32Array(array);
  }
}

// Create and export singleton instance
const faceRecognitionService = new FaceRecognitionService();
export default faceRecognitionService;

// Export types
export type { FaceDetection, FaceMatch }; 