import os
import json
import openai
import boto3

dynamodb_table_name = os.getenv("DYNAMODB_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(dynamodb_table_name)


def connect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    table.put_item(Item={"connectionId": connection_id, "type": "connection"})
    return {"statusCode": 200}


def disconnect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    table.delete_item(Key={"connectionId": connection_id})
    return {"statusCode": 200}


def sendMessage(event, context):
    user_id = event.get("queryStringParameters", {}).get(
        "userId", "defaultUserId"
    )
    user_message = event.get("body", {})

    # Retrieve the existing conversation for this user from DynamoDB
    response = table.get_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"}
    )
    conversation = response.get("Item", {}).get("messages", [])

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
