import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiUser, 
  FiPhone, 
  FiMessageSquare, 
  FiClock, 
  FiCheckCircle,
  FiEye,
  FiTrash2,
  FiFilter
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read, resolved
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/contact/admin', config);
      setMessages(data.contacts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('Failed to load contact messages');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.patch(`/api/contact/${id}`, { status }, config);
      toast.success('Status updated successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`/api/contact/${id}`, config);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <FiMail className="inline mr-1" />;
      case 'read':
        return <FiEye className="inline mr-1" />;
      case 'resolved':
        return <FiCheckCircle className="inline mr-1" />;
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    resolved: messages.filter(m => m.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-white text-xl">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Contact Messages</h1>
          <p className="text-gray-400">Manage customer inquiries and messages</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="luxury-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <FiMessageSquare className="text-primary-500 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="luxury-card p-6 rounded-xl cursor-pointer hover:border-yellow-500"
            onClick={() => setFilter('new')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">New</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.new}</p>
              </div>
              <FiMail className="text-yellow-500 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="luxury-card p-6 rounded-xl cursor-pointer hover:border-blue-500"
            onClick={() => setFilter('read')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Read</p>
                <p className="text-3xl font-bold text-blue-500">{stats.read}</p>
              </div>
              <FiEye className="text-blue-500 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="luxury-card p-6 rounded-xl cursor-pointer hover:border-green-500"
            onClick={() => setFilter('resolved')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
              </div>
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'new'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            New ({stats.new})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'read'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Read ({stats.read})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Resolved ({stats.resolved})
          </button>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="luxury-card p-12 rounded-xl text-center"
          >
            <FiMessageSquare className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No messages found</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="luxury-card p-6 rounded-xl hover:border-primary-500 transition-all"
              >
                {/* Message Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FiUser className="text-primary-500 text-xl" />
                      <h3 className="text-xl font-bold text-white">{message.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        {message.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <FiMail className="text-primary-500" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <FiPhone className="text-primary-500" />
                          {message.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiClock className="text-primary-500" />
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <p className="text-primary-500 font-bold mb-1">Subject:</p>
                  <p className="text-white font-semibold">{message.subject}</p>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <p className="text-primary-500 font-bold mb-1">Message:</p>
                  <p className="text-gray-300 leading-relaxed">{message.message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                  {message.status === 'new' && (
                    <button
                      onClick={() => updateStatus(message._id, 'read')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <FiEye /> Mark as Read
                    </button>
                  )}
                  {message.status === 'read' && (
                    <button
                      onClick={() => updateStatus(message._id, 'resolved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <FiCheckCircle /> Mark as Resolved
                    </button>
                  )}
                  {message.status === 'resolved' && (
                    <button
                      onClick={() => updateStatus(message._id, 'new')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all flex items-center gap-2"
                    >
                      <FiMail /> Reopen
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
