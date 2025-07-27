import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileContract } from 'react-icons/fa';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FaFileContract className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FaceTrack
              </span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">Last updated: January 15, 2024</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using FaceTrack's services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of our face recognition attendance 
                  management platform and all related services provided by FaceTrack.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  FaceTrack provides a cloud-based attendance management system using face recognition 
                  technology. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Biometric face recognition for attendance tracking</li>
                  <li>Multi-organization management platform</li>
                  <li>Real-time attendance monitoring and reporting</li>
                  <li>User management and administrative tools</li>
                  <li>Data analytics and insights</li>
                  <li>Mobile and web application access</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You must create an account to use our services. You are responsible for maintaining 
                  the confidentiality of your account credentials and for all activities that occur 
                  under your account.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your contact information up to date</li>
                  <li>Maintain the security of your login credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may use our service only for lawful purposes and in accordance with these Terms. 
                  You agree to use the service in a manner consistent with any and all applicable laws 
                  and regulations.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Prohibited Activities</h3>
                <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Use the service for any unlawful purpose or to solicit unlawful activity</li>
                  <li>Attempt to gain unauthorized access to any portion of the service</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Upload or transmit viruses or malicious code</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or harvest information about other users</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Biometric Data</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Consent</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our face recognition services, you explicitly consent to the collection, 
                  processing, and storage of your biometric data for attendance tracking purposes.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Data Protection</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All biometric data is encrypted, stored securely, and used solely for the purposes 
                  outlined in our Privacy Policy. We implement industry-standard security measures 
                  to protect your biometric information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription and Payment</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Subscription Plans</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We offer various subscription plans with different features and usage limits. 
                  Current pricing and plan details are available on our website.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Subscription fees are billed monthly or annually in advance</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We may update our pricing with 30 days written notice</li>
                  <li>Failure to pay may result in service suspension</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The service and its original content, features, and functionality are owned by 
                  FaceTrack and are protected by international copyright, trademark, patent, trade 
                  secret, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works of, publicly 
                  display, publicly perform, republish, download, store, or transmit any of the 
                  material on our service without prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While we strive to maintain 99.9% uptime, we do not guarantee that our service will 
                  be uninterrupted or error-free. We may temporarily suspend service for maintenance, 
                  updates, or due to circumstances beyond our control.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are not liable for any loss or damage resulting from service interruptions, 
                  though we will make reasonable efforts to minimize downtime and provide advance notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by applicable law, FaceTrack shall not be liable 
                  for any indirect, incidental, special, consequential, or punitive damages, or any 
                  loss of profits or revenues, whether incurred directly or indirectly.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability shall not exceed the amount paid by you for the service during 
                  the twelve (12) months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may terminate your account at any time by contacting our support team. We may 
                  terminate or suspend your account immediately, without prior notice, for conduct 
                  that we believe violates these Terms or is harmful to other users or the service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the service will cease immediately, and we may 
                  delete your account and data according to our data retention policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of California, United States, 
                  without regard to its conflict of law provisions. Any disputes arising from these Terms 
                  shall be resolved in the state or federal courts located in California.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is 
                  material, we will provide at least 30 days notice prior to any new terms taking effect. 
                  Your continued use of the service after the effective date constitutes acceptance of 
                  the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@facetrack.com</p>
                  <p className="text-gray-700 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p className="text-gray-700"><strong>Address:</strong> 123 Innovation Street, Tech Valley, CA 94102</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 