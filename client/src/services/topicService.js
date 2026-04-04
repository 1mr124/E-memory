import authApi from '../api/authApi';

const topicService = {
  /**
   * Get all root topics (topics with no parent) for the current user.
   */
  getRootTopics: async () => {
    try {
      const response = await authApi.get('/api/v1/topic/roots');
      return response.data;
    } catch (error) {
      console.error('Failed to get root topics:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Move a topic to a new parent topic.
   * @param {number} topicId - The ID of the topic to move
   * @param {number|null} newParentId - The ID of the new parent topic (null to move to root)
   */
  moveTopic: async (topicId, newParentId) => {
    try {
      const response = await authApi.put(`/api/v1/topic/${topicId}/move`, {
        new_parent_id: newParentId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to move topic:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get children (subtopics and infos) of a topic.
   * @param {number} topicId - The ID of the parent topic
   */
  getTopicChildren: async (topicId) => {
    try {
      const response = await authApi.get(`/api/v1/topic/${topicId}/children`);
      return response.data;
    } catch (error) {
      console.error('Failed to get topic children:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get the breadcrumb path for a topic.
   * @param {number} topicId - The ID of the topic
   */
  getBreadcrumb: async (topicId) => {
    try {
      const response = await authApi.get(`/api/v1/topic/${topicId}/breadcrumb`);
      return response.data;
    } catch (error) {
      console.error('Failed to get breadcrumb:', error.response?.data || error);
      throw error;
    }
  },
};

export default topicService;
