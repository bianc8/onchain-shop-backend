# onchain-shop-backend

GET /secret/{:secretName} - get secret value by name

POST /secret - create new secret w body:
    
  ```json  
  {
    "secretName": "string",
    "secretValue": "string"
  }
  ```

PUT /secret - update secret value by name w body:
    
  ```json  
  {
    "secretName": "string",
    "secretValue": "string"
  }
  ```

DELETE /secret - delete secret by name w body:

  ```json
  {
    "secretName": "string"
  }
  ```