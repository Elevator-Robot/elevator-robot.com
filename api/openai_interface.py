"""This module contains the interface to OpenAI's API."""
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")


def format_prompt(conversation):
    """Format the conversation into a prompt for the API."""
    prompt = ""
    for message in conversation:
        role = message["role"].capitalize()
        content = message["content"]
        if role != "Assistant":  # Exclude "Assistant" messages from the prompt
            prompt += f"{content}\n"
    return prompt


def generate_message(prompt):
    """Generate a message from the prompt."""
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,  # Use prompt directly
        max_tokens=150,
    )
    generated_message = response.choices[0].text.strip()
    if generated_message.startswith("Assistant:"):
        generated_message = generated_message[len("Assistant:") :].strip()  # noqa: E203
    return generated_message
