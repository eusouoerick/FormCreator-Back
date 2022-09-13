# Criador formularios

Schemas
  - User
    - id
    - adm 
    - name 
    - email
    - password
    - Forms 
    - Answers 

  - Forms
    - id
    - createdBy
    - date
    - Questions
      - id
      - formId
      - type 
      - title
      - Inputs
        - id
        - questionId
        - content
      - value
      - correct_answer  
      - Answers

  - Answers
    - id
    - createdBy
    - formId
    - value

Rotes
  - auth
    - signin
    - sginup
  - users - todas as rotas vao ser com o usuário do token 
    - get all - adm 
    - get 
    - update
    - forms
    - asnswers
  - forms 
    - get all - adm
    - get by token
    - create
    - delete - criador ou adm