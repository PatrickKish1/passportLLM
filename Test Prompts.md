# PassportLLM 🛂 ✈️

A powerful API for visa and passport advisory services, built on the Groq LLM platform.

## Overview

PassportLLM provides AI-powered travel advisory services through a simple, intuitive API. The system assists users with:

- Visa requirements for different nationalities traveling to various countries
- Documentation needed for visa applications
- Information about e-visas and visa-free travel options
- Processing times and fees
- Special travel considerations

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/passport-llm.git

# Navigate to the project directory
cd passport-llm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit the .env file with your GROQ_API_KEY

# Start the server
npm start
```

### Environment Variables

Create a `.env` file with the following:

```env
PORT=3000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
```

## API Endpoints

### Health Check

```http
GET /health
```

Returns the API status and server information.

#### Response Example:

```json
{
  "status": "OK",
  "message": "Travel Advisory Assistant API is running",
  "timestamp": "2025-02-26T12:30:45.123Z",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### Chat Endpoints

#### Send Message

```http
POST /api/chat
```

Send a message to the travel advisory assistant.

#### Request Body:

```json
{
  "response": {
    "lc": 1,
    "type": "constructor",
    "id": ["langchain_core", "messages", "AIMessage"],
    "kwargs": {
      "content": "As a US citizen, you are eligible for Japan's visa-free entry program, which allows you to stay in Japan for up to 90 days for tourism, business, or attending conferences. This information is subject to change and it is always best to verify with the Japanese Embassy or official government websites.\n\nHowever, if you plan to stay for longer than 90 days, work, or engage in activities outside of tourism and business, you will need to apply for a specific visa. Some of the available visa types for Japan include:\n\n1. Work visa: for those who have a job offer from a Japanese company.\n2. Student visa: for those who have been accepted into a Japanese educational institution.\n3. Dependent visa: for those who are married to a Japanese citizen or a long-term resident of Japan.\n4. Cultural activities visa: for those who wish to participate in cultural or artistic events, internships, or research.\n5. Spouse or Child of a Japanese National visa\n\nRegarding visa-on-arrival and e-visa, Japan does not currently offer these options for US citizens. For those who require a visa, the typical processing times range from a few days to a few weeks, depending on the type of visa and the embassy or consulate.\n\nVisa fees vary depending on the type of visa, but generally range from $30 to $200. You can find the most up-to-date fee information on the Japanese embassy or consulate website.\n\nFor a visa application, you will typically need to provide the following documents:\n\n1. A valid passport with at least six months of validity beyond your intended stay in Japan.\n2. A completed visa application form.\n3. One passport-size photograph.\n4. Proof of financial means, such as bank statements or a letter from your employer.\n5. A letter explaining the purpose of your visit.\n6. Any additional documents specific to the type of visa you are applying for.\n\nSpecial considerations for Japan include:\n\n1. Health requirements: no specific vaccinations are required, but travelers should be in good health.\n2. Return ticket: you must have a return or onward ticket.\n3. Proof of funds: you must be able to show proof of sufficient funds for your stay in Japan.\n4. Accommodation: you must have a confirmed hotel reservation or a letter of invitation from your host in Japan.\n\nPlease note that this information is subject to change, and it is always best to verify with the Japanese Embassy or official government websites.",
      "additional_kwargs": {},
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 152,
        "output_tokens": 563,
        "total_tokens": 715
      },
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 563,
          "promptTokens": 152,
          "totalTokens": 715
        },
        "finish_reason": "stop"
      },
      "id": "13e0a869-65be-4788-aa4c-ff94d303bc81"
    }
  },
  "threadId": "44f4038d-a427-49ee-a2a2-f206378be3d2",
  "timestamp": "2025-02-26T23:14:59.465Z",
  "requestId": "bbfa70ea-c098-4b53-8d5e-76b7a6294413"
}
```

#### Response Example:

```json
{
  "response": {
    "role": "assistant",
    "content": "As a US citizen, you can visit Japan for up to 90 days without a visa for tourism or business purposes under Japan's visa waiver program. Here's what you need to know:\n\n1. Your passport must be valid for the duration of your stay\n2. You must have a confirmed return/onward ticket\n3. You may need to show proof of sufficient funds for your stay\n\nIf you plan to stay longer than 90 days or engage in activities like work or study, you'll need to apply for the appropriate visa through the Japanese embassy or consulate.\n\nAlways verify this information with the official Japanese Ministry of Foreign Affairs website as requirements can change."
  },
  "threadId": "f7e6d5c4-b3a2-1098-fedc-ba9876543210",
  "timestamp": "2025-02-26T12:31:15.456Z",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### Get Conversation History

```http
GET /api/chat/history/:threadId
```

Retrieve the history of a specific conversation thread.

#### Response Example:

```json
{
  "history": {
    "messages": [
      {
        "role": "user",
        "content": "What visa do I need to visit Japan as a US citizen?"
      },
      {
        "role": "assistant",
        "content": "As a US citizen, you can visit Japan for up to 90 days without a visa for tourism or business purposes under Japan's visa waiver program..."
      }
    ],
    "country": "Japan",
    "queryType": "country"
  },
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Query Examples

Here are various prompts to test PassportLLM's capabilities:

### Country-Specific Visa Queries

- "What visa do I need to visit Canada as a UK citizen?"
- "As an Indian passport holder, can I get a visa on arrival in Thailand?"
- "Is there an e-visa option for Americans traveling to Turkey?"
- "What's the processing time for a tourist visa to China from Australia?"

### Document Requirements

- "What documents do I need for a Schengen visa application?"
- "Do I need a visa photo for my US visa application? What are the requirements?"
- "Is a bank statement required for a tourist visa to Brazil?"
- "What's the minimum passport validity needed to enter the UAE?"
