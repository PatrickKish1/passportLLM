const { ChatGroq } = require("@langchain/groq");
const {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} = require("@langchain/langgraph");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");
const {
  SystemMessage,
  HumanMessage,
  AIMessage,
  trimMessages,
} = require("@langchain/core/messages");
const { v4: uuidv4 } = require('uuid');

class GroqService {
  constructor() {
    this.llm = new ChatGroq({
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: process.env.GROQ_API_KEY,
    });

    // Initialize message trimmer
    this.trimmer = trimMessages({
      maxTokens: 4000,
      strategy: "last",
      tokenCounter: (msgs) => msgs.length,
      includeSystem: true,
      allowPartial: false,
      startOn: "human",
    });

    // Initialize state and chat history
    this.memorySaver = new MemorySaver();
    this.initializePrompts();
    this.initializeGraph();
  }

  /**
   * Initialize prompt templates
   * @private
   */
  initializePrompts() {
    // Base system prompt
    this.basePrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are a professional passport and visa advisory agent helping users plan their international travel. 
        You provide information about visa requirements, application processes, and travel documentation needed for different countries.
        Think carefully through all scenarios and please provide your best guidance and reasoning.
        
        If the user asks about specific visa information, explain:
        1. Visa types available (tourist, business, work, student, etc.)
        2. If the country offers visa-free travel, visa-on-arrival, or e-visa options
        3. General processing times and fees
        4. Basic document requirements
        5. Any special considerations or recent changes

        Always clarify that this is general information and official government sources should be consulted for the most up-to-date requirements.
        Also suggest that users contact the relevant embassy or consulate for their specific case.`
      ),
      new MessagesPlaceholder("messages"),
    ]);

    // Specific country visa prompt
    this.countryPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are analyzing visa requirements for travel to {country}.
         
         Focus on:
         1. Available visa types for {country}
         2. If {country} offers visa-free access, visa-on-arrival, or e-visa to citizens of various countries
         3. Typical processing times and fees for {country} visas
         4. Required documents for {country} visa applications
         5. Special considerations for {country} (health requirements, return ticket, proof of funds, etc.)
         
         Remember to advise that this is general information and the user should verify with the {country} embassy or official government website.
        `
      ),
      new MessagesPlaceholder("messages"),
    ]);
  }

  /**
   * Initialize the LangGraph state and workflow
   * @private
   */
  initializeGraph() {
    // Define state annotation
    this.GraphAnnotation = Annotation.Root({
      ...MessagesAnnotation.spec,
      country: Annotation(),
      queryType: Annotation()
    });

    // Define model call function
    const callModel = async (state) => {
      try {
        const trimmedMessages = await this.trimmer.invoke(state.messages);
        const prompt = this.selectPrompt(state.queryType);
        const chain = prompt.pipe(this.llm);
        
        const response = await chain.invoke({
          messages: trimmedMessages,
          country: state.country || "the destination"
        });

        return { messages: [response] };
      } catch (error) {
        console.error('Error in model call:', error);
        throw error;
      }
    };

    // Create workflow
    this.workflow = new StateGraph(this.GraphAnnotation)
      .addNode("model", callModel)
      .addEdge(START, "model")
      .addEdge("model", END);

    // Compile application with memory
    this.app = this.workflow.compile({ checkpointer: this.memorySaver });
  }

  /**
   * Select appropriate prompt based on query type
   * @private
   */
  selectPrompt(queryType) {
    switch (queryType?.toLowerCase()) {
      case 'country':
        return this.countryPrompt;
      default:
        return this.basePrompt;
    }
  }

  /**
   * Extract country names from message
   * @private
   */
  extractQueryDetails(message) {
    // Common country names pattern
    const countriesPattern = /\b(?:United States|USA|Canada|Mexico|UK|United Kingdom|England|France|Germany|Italy|Spain|Japan|China|India|Australia|Brazil|Argentina|South Africa|Egypt|UAE|Dubai|Saudi Arabia|Russia|Singapore|Thailand|Vietnam|Malaysia|Indonesia|Philippines|South Korea|North Korea|New Zealand|Ireland|Scotland|Wales|Netherlands|Belgium|Switzerland|Austria|Sweden|Norway|Denmark|Finland|Poland|Greece|Turkey|Israel|Kenya|Nigeria|Ghana|Morocco|Algeria|Tunisia|Chile|Peru|Colombia|Venezuela|Portugal|Croatia|Serbia|Romania|Ukraine|Kazakhstan|Pakistan|Bangladesh|Nepal|Sri Lanka|Jordan|Qatar|Bahrain|Kuwait|Oman|Iceland|Greenland|Cuba|Jamaica|Haiti|Dominican Republic|Panama|Costa Rica|Guatemala|Honduras|El Salvador|Belize|Mongolia|Taiwan|Hong Kong|Macau)\b/gi;
    
    const countries = [...new Set([...message.matchAll(countriesPattern)].map(match => match[0]))];
    
    return {
        countries: countries.map(country => ({
            name: country
        })),
        queryType: this.determineQueryType(message, countries.length > 0)
    };
  }

  /**
   * Determine query type from message content
   * @private
   */
  determineQueryType(message, hasCountry) {
    const message_lower = message.toLowerCase();
    if (hasCountry) {
      return 'country';
    }
    return 'general';
  }

  /**
   * Process message and generate response
   * @public
   */
  async chatWithAssistant(message, threadId = null) {
    try {
      // Extract countries from message
      const {countries, queryType} = this.extractQueryDetails(message);
      
      // Prepare input state
      const input = {
        messages: [{ role: 'user', content: message }],
        country: countries.length > 0 ? countries[0].name : null,
        queryType: queryType
      };

      // Generate config with thread ID
      const config = {
        configurable: {
          thread_id: threadId || uuidv4()
        }
      };

      // Get response from model
      const response = await this.app.invoke(input, config);

      return {
        response: response.messages[response.messages.length - 1],
        threadId: config.configurable.thread_id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }

  /**
   * Get conversation history for a thread
   * @public
   */
  async getConversationHistory(threadId) {
    try {
      return await this.memorySaver.get(threadId);
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history for a thread
   * @public
   */
  async clearConversationHistory(threadId) {
    try {
      await this.memorySaver.delete(threadId);
      return { success: true, message: 'Conversation history cleared' };
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      throw error;
    }
  }
}

// Create singleton instance
const groqService = new GroqService();
Object.freeze(groqService);

module.exports = groqService;