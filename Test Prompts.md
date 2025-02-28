# PassportLLM 🛂 ✈️

A powerful API for visa and passport advisory services, built on the Gemini LLM platform.

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
# Edit the .env file with your GEMINI_API_KEY

# Start the server
npm start
```

### Environment Variables

Create a `.env` file with the following:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
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
  "message": "What visa do I need to visit Japan as a US citizen?"
}
```

#### Response Example:

```json
{
  "response": {
    "lc": 1,
    "type": "constructor",
    "id": ["langchain_core", "messages", "AIMessage"],
    "kwargs": {
      "content": "As a US citizen, you're in luck! Japan offers **visa-free entry** for tourists from the United States for stays of up to 90 days. This means you don't need a visa before arriving in Japan for a short-term visit.\n\nHowever, if you plan to stay longer than 90 days or engage in activities other than tourism (e.g., work, study), you will need a specific visa.  Japan offers various visa types, including:\n\n* **Work Visas:**  (e.g.,  Highly Skilled Professional,  Intra-company Transferee,  Engineer/Specialist in Humanities/International Services,  Skilled Labor, etc.)\n* **Student Visas:** For those enrolled in educational institutions in Japan.\n* **General Visas:** Cover activities like cultural activities, short-term business trips, and visiting family.\n* **Specified Visas:** For specific activities like working holiday programs or designated activities.\n* **Dependent Visas:** For family members of those holding other Japanese visas.\n\n\n**Typical Processing Times and Fees:**\n\nWhile you don't need a visa as a tourist, if you require a different visa type, processing times and fees will vary depending on the specific visa and your nationality. Check the Japanese embassy or consulate website for the most accurate information.\n\n**Required Documents (for visa applications, if applicable):**\n\nAgain, you won't need these for short-term tourism, but if you are applying for a visa, typically you'll need:\n\n* Valid Passport: With at least six months validity remaining.\n* Completed Visa Application Form.\n* Photograph: Meeting specific size and format requirements.\n* Documents demonstrating the purpose of your visit (e.g., invitation letter, enrollment certificate, employment contract).\n* Proof of sufficient funds to cover your stay.\n* Flight itinerary and accommodation details.\n* Other documents may be required depending on the specific visa type.\n\n**Special Considerations for Japan:**\n\n* **Health Requirements:** While there are no mandatory vaccinations for general tourist visits, it's always a good idea to consult your doctor about recommended vaccinations and health precautions. Japan has excellent healthcare facilities, but travel insurance is highly recommended.\n* **Return Ticket:** While not always strictly enforced for visa-free entry, having a return or onward ticket is advisable to demonstrate your intention to leave Japan within the allowed period.\n* **Proof of Funds:**  While usually not requested at immigration for short stays, having access to sufficient funds to cover your expenses is important.  It's a good idea to have evidence of funds available, such as bank statements or credit cards.\n* **Customs and Immigration:** Be sure to familiarize yourself with Japanese customs regulations regarding prohibited items.  Cooperate fully with immigration officials upon arrival.\n\n\n**Important Reminder:**  This information is for general guidance only. Visa requirements can change. It is crucial to confirm the latest information and specific requirements with the nearest Japanese embassy or consulate or the official Japanese Ministry of Foreign Affairs website before your trip.  Don't rely solely on third-party information.\n",
      "tool_calls": [],
      "additional_kwargs": {
        "finishReason": "STOP",
        "avgLogprobs": -0.22275234234295901
      },
      "usage_metadata": {
        "input_tokens": 137,
        "output_tokens": 642,
        "total_tokens": 779
      },
      "invalid_tool_calls": [],
      "response_metadata": {
        "finishReason": "STOP",
        "avgLogprobs": -0.22275234234295901
      },
      "id": "9beda687-76d5-41ff-8d0c-714ee5b92f15"
    }
  },
  "threadId": "00f026dc-0c24-4997-88ef-818bad29e728",
  "timestamp": "2025-02-28T09:49:35.979Z",
  "requestId": "ab3b20a5-cf80-4601-8e0c-8cce1b0095da"
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
