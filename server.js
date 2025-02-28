// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const geminiService = require('./services/gemini');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

class TravelAdvisoryServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup middleware
   * @private
   */
  setupMiddleware() {
    // Basic middleware
    this.app.use(express.json());
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Add request ID
    this.app.use((req, res, next) => {
      req.id = uuidv4();
      next();
    });

    // Apply rate limiters
    this.app.use('/api/chat', rateLimiter.chat);
    this.app.use(rateLimiter.standard);

    // Basic security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  /**
   * Setup API routes
   * @private
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'Travel Advisory Assistant API is running',
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    });

    // Chat endpoints
    this.app.post('/', this.handleChatRequest.bind(this));
    this.app.post('/api/chat', this.handleChatRequest.bind(this));
    this.app.get('/api/chat/history/:threadId', this.handleGetHistory.bind(this));
    this.app.delete('/api/chat/history/:threadId', this.handleClearHistory.bind(this));
  }

  /**
   * Setup error handling
   * @private
   */
  setupErrorHandling() {
    this.app.use(errorHandler.notFoundHandler);
    this.app.use(errorHandler.apiErrorHandler);
  }

  /**
   * Handle chat request
   * @private
   */
  async handleChatRequest(req, res, next) {
    try {
      const { message, threadId } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Message is required',
          requestId: req.id
        });
      }

      const response = await geminiService.chatWithAssistant(message, threadId);
      
      res.status(200).json({
        ...response,
        requestId: req.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get chat history request
   * @private
   */
  async handleGetHistory(req, res, next) {
    try {
      const { threadId } = req.params;
      const history = await geminiService.getConversationHistory(threadId);
      
      res.status(200).json({
        history,
        requestId: req.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle clear chat history request
   * @private
   */
  async handleClearHistory(req, res, next) {
    try {
      const { threadId } = req.params;
      await geminiService.clearConversationHistory(threadId);
      
      res.status(200).json({
        message: 'Conversation history cleared',
        requestId: req.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Start the server
   * @public
   */
  start() {
    const port = process.env.PORT || 3000;
    
    this.app.listen(port, () => {
      console.log(`Travel Advisory Assistant API is running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Available endpoints:');
        console.log('- POST /api/chat');
        console.log('- GET /api/chat/history/:threadId');
        console.log('- DELETE /api/chat/history/:threadId');
      }
    });
  }
}

// Create and start server
const server = new TravelAdvisoryServer();
server.start();

module.exports = server.app;