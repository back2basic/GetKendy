from appwrite.client import Client
from appwrite.services.functions import Functions

client = Client()

(client
  .set_endpoint('')   # Your API Endpoint
  .set_project('')    # Your project ID
  .set_key('')        # Your secret API key
)

app_env_api = ''    #  Backend FastAPI IP
api = ''            #  http://<ip>:8000/api/   # Backend
redis_cache = ''    #  IP
redis_port = ''
redis_db = ''
endpoint = ''       #  Appwrite
projectId = ''
api_key = ''
databaseId = ''
barometerId = ''

functions = Functions(client)

functions.create_variable('GetTicker', 'APP_ENV_API', app_env_api)

functions.create_variable('get_database_price_for_pair', 'API', api)

functions.create_variable('calculate_dollar_price', 'REDIS_CACHE', redis_cache)
functions.create_variable('calculate_dollar_price', 'REDIS_PORT', redis_port)
functions.create_variable('calculate_dollar_price', 'REDIS_DB', redis_db)
functions.create_variable('calculate_dollar_price', 'APPWRITE_FUNCTION_ENDPOINT', endpoint)
functions.create_variable('calculate_dollar_price', 'APPWRITE_FUNCTION_PROJECT_ID', projectId)
functions.create_variable('calculate_dollar_price', 'APPWRITE_FUNCTION_API_KEY', api_key)

functions.create_variable('update_barometer', 'REDIS_CACHE', redis_cache)
functions.create_variable('update_barometer', 'REDIS_PORT', redis_port)
functions.create_variable('update_barometer', 'REDIS_DB', redis_db)
functions.create_variable('update_barometer', 'APPWRITE_FUNCTION_ENDPOINT', endpoint)
functions.create_variable('update_barometer', 'APPWRITE_FUNCTION_PROJECT_ID', projectId)
functions.create_variable('update_barometer', 'APPWRITE_FUNCTION_API_KEY', api_key)
functions.create_variable('update_barometer', 'APPWRITE_DATABASEID', databaseId)
functions.create_variable('update_barometer', 'APPWRITE_BAROMETERID', barometerId)

functions.create_variable('calculate_bitcoin_price', 'REDIS_CACHE', redis_cache)
functions.create_variable('calculate_bitcoin_price', 'REDIS_PORT', redis_port)
functions.create_variable('calculate_bitcoin_price', 'REDIS_DB', redis_db)
functions.create_variable('calculate_bitcoin_price', 'APPWRITE_FUNCTION_ENDPOINT', endpoint)
functions.create_variable('calculate_bitcoin_price', 'APPWRITE_FUNCTION_PROJECT_ID', projectId)
functions.create_variable('calculate_bitcoin_price', 'APPWRITE_FUNCTION_API_KEY', api_key)