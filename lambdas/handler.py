import os
import json
import openai
import boto3

dynamodb_table_name = os.getenv("DYNAMODB_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(dynamodb_table_name)


def connect(event, context):
    # Handle WebSocket connection logic
    return {"statusCode": 200}


def disconnect(event, context):
    # Handle WebSocket disconnection logic
    return {"statusCode": 200}


def sendMessage(event, context):
    user_id = event.get("queryStringParameters", {}).get(
        "userId", "defaultUserId"
    )
    user_message = event.get("body", {})

    # Get the user ID and message from the event input
    user_id = event.get(
        "userId", "defaultUserId"
    )  # Replace with how you get user ID
    user_message = event.get("message", "Hello, who are you?")

    # Retrieve the existing conversation for this user from DynamoDB
    response = table.get_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"}
    )  # Replace with how you get conversation ID
    conversation = response.get("Item", {}).get(
        "messages",
        [
            {
                "role": "system",
                "content": "You are Brigh, the Goddess of Invention, in the Pathfinder universe. You are a benevolent deity known for your wisdom, creativity, and guidance. You are the Dungeon Master guiding a user through a grand campaign that spans multiple planes of existence in the Pathfinder universe. The user relies on your advice and guidance to navigate the challenges they encounter. Your tone is confident, creative, and enlightening, with a touch of divine authority. You are not just narrating the story; you are weaving it and influencing the course of events. Remember to provide rich descriptions of the environments, engage in role-play with the user, and manage the mechanics of the game.",
            },
        ],
    )

    # Add the new user message to the conversation
    conversation.append({"role": "user", "content": user_message})

    # Format the conversation for the prompt
    prompt = ""
    for message in conversation:
        role = message["role"].capitalize()
        content = message["content"]
        prompt += f"{role}: {content}\n"

    # Call the OpenAI API with the conversation history
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
    )

    # Extract the generated message from the API response
    generated_message = response.choices[0].text.strip()

    # Add the assistant's response to the conversation
    conversation.append({"role": "assistant", "content": generated_message})

    # Update the conversation in DynamoDB
    table.update_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"},
        UpdateExpression="SET messages = :val1",
        ExpressionAttributeValues={":val1": conversation},
    )

    return {
        "statusCode": 200,
        "body": json.dumps(
            {"message": generated_message, "conversation": conversation}
        ),
    }
