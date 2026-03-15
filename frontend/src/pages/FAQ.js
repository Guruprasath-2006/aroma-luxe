import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Aroma Luxe?',
      answer: 'Aroma Luxe is a premium fragrance store offering a wide range of high-quality perfumes, colognes, and custom fragrance design services. We specialize in luxury scents from renowned brands and offer personalized fragrance creation.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping options are available for 1-2 day delivery. International orders may take 7-14 business days depending on the destination.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unopened products in their original packaging. If you\'re not satisfied with your purchase, please contact our customer service team to initiate a return. Custom-designed fragrances are non-returnable.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status by logging into your account and visiting the Orders page.'
    },
    {
      question: 'What is the Custom Design Studio?',
      answer: 'Our Custom Design Studio allows you to create your own unique fragrance by selecting from various scent notes and preferences. Our AI-powered system helps you design a personalized perfume that matches your style and preferences.'
    },
    {
      question: 'Are your products authentic?',
      answer: 'Yes, all our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every fragrance we sell.'
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer complimentary gift wrapping services for all orders. You can select this option during checkout. We also provide personalized gift messages.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and various digital payment methods. All transactions are secured with SSL encryption.'
    },
    {
      question: 'How do I use the AI Chatbot?',
      answer: 'Our AI chatbot assistant is available 24/7 to help you find the perfect fragrance, answer questions about products, track orders, and provide personalized recommendations. Just click the chat icon in the bottom right corner to start a conversation.'
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 1 hour of placement. After this time, orders enter processing and cannot be changed. Please contact customer service immediately if you need to make changes.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Some restrictions may apply for certain products due to international shipping regulations.'
    },
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button in the navigation bar and fill in your details. Having an account allows you to track orders, save your favorite products, and access exclusive member benefits.'
    },
    {
      question: 'What if my product arrives damaged?',
      answer: 'If your product arrives damaged, please contact us within 48 hours with photos of the damage. We will arrange for a replacement or full refund at no additional cost to you.'
    },
    {
      question: 'Do you offer samples?',
      answer: 'Yes, we offer sample sizes for many of our fragrances. This is a great way to try a scent before committing to a full bottle. Check the product page for sample availability.'
    },
    {
      question: 'How should I store my fragrances?',
      answer: 'Store fragrances in a cool, dry place away from direct sunlight and heat. Keep bottles tightly closed when not in use. Proper storage helps maintain the quality and longevity of your perfumes.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about Aroma Luxe products and services
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiChevronUp className="flex-shrink-0 text-purple-600 text-xl" />
                ) : (
                  <FiChevronDown className="flex-shrink-0 text-gray-400 text-xl" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-purple-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Contact Support
            </a>
            <button
              onClick={() => {
                // This will trigger the chatbot if available
                const chatButton = document.querySelector('[data-chatbot-trigger]');
                if (chatButton) chatButton.click();
              }}
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
            >
              Chat with AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
