aws dynamodb create-table \
    --table-name 'Users' \
    --attribute-definitions 'AttributeName=id,AttributeType=S' 'AttributeName=email,AttributeType=S' \
    --key-schema 'AttributeName=id,KeyType=HASH' \
    --global-secondary-indexes '[{"IndexName":"EmailIndex","KeySchema":[{"AttributeName":"email","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
    --billing-mode 'PAY_PER_REQUEST'

aws dynamodb describe-table --table-name Users --query "Table.TableStatus"