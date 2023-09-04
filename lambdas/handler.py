import boto3

# from boto3 import Session
import json
import os
import openai

from aws_lambda_powertools import Logger

logger = Logger(service="assistant")

dynamodb = boto3.resource("dynamodb")
conversations_table = dynamodb.Table(
    os.getenv("DYNAMODB_CONVERSATIONS_TABLE_NAME")
)
websocket_connections_table = dynamodb.Table(
    os.getenv("DYNAMODB_WEBSOCKET_TABLE_NAME")
)

openai.api_key = os.getenv("OPENAI_API_KEY")


def connect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    user_id = event.get("queryStringParameters", {}).get(
        "userId", "defaultUserId"
    )
    websocket_connections_table.put_item(
        Item={
            "connectionId": connection_id,  # Add this line
            "userId": user_id,
            "conversationId": connection_id,
            "type": "connection",
        }
    )
    return {"statusCode": 200}


def disconnect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    websocket_connections_table.delete_item(
        Key={"connectionId": connection_id}
    )
    return {"statusCode": 200}


def sendMessage(event, context):
    # Environment variables
    openai.api_key = os.getenv("OPENAI_API_KEY")
    dynamodb_table_name = os.getenv("DYNAMODB_CONVERSATIONS_TABLE_NAME")

    table = dynamodb.Table(dynamodb_table_name)

    # Get the user ID and message from the event input
    user_id = event.get(
        "userId", "defaultUserId"
    )  # Replace with how you get user ID
    body = json.loads(event.get("body", "") or "{}")

    user_message = body.get("message", "")

    # Retrieve existing conversation from DynamoDB
    response = table.get_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"}
    )
    conversation = response.get("Item", {}).get(
        "messages",
        [
            {
                "role": "system",
                "content": "You are Brigh, the Goddess of Invention, in the Pathfinder universe. You are a benevolent deity known for your wisdom, creativity, and guidance. You are the Dungeon Master guiding a user through a grand campaign that spans multiple planes of existence in the Pathfinder universe. The user relies on your advice and guidance to navigate the challenges they encounter. Your tone is confident, creative, and enlightening, with a touch of divine authority. You are not just narrating the story; you are weaving it and influencing the course of events. Remember to provide rich descriptions of the environments, engage in role-play with the user, and manage the mechanics of the game.",
            },
        ],
    )
    # Add new user message to the conversation
    conversation.append({"role": "user", "content": user_message})

    # Format conversation for the prompt
    # prompt = ""
    # for message in conversation:
    #     role = message["role"].capitalize()
    #     content = message["content"]
    #     prompt += f"{role}: {content}\n"

    # Format conversation for the prompt
    prompt = ""
    for message in conversation:
        role = message["role"].capitalize()
        content = message["content"]
        if role != "Assistant":  # Exclude "Assistant" messages from the prompt
            prompt += f"{content}\n"

    # Call OpenAI API with the conversation history
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
    )

    # Extract generated message from API response
    generated_message = response.choices[0].text.strip()
    print(generated_message)

    if generated_message.startswith("Assistant:"):
        generated_message = generated_message[len("Assistant:") :].strip()

    # Add assistant's response to conversation
    conversation.append({"role": "assistant", "content": generated_message})

    # Update conversation in DynamoDB
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
