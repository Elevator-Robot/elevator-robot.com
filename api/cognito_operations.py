import json
import requests
from web.storage import localStorage


# get current user profile
def get_user_profile():
    url = "https://0q9d0y8g1i.execute-api.us-east-1.amazonaws.com/dev/user-profile"
    headers = {"Authorization": f"Bearer {localStorage.getItem('access_token')}"}
    response = requests.request("GET", url, headers=headers)
    response = requests.request("GET", url, headers=headers)
    return json.loads(response.text)


# get user name
def get_user_name():
    return get_user_profile()["userProfile"]["username"]
