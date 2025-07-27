import * as faceapi from 'face-api.js';

interface FaceDetection {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: any;
  descriptor?: Float32Array;
}

interface FaceDescriptor {
  userId: string;
  descriptors: Float32Array[];
}

class FaceRecognitionService {
  private isModelsLoaded = false;
  private faceDescriptors: FaceDescriptor[] = [];

  async initializeModels(): Promise<void> {
    if (this.isModelsLoaded) return;

    try {
      console.log('Loading face-api.js models from /models directory...');
      
      // Load face-api.js models one by one for better error reporting
      console.log('Loading tiny face detector...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      
      console.log('Loading face landmark detector...');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      
      console.log('Loading face recognition model...');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      
      console.log('Loading face expression model...');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      
      this.isModelsLoaded = true;
      console.log('All face recognition models loaded successfully');
    } catch (error: any) {
      console.error('Failed to load face recognition models:', error);
      this.isModelsLoaded = false;
      
      if (error.message?.includes('404')) {
        throw new Error('Face recognition model files not found. Please ensure the models are properly installed.');
      } else if (error.message?.includes('Failed to fetch')) {
        throw new Error('Network error while loading face recognition models. Please check your internet connection.');
      } else {
        throw new Error(`Failed to initialize face recognition models: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      videoElement.srcObject = stream;
      
      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Camera initialization error:', error);
      throw new Error('Failed to access camera');
    }
  }

  async detectFace(videoElement: HTMLVideoElement): Promise<FaceDetection | null> {
    if (!this.isModelsLoaded) {
      await this.initializeModels();
    }

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        return null;
      }

      return {
        box: {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
        },
        landmarks: detection.landmarks,
        descriptor: detection.descriptor,
      };
    } catch (error) {
      console.error('Face detection error:', error);
      return null;
    }
  }

  async enrollFace(userId: string, imageDataUrls: string[]): Promise<void> {
    if (!this.isModelsLoaded) {
      await this.initializeModels();
    }

    try {
      const descriptors: Float32Array[] = [];

      for (const imageDataUrl of imageDataUrls) {
        const img = new Image();
        img.src = imageDataUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          descriptors.push(detection.descriptor);
        }
      }

      if (descriptors.length === 0) {
        throw new Error('No valid face descriptors found in provided images');
      }

      // Store descriptors for the user
      const existingIndex = this.faceDescriptors.findIndex(fd => fd.userId === userId);
      if (existingIndex >= 0) {
        this.faceDescriptors[existingIndex].descriptors = descriptors;
      } else {
        this.faceDescriptors.push({ userId, descriptors });
      }

      // In a real application, you would send these descriptors to your backend
      // For now, we'll store them locally
      localStorage.setItem('faceDescriptors', JSON.stringify(this.faceDescriptors));
      
      console.log(`Face enrollment completed for user ${userId}`);
    } catch (error) {
      console.error('Face enrollment error:', error);
      throw new Error('Face enrollment failed');
    }
  }

  async recognizeFace(videoElement: HTMLVideoElement): Promise<{ userId: string; confidence: number } | null> {
    if (!this.isModelsLoaded) {
      await this.initializeModels();
    }

    // Load stored descriptors
    const stored = localStorage.getItem('faceDescriptors');
    if (stored) {
      this.faceDescriptors = JSON.parse(stored);
    }

    if (this.faceDescriptors.length === 0) {
      return null;
    }

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        return null;
      }

      const inputDescriptor = detection.descriptor;
      let bestMatch: { userId: string; confidence: number } | null = null;
      let minDistance = Infinity;

      for (const faceDescriptor of this.faceDescriptors) {
        for (const storedDescriptor of faceDescriptor.descriptors) {
          const distance = faceapi.euclideanDistance(inputDescriptor, storedDescriptor);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = {
              userId: faceDescriptor.userId,
              confidence: Math.max(0, 1 - distance) // Convert distance to confidence
            };
          }
        }
      }

      // Threshold for face recognition (you can adjust this)
      const threshold = 0.6;
      if (bestMatch && bestMatch.confidence >= threshold) {
        return bestMatch;
      }

      return null;
    } catch (error) {
      console.error('Face recognition error:', error);
      return null;
    }
  }

  async validateFaceQuality(detection: FaceDetection): Promise<boolean> {
    // Basic quality checks
    const { width, height } = detection.box;
    
    // Check if face is large enough
    if (width < 100 || height < 100) {
      return false;
    }

    // Check if face is roughly centered (basic check)
    const aspectRatio = width / height;
    if (aspectRatio < 0.7 || aspectRatio > 1.4) {
      return false;
    }

    return true;
  }

  clearStoredDescriptors(): void {
    this.faceDescriptors = [];
    localStorage.removeItem('faceDescriptors');
  }

  getUserDescriptors(userId: string): Float32Array[] | null {
    const userDescriptor = this.faceDescriptors.find(fd => fd.userId === userId);
    return userDescriptor ? userDescriptor.descriptors : null;
  }
}

export const faceRecognitionService = new FaceRecognitionService(); 