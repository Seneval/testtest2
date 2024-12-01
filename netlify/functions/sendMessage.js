const OpenAI = require('openai');

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Securely access your API key
    });

    // Create a thread
    const thread = await openai.beta.threads.create();
    const threadId = thread.id;

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Start a run with the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: 'asst_fV1fdSuQipHMoPYAHCpHlw8p',
    });

    // Poll the status until the assistant completes the response
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Retrieve the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');

    if (assistantMessage?.content?.[0]?.text?.value) {
      return {
        statusCode: 200,
        body: JSON.stringify({ response: assistantMessage.content[0].text.value }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: 'Assistant did not return a valid response.' }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
