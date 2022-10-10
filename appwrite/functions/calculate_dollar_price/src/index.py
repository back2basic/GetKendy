from appwrite.client import Client
import json
import redis
# You can remove imports of services you don't use
# from appwrite.services.account import Account
# from appwrite.services.avatars import Avatars
# from appwrite.services.databases import Databases
from appwrite.services.functions import Functions
# from appwrite.services.health import Health
# from appwrite.services.locale import Locale
# from appwrite.services.storage import Storage
# from appwrite.services.teams import Teams
# from appwrite.services.users import Users

"""
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
"""

def main(req, res):
  client = Client()

  # You can remove services you don't use
  # account = Account(client)
  # avatars = Avatars(client)
  # database = Database(client)
  functions = Functions(client)
  # health = Health(client)
  # locale = Locale(client)
  # storage = Storage(client)
  # teams = Teams(client)
  # users = Users(client)
  
  r = redis.Redis(host=req.variables.get('REDIS_CACHE'),port=req.variables.get('REDIS_PORT'),db=req.variables.get('REDIS_DB'))

  if not req.variables.get('APPWRITE_FUNCTION_ENDPOINT') or not req.variables.get('APPWRITE_FUNCTION_API_KEY'):
    return res.send('Environment variables are not set. Function cannot use Appwrite SDK.')
  else:
    (
    client
      .set_endpoint(req.variables.get('APPWRITE_FUNCTION_ENDPOINT', None))
      .set_project(req.variables.get('APPWRITE_FUNCTION_PROJECT_ID', None))
      .set_key(req.variables.get('APPWRITE_FUNCTION_API_KEY', None))
      # .set_self_signed(True)
    )
    
  coin = req.payload
  
  '''calculate dollar price'''
  try:
    price = dict(json.loads(r.get(coin + "USDT")))
    # print(price)
    price = float(price["c"])
  except TypeError:
    noValueCoins = ["BCX", "JEX", "QI"]
    if coin not in noValueCoins:
      price = functions.create_execution('get_database_price_for_pair', coin + "USDT")
      try:
        price = price.json()
        price = price['response']['price']
      except:
        price = 0
      if price == 0:
        price = functions.create_execution('get_database_price_for_pair', "USDT" + coin)
        try:
          price = price.json()
          price = price['response']['price']
        except:
          price = 0
    else:
      price = 0
  return res.send(price)
