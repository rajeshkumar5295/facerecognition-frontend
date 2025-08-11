interface AadhaarOtpResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

interface AadhaarVerifyResponse {
  verified: boolean;
  data?: {
    name: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    photo?: string;
  };
  error?: string;
}

class AadhaarService {
  private baseUrl = process.env.REACT_APP_API_URL || 'https://facerecognition-backend-jcu4.onrender.com/api'
  async sendOtp(aadhaarNumber: string): Promise<AadhaarOtpResponse> {
    try {
      // In development, simulate OTP sending
      if (process.env.NODE_ENV === 'development') {
        console.log(`[MOCK] Sending OTP to Aadhaar: ${aadhaarNumber}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: 'OTP sent successfully',
          transactionId: `txn_${Date.now()}`
        };
      }

      const response = await fetch(`${this.baseUrl}/aadhaar/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaarNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async verifyOtp(aadhaarNumber: string, otp: string): Promise<AadhaarVerifyResponse> {
    try {
      // In development, simulate OTP verification
      if (process.env.NODE_ENV === 'development') {
        console.log(`[MOCK] Verifying OTP ${otp} for Aadhaar: ${aadhaarNumber}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock verification - accept specific OTP for demo
        if (otp === '123456') {
          return {
            verified: true,
            data: {
              name: 'John Doe',
              dateOfBirth: '01/01/1990',
              gender: 'M',
              address: 'Mock Address, City, State - 123456'
            }
          };
        } else {
          return {
            verified: false,
            error: 'Invalid OTP'
          };
        }
      }

      const response = await fetch(`${this.baseUrl}/aadhaar/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaarNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  async getAadhaarDetails(aadhaarNumber: string, otp: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/aadhaar/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaarNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch Aadhaar details');
      }

      return data;
    } catch (error) {
      console.error('Get Aadhaar details error:', error);
      throw error;
    }
  }

  validateAadhaarNumber(aadhaarNumber: string): boolean {
    // Remove spaces and check if it's exactly 12 digits
    const cleanNumber = aadhaarNumber.replace(/\s/g, '');
    const aadhaarRegex = /^\d{12}$/;
    
    if (!aadhaarRegex.test(cleanNumber)) {
      return false;
    }

    // Basic Verhoeff algorithm check for Aadhaar number validation
    return this.verhoeffCheck(cleanNumber);
  }

  private verhoeffCheck(aadhaarNumber: string): boolean {
    // Verhoeff algorithm implementation for Aadhaar validation
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const reversedNumber = aadhaarNumber.split('').reverse();

    for (let i = 0; i < reversedNumber.length; i++) {
      c = d[c][p[i % 8][parseInt(reversedNumber[i])]];
    }

    return c === 0;
  }

  formatAadhaarNumber(aadhaarNumber: string): string {
    // Remove all non-digit characters and format with spaces
    const cleaned = aadhaarNumber.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  maskAadhaarNumber(aadhaarNumber: string): string {
    const cleaned = aadhaarNumber.replace(/\s/g, '');
    if (cleaned.length !== 12) return aadhaarNumber;
    
    return `XXXX XXXX ${cleaned.slice(-4)}`;
  }
}

export const aadhaarService = new AadhaarService(); 