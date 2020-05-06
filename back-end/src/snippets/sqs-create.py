import boto3

# Create SQS client
sqs = boto3.client('sqs')

# Create a SQS queue
response = sqs.create_queue(
    QueueName='foo',
    Attributes={
        'DelaySeconds': '60',
        'MessageRetentionPeriod': '86400'
    }
)

print(response['QueueUrl'])
