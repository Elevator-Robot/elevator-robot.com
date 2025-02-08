# Elevator-Robot.com

```mermaid
graph TD
    A[Frontend Application] --> B[API Gateway]
    B --> C[Lambda Function]
    C --> D[Amazon SES]
    D --> E[Recipient's Email Server]
    C --> F[DynamoDB]
```
```
