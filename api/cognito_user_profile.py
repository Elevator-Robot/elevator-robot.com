"""This module contains the CognitoUserProfile class."""
import os
import boto3
import dataclasses

# Initialize Cognito client
client = boto3.client("cognito-idp", region_name="us-east-1")

# get environemnt variables
USER_POOL_ID = os.environ.get("USER_POOL_ID")
CLIENT_ID = os.environ.get("CLIENT_ID")


@dataclasses.dataclass
class UserProfile:
    user_id: str
    username: str
    email: str
    role: str

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

    @classmethod
    def get_user(cls, username):
        response = client.admin_get_user(UserPoolId=USER_POOL_ID, Username=username)
        user_attributes = {attr["Name"]: attr["Value"] for attr in response["UserAttributes"]}
        return cls.from_dict(user_attributes)

    @classmethod
    def create_user(cls, username, email, role):
        client.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password="password",
            UserAttributes=[{"Name": "email", "Value": email}, {"Name": "custom:role", "Value": role}],
        )
        return cls(username, email, role)

    @classmethod
    def delete_user(username):
        client.admin_delete_user(UserPoolId=USER_POOL_ID, Username=username)

    @classmethod
    def update_user(cls, username, email, role):
        client.admin_update_user_attributes(
            UserPoolId=USER_POOL_ID,
            Username=username,
            UserAttributes=[{"Name": "email", "Value": email}, {"Name": "custom:role", "Value": role}],
        )
        return cls(username, email, role)

    # handle user logins
    @classmethod
    def login(cls, username, password):
        client.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": username, "PASSWORD": password},
        )
        return cls(username, password)
