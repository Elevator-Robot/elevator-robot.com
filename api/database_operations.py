import boto3
import os

dynamodb = boto3.resource("dynamodb")
conversations_table = dynamodb.Table(
    os.getenv("DYNAMODB_CONVERSATIONS_TABLE_NAME")
)
websocket_connections_table = dynamodb.Table(
    os.getenv("DYNAMODB_WEBSOCKET_TABLE_NAME")
)


def store_connection(connection_id, user_id):
    websocket_connections_table.put_item(
        Item={
            "connectionId": connection_id,
            "userId": user_id,
            "conversationId": connection_id,
            "type": "connection",
        }
    )


def delete_connection(connection_id):
    websocket_connections_table.delete_item(
        Key={"connectionId": connection_id}
    )


def retrieve_conversation(user_id, default_conversation):
    response = conversations_table.get_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"}
    )
    return response.get("Item", {}).get("messages", default_conversation)


def update_conversation(user_id, conversation):
    conversations_table.update_item(
        Key={"userId": user_id, "conversationId": "defaultConversationId"},
        UpdateExpression="SET messages = :val1",
        ExpressionAttributeValues={":val1": conversation},
    )
